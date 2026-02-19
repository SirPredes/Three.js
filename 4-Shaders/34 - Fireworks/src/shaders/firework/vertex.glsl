
uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax){
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main (){

    vec3 newPosition = position;

    //Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    //Final size
    gl_PointSize = uSize * uResolution.y * aSize; //Aixo es perque sa mida des punts tambe canvii segons sa resolucio i no tenguin sempre sa mateixa mida
    gl_PointSize *= 1.0 / - viewPosition.z; //IMPORTANT: Es signe de negatiu, sino se veu molt molt petit
}