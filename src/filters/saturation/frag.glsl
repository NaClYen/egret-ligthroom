precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform float adjustment;

void main(void) {
    // https://github.com/CesiumGS/cesium/blob/31df31ee189574cbd8a703dda0f4b775e5723470/Source/Shaders/Builtin/Functions/saturation.glsl
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    vec3 intensity = vec3(dot(color.rgb, W));
    gl_FragColor = vec4(mix(intensity, color.rgb, adjustment), color.a);
}