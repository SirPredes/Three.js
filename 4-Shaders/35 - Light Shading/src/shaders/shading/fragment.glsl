uniform vec3 uColor;
uniform vec3 uLightColor;
uniform float uLightIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 color = uColor;
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = vPosition - cameraPosition;
    viewDirection = normalize(viewDirection);

    //Light
    vec3 light = vec3(0.0);
    light  += ambientLight(
        uLightColor, 
        uLightIntensity
    );
    //I aqui sumaariem ses altres llums si n'hi haagues

    light += directionalLight(
        vec3(0.1, 0.1, 1.0), // Light color
        1.0,                 // Light intensity,
        normal,              // Normal
        vec3(0.0, 0.0, 3.0), // Light position
        viewDirection,       // View direction
        20.0                 // Specular power
    );

    light += pointLight(
        vec3(1.0, 0.1, 1.0), // Light color
        1.0,                 // Light intensity,
        normal,              // Normal
        vec3(0.0, 2.5, 0.0), // Light position
        viewDirection,       // View direction
        20.0,                // Specular power
        vPosition,           // Position
        0.25                // Light decay
    );

    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}