import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import './style.css'
import ReactDOM from 'react-dom/client'
import { CineonToneMapping, SRGBColorSpace} from 'three'


const root = ReactDOM.createRoot(document.querySelector('#root'))

// const cameraSettings = {
//     fov: 45,
//     zoom: 100,
//     near: 0.1,
//     far: 200,
//     position: [3, 2, 6],
// }

root.render(
    <Canvas
        dpr={[1, 2]} //Pixel ratio, this is clamped between 1 and 2. 
                    // Aqui esta lo que es per defecte, aixi que en vere ho podem eliminar
        // flat //Aixo es per llevar es tonemapping
        gl={{
            antialias: true,
            //toneMapping: CineonToneMapping,
            outputColorSpace: SRGBColorSpace //THREE.SRGBColorSpace si ho has importat normal
        }}
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6],

        }}
    >
        <Experience />            
    </Canvas>
)