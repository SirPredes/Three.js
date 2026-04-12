import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, CuboidCollider, BallCollider, CylinderCollider, InstancedRigidBodies } from '@react-three/rapier'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience()
{
    const [hitSound] = useState(() => new Audio('./hit.mp3')) //Nomes cream una instancia de audio encara que se rerenderitzi

    const cube = useRef()
    const twister = useRef()

    const cubeJump = () => {
        const mass = cube.current.mass()
        cube.current.applyImpulse({x: 0, y: 5 * mass, z: 0}, true)
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5, 
            y: Math.random() - 0.5, 
            z: Math.random() - 0.5
        }, true)
    }

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        
        const eulerRotation = new THREE.Euler(0, time * 3, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        twister.current.setNextKinematicRotation(quaternionRotation)

        const angle = time * 0.5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twister.current.setNextKinematicTranslation({x: x, y: -0.8, z: z})
    })

    const collisionEnter = () => {
        // hitSound.currentTime = 0
        // hitSound.volume = ºMath.random()
        // hitSound.play()
        console.log('collision!')
    }

    const hamburger = useGLTF('./hamburger.glb')

    const cubesCount = 300
    // const cubes = useRef()

    // useEffect(() =>{
    //     for(let i = 0; i < cubesCount; i++){
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubes.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    const instances = useMemo(() => {
        const instances = []

        for(let i = 0; i < cubesCount; i++){
            instances.push({
                key: 'instance_' + i,
                position: [
                    (Math.random() - 0.5) * 8, 
                    6 + i * 0.2, 
                    (Math.random() - 0.5) * 8],
                rotation: [ 0, 0, 0 ],
            })
        }

        return instances
    }, [])

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <Physics 
            debug={false} //Util pero es wireframes poden tenir problemes de performance
            //gravity={[0, -1.6, 0]}
        >
            
            <RigidBody
                colliders='ball'
            >
                <mesh castShadow position={ [ -1, 4, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            {/* <RigidBody
                colliders={false}
                position={[0,1,0]} 
                rotation={[Math.PI * 0.5, 0, 0]}
            >
                {/* <CuboidCollider args={[1.5, 1.5, 0.5]}/>
                <CuboidCollider 
                    args={[0.25, 1, 0.25]} 
                    position={[0, 0, 1]} 
                    rotation={[-Math.PI * 0.35, 0, 0]}
                /> 
                <BallCollider args={[1.5]}/>
                <mesh castShadow >
                    <torusGeometry args={[1, 0.5, 16, 32]}/>
                    <meshStandardMaterial color={'mediumpurple'}/>
                </mesh>
            </RigidBody> */}

            <RigidBody 
                ref={cube} 
                position={[1.5, 2, 0]} 
                gravityScale={1}
                restitution={1}
                //friction={0.01}//Default 0.7
                colliders={false}
                // onCollisionEnter={collisionEnter}
                // onCollisionExit={() => console.log('exit!')}
                // onSleep={() => console.log('sleep!')}
                // onWake={() => console.log('Wake!')}
            >
                <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5}/>
                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry />
                    <meshStandardMaterial color={'mediumpurple'} />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={twister}
                position={[0, -0.8, 0]}
                friction={0}
                type='kinematicPosition'
            >
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color={'red'}/>
                </mesh>
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody
                colliders={false}
                position={[0, 4, 0]}
            >
                <CylinderCollider args={[0.5, 1.25]}/>
                <primitive object={hamburger.scene} scale={0.25}/>
            </RigidBody>

            <RigidBody type='fixed'>
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.25]}/>
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.25]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[5.25, 1, 0]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[-5.25, 1, 0]}/>
            </RigidBody>

            <InstancedRigidBodies instances={instances}>
                <instancedMesh /* ref={ cubes } */ castShadow receiveShadow args={ [ null, null, cubesCount ] }>
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />
                </instancedMesh>
            </InstancedRigidBodies>

        </Physics>

    </>
}