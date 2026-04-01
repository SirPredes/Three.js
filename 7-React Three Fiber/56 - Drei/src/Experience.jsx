// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })
import { OrbitControls, TransformControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience(){

    const cube = useRef()
    const sphere = useRef()

    return <>

        <OrbitControls
            //enableDamping={true}
            makeDefault
        />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <PivotControls 
            anchor={ [0, 0, 0] } //Aixo son unitats relatives a nes model (si posam 0, 1, 0, estara just adalt des model)
            depthTest={ false }
            lineWidth={ 4 }
            axisColors={ [ '#9381ff', '#ff466d', '#7ae582' ] }
            scale={ 1 }
            //fixed={ true }
        >

            <mesh ref={sphere} position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html 
                    position={ [1, 1, 0] }
                    wrapperClass='label' //Amb aixo li podrem fer target amb css
                    center //Fa que es centre des div sigui es centre de s'element
                    distanceFactor={ 10 }
                    occlude={ [sphere, cube] }
                >
                    That's a sphere 🦍
                </Html>
            </mesh>
        
        </PivotControls>

        <mesh ref={cube} position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <TransformControls object={cube} mode='translate'/>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial 
                resolution={512}
                blur={ [1000, 1000] }
                mixBlur={ 0.5 } //0 seria que no esta blur en absolut, 1 es 100% blur
                color={'greenyellow'}
            />
        </mesh>

        <Float 
            speed={ 5 }ç
            floatIntensity={2}
        >
            <Text
                font='./bangers-v20-latin-regular.woff'
                color={'salmon'}
                position-y={2}
                maxWidth={2}
                textAlign='center'
            >
                I LOVE R3F
                {/* <meshNormalMaterial/> */}
            </Text>
        </Float>

    </>
}