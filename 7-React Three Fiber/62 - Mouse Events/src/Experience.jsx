import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, meshBounds } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()
    
    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler = (event) => {
        cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`)        
    }

    const hamburger = useGLTF('./hamburger.glb')

    return <>

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <mesh position-x={ - 2 } onClick={(event => event.stopPropagation())}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh 
            ref={ cube } 
            raycast={meshBounds} //Aqui li deim que no calculi damunt sa geometria sino damunt una esfera (menys precis pero molt mes optim)
            position-x={ 2 } 
            scale={ 1.5 } 
            onClick={eventHandler}
            onPointerEnter={() => {document.body.style.cursor = 'pointer'}} //Aqui se podria fer a nes canvas en ves de es document sencer
            onPointerLeave={() => {document.body.style.cursor = 'default'}} //Aixo se faria usant useThree per obteir acces a webgl i canvas
        >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <primitive
            object={hamburger.scene}
            scale={0.5}
            position-y={0.5}
            onClick={(event) => {
                console.log('event')
                event.stopPropagation()
            }}
        />

    </>
}