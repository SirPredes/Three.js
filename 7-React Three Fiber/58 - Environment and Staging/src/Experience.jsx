import { useFrame, useThree } from '@react-three/fiber'
import { 
    OrbitControls, 
    useHelper,
    BakeShadows,
    SoftShadows,
    AccumulativeShadows,
    RandomizedLight,
    ContactShadows,
    Sky,
    Environment,
    Lightformer,
    Stage
} from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Experience()
{
    const cube = useRef()

    const directionalLight = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1, new THREE.Color('red'))
    
    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    const {color, opacity, blur} = useControls('contact shadows', {
        color: '#000000',
        opacity: { value: 0.5, min: 0, max: 1},
        blur: {value: 1, min: 0, max: 10}
    })

    const {sunPosition} = useControls('sky',{
        sunPosition: { value: [1, 2, 3]}
    })

    const {envMapIntensity, envMapHeight, envMapRadius, envMapScale} = useControls('environment map', {
        envMapIntensity: {value: 1, min: 0, max: 12},
        envMapHeight: {value: 7, min: 0, max: 100},
        envMapRadius: {value: 20, min: 10, max: 1000},
        envMapScale: {value: 100, min: 10, max: 1000},
    })

    // const scene = useThree(state => state.scene)
    // useEffect(() => {
    //     scene.environmentIntensity = envMapIntensity
    // }, [envMapIntensity])

    return <>

        {/* <Environment
            //background
            ground={{
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale
            }}
            //files={[
            //    './environmentMaps/2/px.jpg',
            //    './environmentMaps/2/nx.jpg',
            //    './environmentMaps/2/py.jpg',
            //    './environmentMaps/2/ny.jpg',
            //    './environmentMaps/2/pz.jpg',
            //    './environmentMaps/2/nz.jpg'
            //]}
            //files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
            preset='sunset'
            //resolution={32}
        >
            <color args={['blue']} attach='background'/>
            {/* <mesh position-z={-5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color={[10, 0, 0]}/>
            </mesh> *
            <Lightformer 
                position-z={-5} 
                scale={10} 
                color={'red'}
                intensity={10}
                form={'ring'}
            />
        </Environment> */}

        

        {/* <BakeShadows /> */}
        {/* Aixo calcula ses sombres un pic i despres les usa sempre, aixi que no canvien
            D'aquesta manera es mes optimitzat pero ses sombres no se mouran */}

        {/* <SoftShadows {/* S'optimitzacio sufrira molt si canviam sobre sa marxa els atributs, 
                        aixi que nomes per probar quin es millor i deixar-ho aixi 
            size={25}
            samples={10}
            focus={0}
        />  */}

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <AccumulativeShadows //Nomes se pot fer servir a plans...
            position={[0, -0.999, 0]}
            scale={10}
            color='#316d39'
            opacity={0.8}
            frames={Infinity} //Fa aquesta quantitat de renders es primer frame per sumar ses sombres aixi (despres s'atura i usa aquest resultat (no se mou))
            temporal //Aixo les reparteix un render a cada frame
            blend={100} //Aixo es sa quantitat de sombres que se sumen (default 20)
        >
            <RandomizedLight 
                position={[1, 2, 3]}
                //castShadows
                amount={8}
                radius={1}
                ambient={0.5}
                intensity={3}
                bias={0.001}
            />
        </AccumulativeShadows> */}

        {/* <ContactShadows //Molt performant i sta wapa, pero nomes se pot usar a plans i no es physically accurate 
            position={[0, 0 /*-0.999*, 0]}
            scale={10}
            resolution={512}
            far={5}
            color={color}
            opacity={opacity}
            blur={blur}
            frames={1} //Aixi les podriem bakear, encara que aquesta sombra es bastant performant
        />  */}

        {/* <directionalLight 
            ref={directionalLight} 
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={10}
            shadow-camera-top={5}
            shadow-camera-right={5}
            shadow-camera-bottom={-5}
            shadow-camera-left={-5}
            position={ sunPosition } 
            intensity={ 4.5 } 
        />
        <ambientLight intensity={ 1.5 } /> */}

        {/* <Sky 
            sunPosition={sunPosition}
        /> */}

        {/* <mesh 
            castShadow
            position-x={ - 2 }
            position-y={1}
        >
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh 
            ref={ cube } 
            castShadow
            position-x={ 2 } 
            position-y={1}
            scale={ 1.5 }
        >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh> */}

        {/* <mesh 
            //receiveShadow
            position-y={ 0 } 
            rotation-x={ - Math.PI * 0.5 } 
            scale={ 10 }
        >
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}

        <Stage
            shadows={{
                type: 'contact',
                opacity: 0.2,
                blur: 3
            }}
            environment={'sunset'}
            preset={'rembrandt'}
            intensity={envMapIntensity} //Aixo updateara sol scene.envMapIntensity, aixi que no fa falta es useThree des principi
        >
            <mesh 
                castShadow
                position-x={ - 2 }
                position-y={1}
            >
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh 
                ref={ cube } 
                castShadow
                position-x={ 2 } 
                position-y={1}
                scale={ 1.5 }
            >
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </Stage>

    </>
}