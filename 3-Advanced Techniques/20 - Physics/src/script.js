import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new GUI()
const debugObject = {} // Com que createSphere no esta a un objecte, en cream un per poder 
                       // canviar o rebre els atributs per crear instancies
debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3,
        }
    )
}
debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() * 0.5) * 3,
            y: 3,
            z: (Math.random() * 0.5) * 3,
        }
    )
}
debugObject.reset = () => {
    for (const object of objectsToUpdate){
        //Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        //Remove mesh
        scene.remove(object.mesh)
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    //console.log(impactStrength)
    if(impactStrength > 1.5){
        hitSound.volume = Math.random()
        hitSound.currentTime = 0 //Per a que no soni repetitivament cada vegada que acabi de reproduirse i siui mes real
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */

//World
const world = new CANNON.World()

//                              OPTIMITZACIO TIPS (informarse sobre es workers (multi-thread))
// Per defecte, CANNON comprova a cada frame si un mesh esta prenent contacte amb un altre, i aixo
// per cada mesh de tot es mon. De totes maneres, li podem indicar que usi un aaltre approach
// que millora molt s'optimitzacio aixi com ho fa aabaix. Pot tenir algun bug si hi ha un mesh que
// va a altes velocitats, ja que podria atravessar objectes.
world.broadphase = new CANNON.SAPBroadphase(world)
//Tambe podem permetre que els objectes que no es moguin o ho facin a una velocitat molt baixa puguin
// quedar-se "dormint", i nomes es despertin en rebre una força externa que els mogui un altre pic. Tambe
// podem modificar sleepSpeedLimit per posar a domrmir a objectes que se mouen molt lent
// AIXO AUGMENTA ES RENDIMENT DRÀSTICAMENT--------------------------------------------------------------------!>
world.allowSleep = true
//world.sleepSpeedLimit = 3

//ATENCIÓ!!!!!!!!!!!!!!!!!!!!!! Aquest es Vec3 i no Vector3, es primer per cannon i es segon Three.js
world.gravity.set(0, -9.82, 0)

//Materials
/* const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic') */
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

/* //Sphere
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    //material: defaultMaterial,
})
sphereBody.applyLocalForce(new CANNON.Vec3(300, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(sphereBody) */

//Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
//Es possible canviar aquests atributs despres d'instanciar
floorBody.mass = 0
//floorBody.material = defaultMaterial
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), 
    Math.PI * 0.5
)
world.addBody(floorBody)
/**
 * Test sphere
 */
/* 
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere) */

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial )
    mesh.scale.set(radius, radius, radius) //Better Performance as we don't create new geometries 
                                            // and materials for every sphere as we've moved the 
                                            // creation outside. We then use them inside the function
                                            // and scale them. Same for the physics world
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape, //Es lo mateix que shape: shape perque ses dues son lo mateix
        material: defaultMaterial
    })
    body.position.copy(position)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    //Save in objects to update
    objectsToUpdate.push({
        mesh: mesh, // O simplement mesh, body
        body: body,
    })
}

createSphere(0.5, {x: 0, y: 3, z: 0}) // Se pot fer aixi perque donen soport ses dues llibreries

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //Body
                                            //AATENCIÓ: per alguna rao, sa shape agafa la meitat de sa mida
                                            // I l'aplica desde el centre, per lo que els hem de dividir entre 2
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body,
    })
}



/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update the Physics world

    //sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // We need to provide a fixed time step, how much time passed since the last step (delta Time) and 
    // how much iterations the world can apply to catch up with a potential delay
    world.step( 1 / 60, deltaTime, 3)

    //Update the objects
    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
        //Per sa rotacio s'han demplear quaternions perque es lo que accepta CANNON
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    //Encara que una llibreria usi Vec3 i s'altra Vector3, ho han fet funcionar perque copy() els paarsi
    //sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()