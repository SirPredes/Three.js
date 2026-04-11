import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { EffectComposer, ToneMapping, Vignette, Glitch, Noise, Bloom, DepthOfField } from '@react-three/postprocessing' 
import { ToneMappingMode, BlendFunction, GlitchMode} from 'postprocessing'
import Drunk from './Drunk'
import { useRef } from 'react'
import { useControls } from 'leva'

export default function Experience()
{

    const drunkRef = useRef()

    const drunkProps = useControls('Drunk Effect',{
        frequency: {value: 5, min: 1, max: 20},
        amplitude: {value: 0.1, min: 0, max: 1},
    })

    return <>

        <color args={['#ffffff']} attach={'background'} />

        <EffectComposer multisampling={0} /*Aixo es s'AntiAliasing*/>
            {/* <Vignette 
                offset={0.3}
                darkness={0.9}
                blendFunction={BlendFunction.NORMAL}
            /> */}

            {/* <Glitch 
                delay={[0.5, 1]}
                duration={[0.1, 0.3]}
                strength={[0.2, 0.4]}
                mode={GlitchMode.CONSTANT_WILD}
            /> */}

            {/* <Noise 
                blendFunction={BlendFunction.SOFT_LIGHT}
                premultiply //Taa wapo, pero canviaa molt es color
            /> */}

            {/* <Bloom //Per  aquest mirar es color attribute des cub material
                luminanceThreshold={1.1}
                mipmapBlur //(Ara esta per defecte activat)
                intensity={0.5} //Per donarli un toque li podem posar es threshold a 0 i sa intensitat molt baixa i casi no se nota
            /> */}

            {/* <DepthOfField 
                focusDistance={0.025} //Aquests valors estan normalitzats (0 a 1) entre es near i far de sa camara
                focalLength={0.025}
                bokehScale={6}
            /> */}

            <Drunk 
                ref={drunkRef}
                // frequency={5}
                // amplitude={0.1}
                {...drunkProps}
                //blendFunction={BlendFunction.DARKEN}
            />

            <ToneMapping 
                mode={ToneMappingMode.ACES_FILMIC} //Aixo es perque no se llevi es tonemapping que hi ha per defecte a R3F
                //IMPORTANT!!!!!!!!! Deixar a nes final de effect composer!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            />
        </EffectComposer>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            {/* <meshStandardMaterial color={[1.5, 1, 4]} toneMapped={false}/> */}
            {/* <meshStandardMaterial color={'white'} emissive={'purple'} emissiveIntensity={10} toneMapped={false}/> */}
            {/* <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false}/> */}
            <meshStandardMaterial color={'mediumpurple'} toneMapped={false}/>
        </mesh>

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}