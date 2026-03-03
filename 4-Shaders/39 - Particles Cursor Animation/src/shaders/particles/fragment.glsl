
varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = distance(uv, vec2(0.5)); //Tambe podria ser length(uv - vec2(0.5))

    if(distanceToCenter > 0.5){
        discard; //Aalerta perque pot tenir performance impact 
                //perque quan ha de mirar que esta per davant de que ha de comprobar tots els discards
                //LLaavors s'ha de vigilar  si n'hi ha molts
    }

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}