import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

// import { EffectComposer as ec, RenderPass as rp} from 'postprocessing'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// import { GodraysPass } from 'three-good-godrays'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 10)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.autoUpdate = true;
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 150
directionalLight.shadow.camera.updateProjectionMatrix();
directionalLight.position.set(0, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Update the effectComposer
    effectComposer.setSize(sizes.width, sizes.height)                  //Aixo preven que se comenci a veure super malament quan feim resize 
    // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))//de petit a gros. I quan al reves podem fer es renderTarget + petit (good performance)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ //Si posam WebGL1Renderer podrem probar com funcionaria amb sa versio 1
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post-processing
 */
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples: renderer.getPixelRatio() === 1 ? 2 : 0, 
                    //Aixo es per activar s'antialiasing, quan + alt es numero es - optim pero se veu millor
                    //Per aixo hem de trobar es menor nombre que mos doni un bon resultat
                    //Si es PR es + de 1 no necessitarem AA (no se nota i es dolent per sa optimitzacio)
                    //Pero no funcionara a tots els navegadors
                    //Encara aixi el deixam perque sino el soporta simplement el deixara a 0 com abans
    }
)

//Effect composer
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

//Render pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

//DotScreenPass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

//GlitchPass
const glitchPass = new GlitchPass()
glitchPass.goWild = false //sen' va wild
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

//RGB shift pass
const RGBShiftPass = new ShaderPass(RGBShiftShader)
RGBShiftPass.enabled = false
effectComposer.addPass(RGBShiftPass)

// const params = {
//     density: 1 / 64,
//     maxDensity: 1,
//     edgeStrength: 3,
//     edgeRadius: 2,
//     distanceAttenuation: 2,
//     color: new THREE.Color(0xffffff),
//     raymarchSteps: 60,
//     blur: true,
//     gammaCorrection: true,
// }


// const godraysPass = new GodraysPass(directionalLight, camera, params) //Per emplear aixo he hagut de emplear npm install postprocessing
//                                                                     //No accepta .setPixelRatio pero l'arregla ell 
// godraysPass.renderToScreen = true;
// effectComposer.addPass(godraysPass);

//UnrealBloomPass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6

gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

effectComposer.addPass(unrealBloomPass)

//Tint pass
const TintShader = {
    uniforms: {
        tDiffuse: {value: null},
        uTint: {value: null}
    },
    vertexShader: `
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;

        void main(){
            vec4 color = texture2D(tDiffuse, vUv);
            // color.r += 0.1;
            // color.b += 0.1;
            color.rgb += uTint;
            gl_FragColor = vec4(color);
        }
    `,
}
const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)
tintPass.enabled = true

gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('red')
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('green')
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('blue')



//Tint pass
const DisplacementShader = {
    uniforms: {
        tDiffuse: {value: null},
        uNormalMap: {value: null}
    },
    vertexShader: `
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main(){
            vec3 normalColor = texture2D(uNormalMap, vUv).rgb * 2.0 -1.0;
            
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = vec4(color);
        }
    `,
}
const DisplacementPass = new ShaderPass(DisplacementShader)
DisplacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
effectComposer.addPass(DisplacementPass)
DisplacementPass.enabled = false

//Aquest ha de ser es darrer: corregeix que effectComposer fa malbe es colors (se veu + oscur) 
//¿si ho vui oscur anira be (pareix que per sol.lucionar-ho emplea performance)?
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

//SMAA Pass
//Ha de ser es darrer a no ser que hi hagi antialiasing jajajaja
//Sino fara s'efecte que sera sobreescrit per es proxim i no funcionara com s'espera
//Es dolent per sa performance, per aixo segona opcio
//Comprobam si es navegador soporta webGL2 i si te un pixel ratio menor a 1 i sino aplicam s'antialiasing com a Pass
if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update passes

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera) //IMPORTANT: comentar aixo perque emplearem es de effectComposer!!!!!!
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()