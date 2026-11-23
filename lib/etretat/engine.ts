import {
  DAB_FRAG,
  DAB_VERT,
  DISPLAY_FRAG,
  QUAD_VERT,
  SETTLE_FRAG,
} from "@/lib/etretat/shaders";

/**
 * The Étretat Canvas paint engine (WebGL2, no dependencies).
 *
 * The visitor's Brush leaves Strokes; inside a Stroke the Painting shows in
 * place of the Photo. Each Stroke is a handful of bristle-shaped dabs placed
 * where the Brush went but turned to follow Monet's own brushwork there.
 *
 * Lengths are in "widths": fractions of the image's width.
 */

export type EngineAssets = { photo: string; painting: string; flow: string };

export type EngineOptions = {
  assets: EngineAssets;
  /** Image width / height; the three assets share it. */
  aspect: number;
  /** Where Monet's sun sits in the Painting (image uv), for the invitation. */
  sun: { u: number; v: number };
  /**
   * An element drawn as a paint brush with its tip at its own origin. The
   * engine moves it with the pointer, fades it in and out, and sets
   * `--pigment` on it to the colour of the Painting under the tip. Without
   * it the Brush is drawn as a bead of pigment.
   */
  brushEl?: HTMLElement | null;
  onReady?: () => void;
  /** `painted`: share of the visible Canvas that is Painted, 0..1. */
  onProgress?: (painted: number, byVisitor: boolean) => void;
  /** WebGL went away; the caller should fall back to the still version. */
  onLost?: () => void;
};

export type PaintEngine = {
  startOver: () => void;
  /** Paints the rest of the Canvas for the visitor. */
  reveal: () => void;
  destroy: () => void;
};

const PAINT_W = 1536;
const MAX_DABS = 600;
const FLOATS = 8;
const BLOOM_SECONDS = 1.25;
const WASH_SECONDS = 0.9;
/** Vertical anchor if the canvas is ever not the image's shape and must crop. */
const FOCUS_V = 0.6;
const GRID_W = 96;
const REVEAL_SECONDS = 3;
const BRUSH_CSS_RADIUS = 9;
/** How the brush is held at rest: degrees from pointing straight down, handle to the right. */
const BRUSH_REST_ANGLE = -34;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function compile(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const program = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vert],
    [gl.FRAGMENT_SHADER, frag],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "program link failed");
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i)!.name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

