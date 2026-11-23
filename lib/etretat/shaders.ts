/**
 * GLSL for the Étretat Canvas. Three programs:
 *
 *   dab     — stamps one Stroke mark into the paint state (instanced quads)
 *   settle  — advances the paint state one step (fresh paint blooming in)
 *   display — composes Photo + Painting + paint state + the Brush to screen
 *
 * Paint state texture (RGBA8, image space, y down):
 *   R  how Painted this spot will be once the paint has settled
 *   G  how Painted it is now; eases up to R
 *   B  thickness of the paint laid here, for relief lighting
 */

const NOISE = /* glsl */ `
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
`;

export const DAB_VERT = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aPlace; // u, v, angle, seed
layout(location = 2) in vec4 aShape; // half length, half width, dryness, strength
uniform float uAspect;               // image width / height
out vec2 vLocal;
out vec3 vParams;
void main() {
  vLocal = aCorner;
  vParams = vec3(aPlace.w, aShape.z, aShape.w);
  vec2 p = aCorner * aShape.xy;
  float c = cos(aPlace.z), s = sin(aPlace.z);
  vec2 r = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  vec2 uv = aPlace.xy + vec2(r.x, r.y * uAspect);
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
}`;

export const DAB_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vLocal;
in vec3 vParams;
out vec4 outColor;
${NOISE}
void main() {
  vec2 p = vLocal;
  float seed = vParams.x, dry = vParams.y, strength = vParams.z;

  // A loaded bristle brush: full in the belly, ragged at both ends.
  float along = 1.0 - pow(abs(p.x), 3.0);
  float across = 1.0 - pow(abs(p.y), 2.4);
  float body = clamp(along, 0.0, 1.0) * clamp(across, 0.0, 1.0);

  // Bristle streaks run the length of the mark.
  float streak = vnoise(vec2(p.x * 1.5 + seed * 31.7, p.y * 10.0 + seed * 17.3));
  float fine = vnoise(vec2(p.x * 5.0 + seed * 7.1, p.y * 27.0 + seed * 3.3));
  float n = streak * 0.76 + fine * 0.24;

  // A dry brush skips: the threshold rises, bristle gaps open up.
  float m = body * (0.48 + 0.8 * n);
  float th = mix(0.2, 0.62, dry) + 0.22 * pow(abs(p.x), 4.0);
  float cover = smoothstep(th, th + 0.1, m) * strength;

  // Paint piles up along the edges of the mark and in the bristle tracks.
  float ridge = 0.35 * pow(abs(p.y), 3.0) + 0.25 * pow(max(p.x, 0.0), 3.0);
  float height = cover * clamp(0.3 + 0.55 * n + ridge, 0.0, 1.0);

  outColor = vec4(cover, 0.0, height, 0.0);
}`;

export const QUAD_VERT = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner;
out vec2 vUv;
void main() {
  vUv = aCorner * 0.5 + 0.5;
  gl_Position = vec4(aCorner, 0.0, 1.0);
}`;

export const SETTLE_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uPaint;
uniform float uStep;
void main() {
  vec4 s = texture(uPaint, vUv);
  outColor = vec4(s.r, min(s.r, s.g + uStep), s.b, 1.0);
}`;

export const DISPLAY_FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uPhoto, uPainting, uPaint, uFlow;
uniform vec2 uRes;       // drawing buffer size, px
uniform vec2 uCenter;    // image uv at the middle of the screen
uniform vec2 uScale;     // image uv covered by the whole screen
uniform float uAspect;   // image width / height
uniform float uFade;     // 1 normally; runs to 0 while starting over
uniform float uTime;
uniform vec3 uBrush;     // x, y in buffer px (y down), opacity
uniform vec2 uBrushVel;  // buffer px per second
uniform vec2 uBrushUv;
uniform float uBrushR;   // radius in buffer px
${NOISE}
const vec3 LIGHT = vec3(-0.50, -0.62, 0.60);

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Height of the paint surface: Monet's own impasto (his lights are his
// thickest paint) plus the ridges this visitor's Brush left.
float surface(vec2 uv) {
  vec4 s = texture(uPaint, uv);
  return s.r * uFade * (0.62 * luma(texture(uPainting, uv).rgb) + 0.5 * s.b);
}

