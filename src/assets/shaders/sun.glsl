#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 fragCoord;

void main()
{
  vec2 vUv = fragCoord.xy/resolution;
  vUv *= -1.0;
  vec4 back = texture2D(iChannel0, vUv);
  vec4 grid = texture2D(iChannel1, vec2(vUv.x, vUv.y * 1.5 - time * 0.01));
  gl_FragColor = vec4(back.rgb * grid.rgb, back.a);
}
