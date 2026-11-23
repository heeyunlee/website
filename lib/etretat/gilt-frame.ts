/**
 * A carved gilt frame rendered in WebGL: a height field (moulding profile plus
 * a running leaf ornament, a rope and a course of pearls) lit like gilded
 * wood under a gallery light. Drawn once per size; nothing animates.
 */

const VERT = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner;
void main() { gl_Position = vec4(aCorner, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uSize; // drawing buffer, px
uniform float uT;   // frame thickness, px

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  return vnoise(p) * 0.5 + vnoise(p * 2.1) * 0.25 + vnoise(p * 4.3) * 0.125;
}
// Half-round of half-width w centred on c; 0 outside it.
float round_(float x, float c, float w) {
  float t = clamp((x - c) / w, -1.0, 1.0);
  return sqrt(1.0 - t * t);
}

// a: 0 at the outer edge, 1 at the sight edge. s: distance along the side,
// in frame thicknesses. Returns height in frame thicknesses.
float relief(float a, float s) {
  float h = 0.30 * round_(a, 0.05, 0.05); // outer rail

  // The main torus, carved with leaves that alternate which way they point.
  float v = clamp((a - 0.36) / 0.24, -1.0, 1.0);
  float dome = sqrt(1.0 - v * v);
  float per = 0.62;
  float u = fract(s / per) - 0.5;
  float flip = mod(floor(s / per), 2.0) < 1.0 ? 1.0 : -1.0;
  float t01 = v * flip * 0.5 + 0.5; // 0 at the leaf's base, 1 at its tip
  float halfW = 0.47 * (1.0 - pow(t01, 1.7)) + 0.02;
  float inside = 1.0 - smoothstep(halfW - 0.10, halfW, abs(u));
  float midrib = exp(-pow(u / 0.045, 2.0));
  float veins = 0.5 + 0.5 * cos((abs(u) * 20.0 - t01 * 7.0) * 3.14159);
  float leaf = inside * (0.55 + 0.25 * veins * (1.0 - midrib) + 0.3 * midrib);
  h += step(abs(a - 0.36), 0.24) * dome * (0.5 + 0.5 * leaf);

  // A flat band carrying a twisted rope.
  float band = smoothstep(0.62, 0.66, a) * (1.0 - smoothstep(0.80, 0.84, a));
  float rope = 0.5 + 0.5 * sin(s * 9.0 + (a - 0.73) * 30.0);
  h += band * (0.16 + 0.12 * rope * round_(a, 0.73, 0.07));

  // A course of pearls, then the slope down to the sight edge.
  float pp = 0.11;
  vec2 pc = vec2(fract(s / pp) - 0.5, (a - 0.885) / pp);
  float pr = length(pc) / 0.46;
  h += 0.32 * sqrt(max(1.0 - pr * pr, 0.0));
  h += 0.10 * step(0.93, a) * (1.0 - smoothstep(0.93, 1.0, a));
  return h;
}

float height(vec2 p) {
  float dt = p.y, db = uSize.y - p.y;
  float d = min(min(p.x, uSize.x - p.x), min(dt, db));
  float s = (d == dt || d == db) ? p.x : p.y;
  return relief(d / uT, s / uT) + 0.03 * fbm(p / uT * 26.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  float d = min(min(p.x, uSize.x - p.x), min(p.y, uSize.y - p.y));
  if (d > uT) { outColor = vec4(0.0); return; }

  float h0 = height(p);
  vec3 N = normalize(vec3((h0 - height(p + vec2(1, 0))) * uT * 0.9,
                          (h0 - height(p + vec2(0, 1))) * uT * 0.9, 1.0));
  // Gallery light: from above, a little to the left, in front of the wall.
  vec3 L = normalize(vec3(-0.30, -0.72, 0.62));
  vec3 Hv = normalize(L + vec3(0.0, 0.0, 1.0));

  // Antique gilding: bright on the high points, umber settled in the hollows.
  float up = clamp(h0 * 1.6, 0.0, 1.0);
  vec3 gold = mix(vec3(0.30, 0.20, 0.075), vec3(0.78, 0.60, 0.27), smoothstep(0.08, 0.75, up));
  gold *= 0.88 + 0.24 * fbm(p / uT * 7.0);
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, Hv), 0.0), 30.0);
  vec3 col = gold * (0.36 + 0.82 * diff) + vec3(1.0, 0.9, 0.62) * spec * 0.5 * up;

  float aa = smoothstep(0.0, 1.5, d) * (1.0 - smoothstep(uT - 1.5, uT, d));
  outColor = vec4(col * aa, aa);
}`;

/**
 * Draws the frame into `canvas`, which must already be sized in device
 * pixels. `thickness` is the moulding's width in the same pixels.
 * Returns false if WebGL2 is unavailable.
 */
export function drawGiltFrame(
  canvas: HTMLCanvasElement,
  thickness: number
): boolean {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
  });
  if (!gl) return false;

  const program = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, VERT],
    [gl.FRAGMENT_SHADER, FRAG],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("[etretat]", gl.getShaderInfoLog(shader));
      return false;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(program);
  gl.uniform2f(
    gl.getUniformLocation(program, "uSize"),
    canvas.width,
    canvas.height
  );
  gl.uniform1f(gl.getUniformLocation(program, "uT"), thickness);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // One draw is all this needs; free the GPU objects straight away.
  gl.deleteBuffer(buffer);
  gl.deleteProgram(program);
  return true;
}