void main() {
  vec2 sc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = uCenter + (sc / uRes - 0.5) * uScale;

  vec4 st = texture(uPaint, uv);
  float target = st.r * uFade;
  float settled = st.g * uFade;
  float wet = max(target - settled, 0.0);

  // Monet's stroke direction here, as an image-uv step.
  vec3 fl = texture(uFlow, uv).rgb;
  float ang = 0.5 * atan(fl.g * 2.0 - 1.0, fl.r * 2.0 - 1.0);
  vec2 dir = vec2(cos(ang), sin(ang) * uAspect);

  // Wet paint drags the Photo along the stroke before it becomes the Painting.
  vec3 photo = vec3(0.0);
  float wsum = 0.0;
  float reach = 0.04 * wet;
  float jitter = hash(sc) - 0.5;
  for (int i = 0; i < 6; i++) {
    float f = (float(i) + jitter) / 6.0;
    float w = 1.0 - f * 0.7;
    photo += texture(uPhoto, uv - dir * reach * f).rgb * w;
    wsum += w;
  }
  photo /= wsum;

  vec3 paint = texture(uPainting, uv).rgb;

  // Relief lighting across the paint surface.
  vec2 px = uScale / uRes * 1.5;
  float h0 = surface(uv);
  vec3 nrm = normalize(vec3((h0 - surface(uv + vec2(px.x, 0.0))) * 4.5,
                            (h0 - surface(uv + vec2(0.0, px.y))) * 4.5, 1.0));
  vec3 L = normalize(LIGHT);
  vec3 Hv = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = clamp(dot(nrm, L) - L.z, -0.5, 0.5);
  float spec = max(pow(max(dot(nrm, Hv), 0.0), 48.0) - pow(Hv.z, 48.0), 0.0);

  float t = smoothstep(0.0, 1.0, settled);
  vec3 col = mix(photo, paint, t);
  col *= 1.0 + diff * 0.36 * target;
  col += spec * (0.05 + 0.5 * wet) * target;

  // ---- The Brush: a bead of the pigment it is about to lay down ----
  vec2 d = sc - uBrush.xy;
  float speed = length(uBrushVel);
  vec2 vd = speed > 1.0 ? uBrushVel / speed : vec2(1.0, 0.0);
  float stretch = clamp(speed / (uBrushR * 150.0), 0.0, 0.9);
  vec2 q = vec2(dot(d, vd), dot(d, vec2(-vd.y, vd.x)));
  q.x += uBrushR * stretch * 0.6;
  q.x /= 1.0 + stretch;
  q.y *= 1.0 + stretch * 0.3;
  float R = uBrushR * (1.0 + 0.16 * (vnoise(vec2(atan(q.y, q.x) * 1.4, uTime * 0.7)) - 0.5));
  float dist = length(q) - R;
  float bead = (1.0 - smoothstep(-1.2, 1.2, dist)) * uBrush.z;

  vec3 pig = textureLod(uPainting, uBrushUv, 3.5).rgb;
  pig = clamp(mix(vec3(luma(pig)), pig, 1.3), 0.0, 1.0);
  float z = sqrt(max(1.0 - dot(q, q) / (R * R), 0.0));
  vec3 bn = normalize(vec3(q.x * vd - q.y * vec2(-vd.y, vd.x), 0.0) / R + vec3(0.0, 0.0, z + 0.3));
  // Lit only faintly: it should read as a blob of paint, not a glass bead.
  vec3 beadCol = pig * (0.92 + 0.16 * dot(bn, L)) + 0.12 * pow(max(dot(bn, Hv), 0.0), 18.0);

  float shadow = (1.0 - smoothstep(0.0, uBrushR * 0.9, length(d - uBrushR * vec2(0.25, 0.4)) - uBrushR)) * 0.2 * uBrush.z;
  col *= 1.0 - shadow * (1.0 - bead);
  col = mix(col, beadCol, bead);

  outColor = vec4(col, 1.0);
}`;
