import { useLoader } from '@react-three/fiber' 
import { GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons.js'
import { useGLTF, Clone } from '@react-three/drei'

export default function Model(){

    // const model = useLoader(
    //         GLTFLoader, 
    //         //'./FlightHelmet/glTF/FlightHelmet.gltf',
    //         './hamburguer.glb',
    //         (loader) => {
    //             const dracoLoader = new DRACOLoader()
    //             dracoLoader.setDecoderPath('./draco/')
    //             loader.setDRACOLoader(dracoLoader)
    //         }
    //     )

    const model = useGLTF('./hamburger-draco.glb') //Aquest draco no usa sa carpeta de public, se podriaa llevar (necessita internet perque ho descarrega)


    //Usant clone s'usa sa mateixa geometria per totes i es millor pe saa performance
    return <>
        <Clone object={model.scene} scale={0.35} position-y={-1} position-x={-4}/>
        <Clone object={model.scene} scale={0.35} position-y={-1} position-x={0}/>
        <Clone object={model.scene} scale={0.35} position-y={-1} position-x={4}/>
    </>
}

useGLTF.preload('./hamburger-draco.glb') //Important que sigui es mateix fitxer 