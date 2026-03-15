
#include ../includes/simplexNoise4d.glsl
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

//varying vec2 vUv;
varying float vWobble;

float getWobble(vec3 position){

    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequency
    )) * uWarpStrength;

    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency, //xyz
        uTime * uTimeFrequency       //w
    )) * uStrength;
}

void main(){
    //csm_Position.y += sin(csm_Position.x * 3.0) * 0.5;

    vec3 biTangent = cross(normal, tangent.xyz);

    //Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent.xyz * shift;

    //Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA    += getWobble(positionA) * normal;
    positionB    += getWobble(positionB) * normal;

    //Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    csm_Normal = cross(toA, toB);

    //Varying
    //vUv = uv;
    vWobble = wobble / uStrength; //Aixo es per treure uStrength que estava multiplicat perque vagi de 0 a 1 un altre pic
}