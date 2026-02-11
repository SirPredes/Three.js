// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;
//attribute float aRandom; //We can retreive aRandom from the attributes we inserted in the js file 

varying vec2 vUv; //Aixo ho necessitarem a nes fragment per posicionar sa textura a lo llarg i ample de sa geometria
varying float vElevation;
//varying float vRandom; //We can pass the vaarying to the fragment shaader

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0); //Més verbos que lo d'abaix pero despres podem jugaramb els valors intermitjos

    float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

    modelPosition.z += elevation;
    //modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    //gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); //Ha d'anar en aquest ordre crec

    vUv = uv;
    vElevation = elevation;
    //vRandom = aRandom;
}