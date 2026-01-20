import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Stats from 'stats.js'


/**
 * TO BE ABLE TO CAST SHADOWS WE NEED:
 *      - Tell the renderer to cast shadows (renderer.shadowMap.enabled = true)
 *      - Tell the geometries we want to cast shadows to do that (sphere.castShadow = true)
 *      - Tell the geometries we want to receive shadows to do that (plane.receiveShadows = true)
 *      - Tell the lights we want to cast shadows to do that (directionalLight.castShadow = true)
 *      - Only some of the light types support shadows:
 *          - PointLight
 *          - DirectionalLight
 *          - SpotLight
 *      - We can upgrade the definition of the shadows by changing the width and height of the mapSize (multiples of 2)
 *          but this will affect performance greatly if not handled properly 
 *      - To avoid glitches in the shadow we must adjust the near and the far and the amplitude of the shadow casting as we are doing render
 *          to do that we can do it in the camera of the light as we would do it with a normal camera,
 *      - We can also use baked shadows that will mostly look better with better performance but take more space and are static, 
 *          they will not move if the object moves
 *      - If we want to solve this last thing we can move a baked shadow texture below the object wherever it moves so it gives 
 *          the impression that we are casting the shadow and it is not baked although it is
 *      - For this we want to create a plane just above the floor plane (to avoid z-fighting) that will follow the sphere
 */

/**
 * Base
 */
// Debug
const gui = new GUI()


/**
 * For stats relating performance: fps...
 * */
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Baked textures
 */
const textureLoader = new THREE.TextureLoader()

const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace

const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
simpleShadow.colorSpace = THREE.SRGBColorSpace

console.log(simpleShadow)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('ambient')
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('directional')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

//We tell the light to cast shadows
directionalLight.castShadow = true

//We can see the shadow map of the light with a log
//Here we can see things like the mapSize
console.log(directionalLight.shadow)

//We enlarge the mapSize to upgrade the definition of the shadows (multiples of 2)
directionalLight.shadow.mapSize.width = 1024 * 0.06125 //Too large, in the example we set it up to 1024
directionalLight.shadow.mapSize.height = 1024 * 0.06125

//We avoid glitches in shadows by adjusting near and far in the shadow camera
//In this case, the directional light uses an orthographic camera (like a box, rays in parallel)
//we adjust the near and far
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far = 5
//Then we can reduce the amplitude
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.camera.left = -1
//Radius parameter is for the blur of the shadow, uniform along all the shadow
//directionalLight.shadow.radius = 40  //This doesnt work on some algorithms like PCFSoftShadow

//We can call then a helper for the shadow camera
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

scene.add(directionalLightCameraHelper)


//Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI * 0.3)

spotLight.castShadow = true
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.camera.near = 2
spotLight.shadow.camera.far = 5

spotLight.position.set(0, 2, 2)

scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

//Point Light
const pointLight = new THREE.PointLight(0xffffff, 3.5)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)

pointLight.shadow.mapSize.height = 1024
pointLight.shadow.mapSize.width = 1024
//Lo que si que podem fer es canviar es near i far perque sa performance sigui millor i evitar glitches
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 4

scene.add(pointLight)

//Aqui es pointLight fa un render per cada una de ses 6 cares de un cub per cobrir tota sa superficie i 
//d'aquesta manera poder castejar ses sombres en totes direccions, per lo que en termes de performance: mal
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

//We need to specify to the sphere that we want it to cast shadows
sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)

/* const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({ //We can use baked shadows tthat may look better with better performance 
                                  //but the textures take up space and this way they are static (bad if object moves)
        map: bakedShadow
    })
) */


plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

//We also need to specify the plane to receive shadows
plane.receiveShadow = true

scene.add(sphere, plane)

//Here we can create a shadow plane that will follow the sphere and will work as a shadow
//The rest, the movement is handled in the tick
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true, //This is to show the alphamap below and not the color
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.001 //To fix z-fighting
scene.add(sphereShadow)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//We need the renderer to handle shadows
renderer.shadowMap.enabled = false;

//There are different algorithms that can be applied to shadow maps
//renderer.shadowMap.type = THREE.BasicShadowMap //Te vibes a lowstat game pot molar
//renderer.shadowMap.type = THREE.PCFSoftShadowMap //Millor pero menos performant que es default
//renderer.shadowMap.type = THREE.PCFShadowMap //Aquest es es default
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin()

    const elapsedTime = clock.getElapsedTime()

    //Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    //Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = 1 - sphere.position.y

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end()
}

tick()