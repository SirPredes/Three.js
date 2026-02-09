import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { toneMapping } from 'three/tsl'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

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
 * Update all materials
 */
//Aqui simplement activam ses ombres per tots els objectes, pero, per exemple, si tenim un pla enterra no voldrem que 
// castei ses obres o si tenim objectes que no ho haguessin de fer, podriem anar una per una o lo que sigui
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            // A nes exemple tambe fa coses amb es envMapIntensity aamb es global, pero ara se fa automaticament
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Textures
 */
const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnessMetalnessTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace //IMPORTANT perque, encara que ses textures de ses normals i roughnes, ao... 
                                                    // son linears en termes de color, ses textures de color no, per aixo ses 
                                                    // textures des color s'han de passar a s'espai de color SRGB

const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'/* , 
    (data) => {
        console.log('success')
        console.log(data)
    } */
)
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'/* , 
    (data) => {
        console.log('success')
        console.log(data)
    }, 
    (data) => {
        console.log('success')
        console.log(data)
    }, 
    (data) => {
        console.log('error')
        console.log(data)
    } */
)
const wallAORoughnessMetalnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'/* , 
    (data) => {
        console.log('success')
        console.log(data)
    } */
)
wallColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Directional Light
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 10).max(10).step(0.001).name('lightZ')

//Shadows 
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(512, 512) //Millor que siguin potencies de 2 (512 es es default)
gui.add(directionalLight, 'castShadow')

//Aquests serviran per arreglar es problema des "Shadow acne" (Quan se projecten sobres sobre si mateix d'una formaa rara)
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)
//Despres mos podem quedar amb es valors que vegem que son correctes
directionalLight.shadow.normaalBias = 0.03
directionalLight.shadow.bias = -0.005

/* //Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
 */
//Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix() // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MOLT IMPORTANT

/**
 * Models
 */
/* // Helmet
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>

    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
) */

// Hamburguer
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
    '/models/Anvorgesa.glb',
    (gltf) =>

    {
        gltf.scene.scale.set(0.4, 0.4, 0.4)
        gltf.scene.position.set(0, 2.5, 0)
        scene.add(gltf.scene)

        updateAllMaterials()
    },
)

//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

//Wall
const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
    })
)
wall.position.set(0, 4, -4)
scene.add(wall)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, //This will be MSAA, which is more performant than other AA techniques, it works
                    //  by mixing the colors of the border pixels of a geometry with the outisde pixels
                    //  surrounding it. SE VEU MOLTISSIM MILLOR ES UNA LOCURA

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Tone Mapping
//renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    AACESFilmic: THREE.ACESFilmicToneMapping
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

//Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()