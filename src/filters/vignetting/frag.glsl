precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;

uniform lowp vec2 vignetteCenter;
uniform lowp vec3 vignetteColor;
uniform highp float vignetteStart;
uniform highp float vignetteEnd;

void main(void) {

    lowp vec4 sourceColor = texture2D(uSampler, vTextureCoord) * vColor;
    lowp float d = distance(vTextureCoord, vec2(vignetteCenter.x, vignetteCenter.y));
    lowp float percent = smoothstep(vignetteStart, vignetteEnd, d);

    gl_FragColor = vec4(mix(sourceColor.rgb, vignetteColor, percent), sourceColor.a);
}