export function createPaintEngine(
  canvas: HTMLCanvasElement,
  opts: EngineOptions
): PaintEngine | null {
  const context = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  if (!context) return null;
  const gl: WebGL2RenderingContext = context;

  const { aspect } = opts;
  const PAINT_H = Math.round(PAINT_W / aspect);
  const GRID_H = Math.round(GRID_W / aspect);

  type Program = ReturnType<typeof compile>;
  let dab: Program, settle: Program, display: Program;
  try {
    dab = compile(gl, DAB_VERT, DAB_FRAG);
    settle = compile(gl, QUAD_VERT, SETTLE_FRAG);
    display = compile(gl, QUAD_VERT, DISPLAY_FRAG);
  } catch (err) {
    console.error("[etretat]", err);
    return null;
  }

  // ---- Geometry: one unit quad, shared; dabs are instanced over it ----
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  const quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const dabData = new Float32Array(MAX_DABS * FLOATS);
  const dabBuffer = gl.createBuffer();
  const dabVao = gl.createVertexArray();
  gl.bindVertexArray(dabVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, dabBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, dabData.byteLength, gl.DYNAMIC_DRAW);
  for (const loc of [1, 2]) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, FLOATS * 4, (loc - 1) * 16);
    gl.vertexAttribDivisor(loc, 1);
  }
  gl.bindVertexArray(null);

  // ---- Paint state: two textures, swapped each settle step ----
  const makeTarget = () => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      PAINT_W,
      PAINT_H,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo };
  };
  let front = makeTarget();
  let back = makeTarget();

  const clearPaint = () => {
    gl.clearColor(0, 0, 0, 0);
    for (const t of [front, back]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  };

  // ---- Image textures ----
  const imageTexture = (img: HTMLImageElement, mips: boolean) => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR
    );
    if (mips) gl.generateMipmap(gl.TEXTURE_2D);
    return tex;
  };
  let photoTex: WebGLTexture | null = null;
  let paintingTex: WebGLTexture | null = null;
  let flowTex: WebGLTexture | null = null;
  let flow: { data: Uint8ClampedArray; w: number; h: number } | null = null;
  // A thumbnail of the Painting, to read the pigment under the Brush.
  let swatch: { data: Uint8ClampedArray; w: number; h: number } | null = null;
  const brushEl = opts.brushEl ?? null;

  // ---- State ----
  let destroyed = false;
  let ready = false;
  let raf = 0;
  let lastFrame = 0;
  let activeUntil = 0;
  let pendingStep = 0;
  let dabCount = 0;
  let washStart = -1;
  let seed = 1;

  // View: which part of the image the screen shows (cover fit).
  let cssW = 1;
  let cssH = 1;
  let dpr = 1;
  const view = { cu: 0.5, cv: FOCUS_V, su: 1, sv: 1 };

  // Brush, in CSS px relative to the canvas.
  const brush = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    opacity: 0,
    shown: false,
    hasPrev: false,
    carry: 0,
    speed: 0, // widths per second, smoothed
    lastMove: 0,
  };

  // Coarse record of what has been Painted, to report progress cheaply.
  const grid = new Uint8Array(GRID_W * GRID_H);
  let lastReported = -1;
  let byVisitor = false;

  // Scheduled dabs (the sun painting itself).
  type Scheduled = { at: number; d: number[] };
  let scheduled: Scheduled[] = [];
  // When a reveal finishes: whatever its strokes missed is filled in. -1 if none.
  let revealEnd = -1;

  const rand = () => {
    // Small deterministic generator: strokes differ, runs don't need crypto.
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const wake = (ms = 2600) => {
    activeUntil = Math.max(activeUntil, performance.now() + ms);
    if (!raf && !destroyed) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const viewAspect = cssW / cssH;
    if (viewAspect > aspect) {
      view.su = 1;
      view.sv = aspect / viewAspect;
    } else {
      view.su = viewAspect / aspect;
      view.sv = 1;
    }
    view.cu = 0.5;
    view.cv = view.sv / 2 + (1 - view.sv) * FOCUS_V;
    lastReported = -1;
    wake(300);
  };

  const toUv = (x: number, y: number) => ({
    u: view.cu + (x / cssW - 0.5) * view.su,
    v: view.cv + (y / cssH - 0.5) * view.sv,
  });

  /** Monet's stroke angle (radians) and how consistent it is, at an image uv. */
  const flowAt = (u: number, v: number) => {
    if (!flow) return { angle: 0, coherence: 0 };
    const x = Math.min(flow.w - 1, Math.max(0, Math.floor(u * flow.w)));
    const y = Math.min(flow.h - 1, Math.max(0, Math.floor(v * flow.h)));
    const i = (y * flow.w + x) * 4;
    const c = flow.data[i] / 127.5 - 1;
    const s = flow.data[i + 1] / 127.5 - 1;
    return { angle: 0.5 * Math.atan2(s, c), coherence: flow.data[i + 2] / 255 };
  };

  const pushDab = (
    u: number,
    v: number,
    angle: number,
    halfLen: number,
    halfWid: number,
    dry: number
  ) => {
    if (dabCount >= MAX_DABS) return;
    dabData.set(
      [u, v, angle, rand() * 100, halfLen, halfWid, dry, 1],
      dabCount * FLOATS
    );
    dabCount++;

    // Mark the progress grid along the dab's length only, so thin, fast
    // strokes with Photo showing between them don't count as fully Painted.
    for (const along of [-0.6, 0, 0.6]) {
      const gx = Math.floor((u + Math.cos(angle) * halfLen * along) * GRID_W);
      const gy = Math.floor(
        (v + Math.sin(angle) * halfLen * along * aspect) * GRID_H
      );
      if (gx >= 0 && gx < GRID_W && gy >= 0 && gy < GRID_H) {
        grid[gy * GRID_W + gx] = 1;
      }
    }
  };

  /** One touch of the Brush at (u, v): a few dabs, shaped by hand speed. */
  const stamp = (u: number, v: number, k: number) => {
    const count = k < 0.6 ? 2 : 1;
    const scatter = mix(0.02, 0.006, k);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * scatter;
      const du = u + Math.cos(a) * r;
      const dv = v + Math.sin(a) * r * aspect;
      const f = flowAt(du, dv);
      const wobble = mix(0.38, 0.12, f.coherence);
      const angle = f.angle + (rand() - 0.5) * 2 * wobble;
      const halfLen =
        0.027 *
        mix(1.2, 0.95, k) *
        (0.7 + 0.6 * rand()) *
        mix(0.8, 1.3, f.coherence);
      const halfWid = halfLen * mix(0.3, 0.15, k) * (0.85 + 0.3 * rand());
      const dry = clamp01(mix(0.2, 0.8, k) + (rand() - 0.5) * 0.15);
      pushDab(du, dv, angle, halfLen, halfWid, dry);
    }
  };

  const reportProgress = () => {
    const x0 = Math.max(0, Math.floor((view.cu - view.su / 2) * GRID_W));
    const x1 = Math.min(GRID_W, Math.ceil((view.cu + view.su / 2) * GRID_W));
    const y0 = Math.max(0, Math.floor((view.cv - view.sv / 2) * GRID_H));
    const y1 = Math.min(GRID_H, Math.ceil((view.cv + view.sv / 2) * GRID_H));
    let on = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) on += grid[y * GRID_W + x];
    }
    const painted = on / Math.max(1, (x1 - x0) * (y1 - y0));
    if (Math.abs(painted - lastReported) >= 0.01) {
      lastReported = painted;
      opts.onProgress?.(painted, byVisitor);
    }
  };

  // ---- The invitation: Monet's sun paints itself ----
  const paintSun = () => {
    const start = performance.now() + 900;
    // A tight swirl, the way he painted it, no wider than the sun's own glow.
    const n = 22;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const a = t * 2.6 * Math.PI * 2 - 1.2;
      const r = 0.001 + 0.0135 * Math.pow(t, 0.8) * (0.85 + 0.3 * rand());
      scheduled.push({
        at: start + t * 1400,
        d: [
          opts.sun.u + Math.cos(a) * r,
          opts.sun.v + Math.sin(a) * r * aspect,
          a + Math.PI / 2,
          mix(0.006, 0.011, t),
          mix(0.004, 0.0055, t),
          mix(0.05, 0.4, t),
        ],
      });
    }
    // Then its reflection, a few dabs stepping down the water towards the visitor.
    const glints = 7;
    for (let i = 0; i < glints; i++) {
      const t = i / (glints - 1);
      const u = opts.sun.u + (rand() - 0.5) * mix(0.02, 0.07, t);
      const v = mix(0.6, 0.93, t) + (rand() - 0.5) * 0.02;
      scheduled.push({
        at: start + 1700 + t * 1500,
        d: [
          u,
          v,
          flowAt(u, v).angle,
          mix(0.014, 0.034, t),
          mix(0.0035, 0.007, t),
          mix(0.3, 0.5, rand()),
        ],
      });
    }
    wake(4800 + BLOOM_SECONDS * 1000);
  };

  // ---- Pointer ----
  const overControl = (target: EventTarget | null) =>
    target instanceof Element && target.closest("a, button") !== null;

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    const painting = inside && !overControl(e.target) && ready && washStart < 0;
    const now = performance.now();

    if (!painting) {
      brush.shown = false;
      brush.hasPrev = false;
      brush.x = x;
      brush.y = y;
      wake(600);
      return;
    }

    if (!brush.hasPrev) {
      brush.x = x;
      brush.y = y;
      brush.hasPrev = true;
      brush.carry = 0;
      brush.speed = 0;
      brush.lastMove = now;
      brush.shown = true;
      wake();
      return;
    }

    const dt = Math.max(1, now - brush.lastMove) / 1000;
    const a = toUv(brush.x, brush.y);
    const b = toUv(x, y);
    const du = b.u - a.u;
    const dv = (b.v - a.v) / aspect;
    const dist = Math.hypot(du, dv); // widths
    const instSpeed = dist / dt;
    brush.speed = mix(brush.speed, instSpeed, 0.35);
    const k = smooth(0.2, 1.5, brush.speed);

    const instVx = (x - brush.x) / dt;
    const instVy = (y - brush.y) / dt;
    brush.vx = mix(brush.vx, instVx, 0.4);
    brush.vy = mix(brush.vy, instVy, 0.4);

    // Lay stamps along the path, evenly spaced however the events arrive.
    // `carry` is how far the Brush has travelled since its last stamp.
    const spacing = mix(0.015, 0.03, k);
    let next = Math.max(0, spacing - brush.carry);
    if (dist > 0) {
      while (next <= dist) {
        const t = next / dist;
        stamp(a.u + (b.u - a.u) * t, a.v + (b.v - a.v) * t, k);
        byVisitor = true;
        next += spacing;
      }
    }
    brush.carry = dist - (next - spacing);

    brush.x = x;
    brush.y = y;
    brush.lastMove = now;
    brush.shown = true;
    wake();
  };

  const onPointerLeave = () => {
    brush.shown = false;
    brush.hasPrev = false;
    wake(600);
  };

  // ---- Frame ----
  const u1i = (p: typeof display, name: string, v: number) =>
    gl.uniform1i(p.uniforms[name], v);

  function frame(now: number) {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016);
    lastFrame = now;

    // Scheduled dabs that have come due.
    if (scheduled.length) {
      const due = scheduled.filter((s) => s.at <= now);
      if (due.length) {
        scheduled = scheduled.filter((s) => s.at > now);
        for (const s of due) {
          pushDab(s.d[0], s.d[1], s.d[2], s.d[3], s.d[4], s.d[5]);
        }
      }
      activeUntil = Math.max(activeUntil, now + 500);
    }
    if (revealEnd >= 0 && now >= revealEnd) {
      revealEnd = -1;
      // One mark far larger than the Canvas covers what the strokes left.
      pushDab(0.5, 0.5, 0, 1.3, 1.3, 0);
      grid.fill(1);
    }

    gl.disable(gl.DEPTH_TEST);

    // 1. New dabs into the paint state. MAX blending: paint only ever adds.
    if (dabCount > 0) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, front.fbo);
      gl.viewport(0, 0, PAINT_W, PAINT_H);
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.MAX);
      gl.useProgram(dab.program);
      gl.uniform1f(dab.uniforms.uAspect, aspect);
      gl.bindVertexArray(dabVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, dabBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, dabData, 0, dabCount * FLOATS);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dabCount);
      gl.disable(gl.BLEND);
      dabCount = 0;
      activeUntil = Math.max(activeUntil, now + BLOOM_SECONDS * 1000 + 400);
      reportProgress();
    }

    // 2. Let fresh paint bloom in. Steps are batched so each one is at least
    //    a couple of 8-bit levels, whatever the display's refresh rate.
    pendingStep += dt / BLOOM_SECONDS;
    if (pendingStep >= 0.012) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, back.fbo);
      gl.viewport(0, 0, PAINT_W, PAINT_H);
      gl.useProgram(settle.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, front.tex);
      u1i(settle, "uPaint", 0);
      gl.uniform1f(settle.uniforms.uStep, pendingStep);
      gl.bindVertexArray(quadVao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      [front, back] = [back, front];
      pendingStep = 0;
    }

    // Starting over: the Painting washes out, then the state is cleared.
    let fade = 1;
    if (washStart >= 0) {
      const t = (now - washStart) / (WASH_SECONDS * 1000);
      fade = 1 - smooth(0, 1, t);
      activeUntil = Math.max(activeUntil, now + 300);
      if (t >= 1) {
        clearPaint();
        grid.fill(0);
        byVisitor = false;
        washStart = -1;
        fade = 1;
        lastReported = -1;
        reportProgress();
        paintSun();
      }
    }

    // Brush easing.
    brush.opacity = mix(
      brush.opacity,
      brush.shown ? 1 : 0,
      1 - Math.exp(-dt * 12)
    );
    const decay = Math.exp(-dt * 7);
    if (now - brush.lastMove > 40) {
      brush.vx *= decay;
      brush.vy *= decay;
      brush.speed *= decay;
    }

    // 3. Compose to the screen.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(display.program);
    const bind = (unit: number, tex: WebGLTexture | null, name: string) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      u1i(display, name, unit);
    };
    bind(0, photoTex, "uPhoto");
    bind(1, paintingTex, "uPainting");
    bind(2, front.tex, "uPaint");
    bind(3, flowTex, "uFlow");
    const U = display.uniforms;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform2f(U.uCenter, view.cu, view.cv);
    gl.uniform2f(U.uScale, view.su, view.sv);
    gl.uniform1f(U.uAspect, aspect);
    gl.uniform1f(U.uFade, fade);
    gl.uniform1f(U.uTime, now / 1000);
    gl.uniform3f(
      U.uBrush,
      brush.x * dpr,
      brush.y * dpr,
      brushEl ? 0 : brush.opacity
    );
    gl.uniform2f(U.uBrushVel, brush.vx * dpr, brush.vy * dpr);
    const buv = toUv(brush.x, brush.y);
    gl.uniform2f(U.uBrushUv, buv.u, buv.v);
    gl.uniform1f(U.uBrushR, BRUSH_CSS_RADIUS * dpr);
    if (brushEl) {
      const rect = canvas.getBoundingClientRect();
      // The handle trails the hand: it leans back against the motion.
      const lean = Math.max(-16, Math.min(16, -brush.vx / 90));
      brushEl.style.transform = `translate(${rect.left + brush.x}px, ${
        rect.top + brush.y
      }px) rotate(${BRUSH_REST_ANGLE + lean}deg)`;
      brushEl.style.opacity = brush.opacity.toFixed(3);
      if (swatch) {
        const sx = Math.min(
          swatch.w - 1,
          Math.max(0, Math.floor(buv.u * swatch.w))
        );
        const sy = Math.min(
          swatch.h - 1,
          Math.max(0, Math.floor(buv.v * swatch.h))
        );
        const i = (sy * swatch.w + sx) * 4;
        const [r, g, b] = [
          swatch.data[i],
          swatch.data[i + 1],
          swatch.data[i + 2],
        ];
        // A little richer than the dry Painting, like paint still wet.
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        const rich = (c: number) =>
          Math.round(Math.max(0, Math.min(255, l + (c - l) * 1.3)));
        brushEl.style.setProperty(
          "--pigment",
          `rgb(${rich(r)} ${rich(g)} ${rich(b)})`
        );
      }
    }
    gl.bindVertexArray(quadVao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // The Brush keeps easing while it is on the Canvas, so keep drawing.
    if (brush.shown) activeUntil = Math.max(activeUntil, now + 200);
    if (now < activeUntil) raf = requestAnimationFrame(frame);
    else lastFrame = 0;
  }

  // ---- Lifecycle ----
  const onContextLost = (e: Event) => {
    e.preventDefault();
    opts.onLost?.();
  };
  const onVisibility = () => {
    if (!document.hidden) wake(300);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("blur", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);

  Promise.all([
    loadImage(opts.assets.photo),
    loadImage(opts.assets.painting),
    loadImage(opts.assets.flow),
  ])
    .then(([photo, painting, flowImg]) => {
      if (destroyed) return;
      photoTex = imageTexture(photo, true);
      paintingTex = imageTexture(painting, true);
      flowTex = imageTexture(flowImg, false);

      const c = document.createElement("canvas");
      c.width = flowImg.naturalWidth;
      c.height = flowImg.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(flowImg, 0, 0);
        flow = {
          data: ctx.getImageData(0, 0, c.width, c.height).data,
          w: c.width,
          h: c.height,
        };
      }

      if (brushEl) {
        const s = document.createElement("canvas");
        s.width = 96;
        s.height = Math.round(96 / aspect);
        const sctx = s.getContext("2d", { willReadFrequently: true });
        if (sctx) {
          sctx.drawImage(painting, 0, 0, s.width, s.height);
          swatch = {
            data: sctx.getImageData(0, 0, s.width, s.height).data,
            w: s.width,
            h: s.height,
          };
        }
      }

      resize();
      ready = true;
      wake();
      // Draw one frame before announcing, so the canvas never shows blank.
      requestAnimationFrame(() => {
        if (destroyed) return;
        opts.onReady?.();
        paintSun();
      });
    })
    .catch((err) => {
      console.error("[etretat]", err);
      if (!destroyed) opts.onLost?.();
    });

  return {
    reveal() {
      if (!ready || washStart >= 0 || revealEnd >= 0) return;
      // Paint starts at a handful of random spots and spreads out from each
      // until the patches meet, in broad wet strokes that follow Monet's
      // brushwork like any other Stroke.
      const start = performance.now();
      const spots = Array.from({ length: 9 }, () => ({
        u: rand(),
        v: rand(),
        delay: rand() * 0.35,
      }));
      // 0 where a spot begins, about 1 at the last place the paint reaches.
      const reach = (u: number, v: number) => {
        let t = Infinity;
        for (const s of spots) {
          const d = Math.hypot(u - s.u, (v - s.v) / aspect);
          t = Math.min(t, s.delay + d * 1.9);
        }
        return Math.min(1, t);
      };
      const cols = 44;
      const rows = Math.round(cols / aspect);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const u = (i + rand()) / cols;
          const v = (j + rand()) / rows;
          const f = flowAt(u, v);
          const halfLen = 0.05 * (0.8 + 0.4 * rand());
          scheduled.push({
            at:
              start +
              (reach(u, v) * 0.88 + rand() * 0.12) * REVEAL_SECONDS * 1000,
            d: [
              u,
              v,
              f.angle + (rand() - 0.5) * 0.5,
              halfLen,
              halfLen * 0.32,
              0.1 + 0.25 * rand(),
            ],
          });
        }
      }
      revealEnd = start + REVEAL_SECONDS * 1000 + 200;
      byVisitor = true;
      wake(REVEAL_SECONDS * 1000 + 2000);
    },
    startOver() {
      if (!ready || washStart >= 0) return;
      scheduled = [];
      revealEnd = -1;
      washStart = performance.now();
      wake(WASH_SECONDS * 1000 + 400);
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      );
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
    },
  };
}
