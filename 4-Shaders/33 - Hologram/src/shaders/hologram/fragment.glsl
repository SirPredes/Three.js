
uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main(){

    //Renormalize
    vec3 normal = normalize(vNormal); //Si no ho feim, entre una normal i s'altra s'interpolarien els valors i resultaria amb algunes normals
                                     //més curtes entre ses normals que valen 1, per aixo se vorien com linies més fosques.

    if(!gl_FrontFacing){
        normal *= -1.0;
    }

    //Stripes
    float stripes = mod((vPosition.y - uTime * 0.04) * 30.0, 1.0);
    stripes = pow(stripes, 3.0);

    //Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0; //Es dot product serveix per veure com de coincidents son ses direccions de dos vectors
                                                      // Si sa direcció es sa mateixa donara 1 i si son perpendiculars donara 0
    fresnel = pow(fresnel, 2.0);

    //Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);

    //Hologram
    float hologram = stripes * fresnel;
    hologram += fresnel * 1.25;
    hologram *= falloff;

    //Final color
    gl_FragColor = vec4(uColor, hologram);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}