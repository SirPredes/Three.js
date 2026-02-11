//precision mediump float;

uniform vec3 uColor;

uniform sampler2D uTexture;

varying vec2 vUv; //Aquest l'hem de rebre desde es vertex shader
varying float vElevation;

//varying float vRandom;

void main(){

    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.56;
    gl_FragColor = vec4(textureColor);
    //gl_FragColor = vec4(0.0, 1.0, 0.5, 1.0);
}