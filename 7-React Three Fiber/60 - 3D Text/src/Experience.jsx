import { OrbitControls, Text3D, Center, useMatcapTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const material = new THREE.MeshMatcapMaterial()

export default function Experience()
{

    const [matcapTexture] = useMatcapTexture('2E763A_78A0B7_B3D1CF_14F209', 256)

    // const [ torusGeometry, setTorusGeometry] = useState()
    // const [ material, setMaterial] = useState()

    useEffect(() => {

        matcapTexture.encoding = THREE.SRGBColorSpace
        matcapTexture.needsUpdate = true

        material.matcap = matcapTexture
        material.needsUpdate = true
    }, [])

    // const donutGroup = useRef() //Jo crec que aqeusta sol·lucio millor

    const donuts = useRef([])

    useFrame((state, delta) => {
        for(const donut of donuts.current){
            donut.rotation.y += delta * 0.2
        }
    })

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <torusGeometry ref={setTorusGeometry}/>
        <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture}/> Ara els arguments per defecte ja ho fan mes guapo, no fa falta tweakear-los */}

        {/* <mesh scale={ 1.5 }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}

        <Center>
            <Text3D 
                material={material}
                font={'./fonts/helvetiker_regular.typeface.json'}
                size={0.75}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                
            >
                HELLO R3F
            </Text3D>
        </Center>

        {/* <group ref={donutGroup}> */}
            {[...Array(100)].map((value, index) => 
                <mesh
                    ref={(element) => donuts.current[index] = element}
                    key={index}
                    geometry={torusGeometry}
                    material={material}
                    position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ]}
                    scale={0.2 + Math.random() * 0.2}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        0
                    ]}
                />)}
        {/* </group> */}

        
    </>
}