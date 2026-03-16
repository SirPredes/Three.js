
uniform float uSliceStart;
uniform float uSliceArc;

varying vec3 vPosition;

void main(){

    float angle = atan(vPosition.y, vPosition.x); //IMPORTANT: first y then x!!!!!!
    angle -= uSliceStart; //Aixi atan pot no tenir valors negatius que dona aa bugs
    angle = mod(angle, PI2); //A GLSL es mod de un negaatiu va donaant de 1 a 0 mentres va sent mes negatiu
                            //Pero no serveix aa altres llenguatges

    if(angle > 0.0 && angle < uSliceArc){ //Abans (angle > uSliceStart && angle < uSliceStart + uSliceArc)
        discard;
    }

    float csm_Slice; //dona igual si es float, vec3, vec4... Nomes incluir-lo ja executara es codi de patchMap
}