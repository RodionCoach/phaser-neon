#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec2 fragCoord;

float snoise(vec3 uv, float res)
{
  const vec3 s = vec3(1e0, 1e2, 1e3);

  uv *= res;

  vec3 uv0 = floor(mod(uv, res))*s;
  vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;

  vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

  vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

  vec4 r = fract(sin(v*1e-1)*1e3);
  float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

  r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
  float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

  return mix(r0, r1, f.z)*2.-1.;
}

void main()
{
  vec2 p = 2.0 * (fragCoord.xy/resolution) - 1.0;
  p.x -= 0.95;
  p.y *= 0.125;
  p.y += 0.11;
  float t = time * 0.35;
  float color = 4.0 - (4.*(10.*p.y + sin(p.x * 1.75)));

  vec3 coord = vec3(p.y - sin(p.x + 0.75) * 1.125 + cos(p.x - 0.75) * 1.125, p.y * 0.125, p.x * 0.8);

  for(int i = 1; i <= 2; i++)
  {
    float power = pow(1.5, float(i));
    color += pow((2.0 / power) * snoise(coord + vec3(-t*.0125,-t*.05, -t*.01), power*8.), 2.0);
  }
  vec3 totalColor = vec3(color, pow(max(color,0.),1.)*0.4, pow(max(color,0.),1.)*0.015) * 0.5;
  gl_FragColor = vec4( totalColor, max(max(totalColor.r, totalColor.g), totalColor.b));
}
