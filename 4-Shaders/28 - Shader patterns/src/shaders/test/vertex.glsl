
//attribute vec2 uv; //Aixo ja no ho hem de posar perque estam a un ShaderMaterial i no un RawShaderMaterial

varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
}