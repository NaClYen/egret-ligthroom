precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform float brightness;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = vec4((color.rgb + vec3(brightness)), color.a);
}