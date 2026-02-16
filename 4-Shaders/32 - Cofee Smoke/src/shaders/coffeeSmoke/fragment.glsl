
uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main(){

    //Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= (uTime * 0.03);

    //Smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    //Remap
    smoke = smoothstep(0.4, 1.0, smoke); //Returns a value clamped between 0 and 1

    //edges
    smoke *= smoothstep(0.0, 0.15, vUv.x);
    smoke *= smoothstep(1.0, 0.85, vUv.x);
    smoke *= smoothstep(0.0, 0.15, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);
    

    //Final Color
    gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment> //Important perque sino es colors se veuran raros
}