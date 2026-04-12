import { OrbitControls, useGLTF, Environment, Center, Float, PresentationControls, ContactShadows, Html, Text } from '@react-three/drei'

export default function Experience()
{
    const computer = useGLTF('https://threejs-journey.com/resources/models/macbook_model.gltf')

    return <>

        <color args={['#241a1a']} attach={'background'} />

        <Environment preset='city' />

        {/* <OrbitControls makeDefault /> */}
        
        {/* <mesh>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}

        <PresentationControls //Mirar es canvis a canvas dins style.css i <canvas> (necessaris per mobil)
            global
            rotation={[0.13, 0.1, 0]} //Aixo es es default
            polar={[-0.4, 0.2]} //Vertical axis
            azimuth={[-1, 0.75]}//Horizontal axis
            damping={0.2}
            snap
        >
            <Center>
                <Float rotationIntensity={0.4}>
                    {/* Light */}
                    <rectAreaLight 
                        width={2.5}
                        height={1.65}
                        intensity={65}
                        color={'white'}
                        rotation={[0.1, Math.PI, 0]}
                        position={[0, 0.55, -1.15]}
                    />
                    {/* Model */}
                    <primitive object={computer.scene}>
                        <Html
                            transform
                            wrapperClass='htmlScreen'
                            distanceFactor={1.17}
                            position={[0, 1.56, -1.4]}//Relatiu a nes model
                            rotation-x={-0.256}
                        >
                            <iframe src='https://es.wikipedia.org/wiki/Medusozoa'/>
                        </Html>
                    </primitive>
                    {/* Text */}
                    <Text
                        font='./BitcountGridDouble-Regular.ttf'
                        fontSize={0.5}
                        position={[2, 1.75, 0.25]}
                        rotation-y={-1.25}
                        maxWidth={2}
                    >
                        Medusas
                    </Text>

                </Float>
            </Center>
        </PresentationControls>

        <ContactShadows 
            position-y={-1.4}
            opacity={0.6}
            scale={5}
            blur={2.4}
        />

    </>
}