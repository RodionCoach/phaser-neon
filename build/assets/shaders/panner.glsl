#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D iChannel0;

varying vec2 fragCoord;

mat4 translate(vec3 v)
{
  return mat4(
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  v.x, v.y, v.z, 1
  );
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

vec3 grid(vec2 uv)
{
  mat4 m = translate(vec3(0., -1., 0));

  float d = 1e8;
  for (int i = 0; i < 11; ++i) {
    float z = mod(float(i) - time * float(i != 0), 10.);
    if (i == 0)
    z = 10.;
    vec4 a = m * vec4(-100, 0, z, 1);
    vec4 b = m * vec4( 100, 0, z, 1);
    d = min(d, sdSegment(uv, a.xy / a.z, b.xy / b.z));
  }

  for (int x = 0; x < 16; ++x) {
    vec4 a = m * vec4(float(x) / 1. - 8., 0, 0.1, 1);
    vec4 b = m * vec4(float(x) / 1. - 8., 0, 11, 1);
    d = min(d, sdSegment(uv, a.xy / a.z, b.xy / b.z));
  }

  vec3 col = vec3(0.9, 0.5, 0.9);
  return smoothstep(1. / resolution.y, -1. / resolution.y, d - .003) * col;
}

void main()
{
  vec2 vUv = fragCoord.xy/resolution;
  vec2 uv = (fragCoord - vec2(.5 * resolution.x, resolution.y * 1.095)) / resolution.y;
  vec3 col = grid(uv);

  col = pow(col, vec3(1. / 2.2));
  vec3 back = texture2D( iChannel0, vUv).rgb;
  gl_FragColor = vec4( col + back, 1.0 );
}
