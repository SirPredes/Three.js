
uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

#include ../includes/remap.glsl

void main (){

    vec3 newPosition = position;
    float progress = uProgress * aTimeMultiplier;

    //Exploding
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0); 
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    //Falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0); //Anira desde 0.1 a nes total des temps desde 0 fins a 1
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    //Scaling
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    //Twinkle
    float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
    float sizeTwinkle = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkle = 1.0 - (sizeTwinkle * twinkleProgress);

    //Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    //Final size
    gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkle; //Aixo es perque sa mida des punts tambe canvii segons sa resolucio i no tenguin sempre sa mateixa mida
    gl_PointSize *= 1.0 / - viewPosition.z; //IMPORTANT: Es signe de negatiu, sino se veu molt molt petit

    if(gl_PointSize < 1.0){
        gl_Position = vec4(9999.9); //Per algunes GPU ses particules estan clamp a 1.0, aixi que se veuen i renderitzen. Per sol-lucionar-ho,
                                    //si tenen un tamany mes petit que 1.0, els movem molt enfora i aixi no se renderitzen
    }
}