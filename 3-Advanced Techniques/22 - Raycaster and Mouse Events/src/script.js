import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2
object1.name = 'object 1'

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.name = 'object 1'

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
object3.name = 'object 3'

scene.add(object1, object2, object3)

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

const objectsToTest = [object1, object2, object3]

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/* const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(1, 0, 0)
//rayDirection.normalize() // The ray direction must be a normal, therefore, if we needed it, we 
                           // could normalize any vector with .normalize() 
raycaster.set(rayOrigin, rayDirection)
raycaster.far = 8

const intersect = raycaster.intersectObject(object2)
console.log(intersect)

const intersects = raycaster.intersectObjects([object1, object2, object3])
console.log(intersects) */

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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1

    mouse.y = - (event.clientY / sizes.height) * 2 + 1 //ATENCIÓ: HEM D'INVERTIR S'EIX Y
})

window.addEventListener('click', (event) => {
    if(currentIntersect){
        console.log('click on ' + currentIntersect.object.name) // Molt millor que usar un switch com ell
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

let model = null

gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb', 
    (gltf) => 
        {
            model = gltf.scene
            console.log('loaded')
            model.position.y = -1.2
            scene.add(model)
        },
    () => 
        {

        },
    () => 
        {
            console.log('error')
        }
)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */

const clock = new THREE.Clock()

let currentIntersect = null //Better located at the raycaster part for organization

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Animated spheres
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.cos(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast a ray

    /* const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection)

    const intersects = raycaster.intersectObjects(objectsToTest)
    //console.log(intersects.length)

    for(const object of objectsToTest){
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects){
        //console.log(intersect)
        intersect.object.material.color.set('#0000ff')
    } */

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(objectsToTest)
    //console.log(intersects)

    for(const object of objectsToTest){
        object.material.color.set('#ff0000')
    }
    for(const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length){
        if( !currentIntersect ){
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else{
        if(currentIntersect){
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    //Intersects with model
    if(model){
        const modelIntersects = raycaster.intersectObject(model) //
        //console.log(modelIntersects)
        if(modelIntersects.length){
            model.scale.set(1.2, 1.2, 1.2)
        }else{
            model.scale.set(1, 1, 1)
        }
    }
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()