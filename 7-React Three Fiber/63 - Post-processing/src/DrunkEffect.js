import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from "three";
import { deltaTime } from "three/tsl";

const fragmentShader = /* glsl */`
    uniform float frequency;
    uniform float amplitude;
    uniform float offset;

    void mainUv(inout vec2 uv){
        uv.y += sin(uv.x * frequency + offset) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){

        outputColor = vec4(0.6, 1.0, 0.3, inputColor.a);
    }
`

export default class DrunkEffect extends Effect{
    constructor({frequency = 2, amplitude = 0.1, blendFunction = BlendFunction.DARKEN}){
        super('DrunkEffect', 
            fragmentShader, 
            {
                blendFunction: blendFunction,//O nomes blendFunction si totes dues tenen es mateix nom
                uniforms: new Map([
                    ['frequency', new Uniform(frequency)],
                    ['amplitude', new Uniform(amplitude)],
                    ['offset', new Uniform(0)],
                ])
            }
        )
    }

    update(renderer, inputBuffer, deltaTime){ //Un metode amb aquest nom se cridara cada frame automaticament
        this.uniforms.get('offset').value += deltaTime * 2;
    }
}