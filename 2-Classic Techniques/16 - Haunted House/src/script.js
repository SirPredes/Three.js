import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import Stats from 'stats.js'
import { Sky } from 'three/addons/objects/Sky.js'

/**
 * HAUNTED MANSION:
 *      - Lo primer es col·locar ses coses per tenir una idea general de s'escena. 
 *          - Per aixo cream els objectes sense textures i els posicionam. 
 *          - Mos pot ajudar posar els diferents meshes dins grups per agruparlos
 *      - Després podem texturejar per començar a donar detalls
 *          - Per texturejar, descarregam sa textura, jpg per diffuse, AO/Rough/Metal, 
 *              displacement, i Normal (GL)
 *          - Usam texture loader per carregarles i li donam repeat perque no sigui 
 *              una sola textura enorme. 
 *          - NO OBLIDAR repeatWrapping per S i per T, sino sera raro (a nes cono 
 *              no es necessari sa T)
 *          - Per es cono
 *          - Tampoc oblidar mencionar a three.js que s'espai de color ha de ser encodejat
 *              en sRGB, no s'optimitzat
 *          - Les ficam a nes material
 *      - Cream els fantasmes, que seran punts de llum que podem animar al tick. Podem 
 *          donar renou perque no siguin cercles perfectes apilant sin i cos
 *      - Podem castejar sombres, pero nomes on se noti realment, perque es car en termes
 *          de optimització
 *          - També s'ha de decidir els objectes que castejen i reben sombres de igual manera
 *      - Tambe posam sky a partir d'un projecte ja existent que hem importat
 *      - Finalment afegim sa boira, que podem trobar en dos tipus: fog i fogExp2, sa segona 
 *          es mes realista i mes senzilla, no se si sa primera rendeix menos o que pero sa 
 *          segona va joya
 * 
 */

/**
 * Base
 */
// Debug
const gui = new GUI()

//Stats
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * TEXTURES
 */
const textureLoader = new THREE.TextureLoader()

//Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg') //If you don't put the point before the / you may have some issues
const floorColorTexture = textureLoader.load('./floor/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/leaves_forest_ground_1k/leaves_forest_ground_disp_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8,8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.repeat.set(8,8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.repeat.set(8,8)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.repeat.set(8,8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping


//Walls
const wallColorTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_nor_gl_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

wallColorTexture.repeat.set(2,2)
wallColorTexture.wrapS = THREE.RepeatWrapping
wallColorTexture.wrapT = THREE.RepeatWrapping

wallARMTexture.repeat.set(2,2)
wallARMTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping

wallNormalTexture.repeat.set(2,2)
wallNormalTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping

/* const wallColorTexture = textureLoader.load('./wall/climbing_wall_1k/climbing_wall_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/climbing_wall_1k/climbing_wall_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/climbing_wall_1k/climbing_wall_nor_gl_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

wallColorTexture.repeat.set(2,2)
wallColorTexture.wrapS = THREE.RepeatWrapping
wallColorTexture.wrapT = THREE.RepeatWrapping

wallARMTexture.repeat.set(2,2)
wallARMTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping

wallNormalTexture.repeat.set(2,2)
wallNormalTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping */

//Roof
const roofColorTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_diff_1k.jpg')
const roofARMTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof/grey_roof_tiles_02_1k/grey_roof_tiles_02_nor_gl_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(4,1)
roofColorTexture.wrapS = THREE.RepeatWrapping

roofARMTexture.repeat.set(4,1)
roofARMTexture.wrapS = THREE.RepeatWrapping

roofNormalTexture.repeat.set(4,1)
roofNormalTexture.wrapS = THREE.RepeatWrapping

//Bush
const bushColorTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_diff_1k.jpg')
const bushARMTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_arm_1k.jpg')
const bushNormalTexture = textureLoader.load('./bush/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2,1)
bushColorTexture.wrapS = THREE.RepeatWrapping

bushARMTexture.repeat.set(2,1)
bushARMTexture.wrapS = THREE.RepeatWrapping

bushNormalTexture.repeat.set(2,1)
bushNormalTexture.wrapS = THREE.RepeatWrapping

//Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveColorTexture.wrapS = THREE.RepeatWrapping
graveColorTexture.wrapT = THREE.RepeatWrapping

graveARMTexture.repeat.set(0.3, 0.4)
graveARMTexture.wrapS = THREE.RepeatWrapping
graveARMTexture.wrapT = THREE.RepeatWrapping

graveNormalTexture.repeat.set(0.3, 0.4)
graveNormalTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapT = THREE.RepeatWrapping

//Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;


/**
 * House
 */
/* // Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
scene.add(sphere) */

const houseMeasurements = {
    boxWidth: 4,
    boxHeight: 2.5,
    boxDepth: 4,
    roofRadius: 3.5,
    roofHeight: 1.5,
    roofRadialSegments: 4,
    doorHeight: 2.2,
    doorWidth: 2.2,
    bushRadius: 1,
    bushWidthSegments: 16,
    bushHeightSegments: 16,
    graveWidth: 0.6,
    graveHeight: 0.8,
    graveDepth: 0.2,
    graveNumber: 30
}

//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture, //Aquestes tres fan servir es mateix fitxer perque les junta ses tres en una
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.15,
        displacementBias: - 0.05
    })
)
floor.rotation.x = - Math.PI * 0.5

scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

//House container
//We'll be using a three.js group, which willl allow us to move, aanimaate, scale... them as a unit
const house = new THREE.Group()
scene.add(house)

/* IMPORTANT: NOW WE WILL HAVE TO ADD THE ELEMENTS NOT TO THE SCENE BUT TO THE GROUP */

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseMeasurements.boxWidth, 
        houseMeasurements.boxHeight, 
        houseMeasurements.boxDepth,
    ),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y += houseMeasurements.boxHeight / 2 //Important to write it like that so it highlights when you hover the others to notice possible bugs
house.add(walls)

//Roof
const roof = new THREE.Mesh(

    new THREE.ConeGeometry(
        houseMeasurements.roofRadius,
        houseMeasurements.roofHeight,
        houseMeasurements.roofRadialSegments
    ),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y += (houseMeasurements.boxHeight + houseMeasurements.roofHeight / 2)
roof.rotation.y = Math.PI / 4
house.add(roof)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(
        houseMeasurements.doorWidth,
        houseMeasurements.doorHeight,
        100,
        100
    ),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
)
door.position.y = 1
door.position.z = 2 + 0.001
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereGeometry(
    houseMeasurements.bushRadius,
    houseMeasurements.bushWidthSegments,
    houseMeasurements.bushHeightSegments
)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
    color: '#aaffaa' //We can turn it green if we want
})

const bush1 = new THREE.Mesh( bushGeometry, bushMaterial)
bush1.position.set(0.8, 0.2, 2.2)
bush1.scale.setScalar(0.5) //We could also use set if we wanted to insert different scales for the axis
bush1.rotation.x = -0.75 //We can hide the defectuous part of the texture uvs

const bush2 = new THREE.Mesh( bushGeometry, bushMaterial)
bush2.position.set(1.4, 0.1, 2.1)
bush2.scale.setScalar(0.25)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh( bushGeometry, bushMaterial)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.scale.setScalar(0.4)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh( bushGeometry, bushMaterial)
bush4.position.set(-1, 0.05, 2.6)
bush4.scale.setScalar(0.15)
bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

//Graves
const graveGeometry = new THREE.BoxGeometry(
    houseMeasurements.graveWidth,
    houseMeasurements.graveHeight,
    houseMeasurements.graveDepth
)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

const graves = new THREE.Group() //We create another group for the graves
scene.add(graves)

for (let i = 0; i < houseMeasurements.graveNumber; i++) {
    //Random positioning outside and around the house 
    const angle = (Math.random() * Math.PI) * 2
    const radius = 3 + Math.random() * 4
    
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    //Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.5 //Now the value can be between -0.5 and 0.5 (before * 0.4)
    grave.rotation.x = (Math.random() - 0.5) * 0.5
    grave.rotation.x = (Math.random() - 0.5) * 0.5

    //Add to graves group
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

//Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.35)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
house.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
 * Shadows
 */
//Renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

//Cast and receive
//For this we won't activate shadow casting if it does not have a noticeable impact, as 
//it is expensive in terms of performance
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true       //Es sostre no fa falta que rebi sombres perque de totes maneres res podria fer-ho
floor.receiveShadow = true

for(const grave of graves.children){
    grave.castShadow = true
    grave.receiveShadow = true
}

//Mapping (for optimizing)
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
//scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1125)


/**
 * Animate
 */
//A partir d'ara usarem aixo en vers des clock perque sol·luciona bugs de get elapsed time i limita es delta time, 
// lo que sol·luciona problemes d'animacions i fisiques quan canvies de pestanya
//De totes maneres, necessita un import manual i HA D'ESSER ACTUALITZAT MANUALMENT (timer.update())
const timer = new Timer()

const tick = () =>
{
    //Stats
    stats.begin()

    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    //Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = (Math.cos(ghost1Angle) + Math.cos(ghost1Angle * 1.43)) * 4
    ghost1.position.z = (Math.sin(ghost1Angle) + Math.sin(ghost1Angle * 1.43)) * 4 
    ghost1.position.y =  Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle)

    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = (Math.cos(ghost2Angle) + Math.cos(ghost2Angle * 1.43)) * 5
    ghost2.position.z = (Math.sin(ghost2Angle) + Math.sin(ghost2Angle * 1.43)) * 5
    ghost2.position.y =  Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = (Math.cos(ghost3Angle) + Math.cos(ghost3Angle * 1.43)) * 6
    ghost3.position.z = (Math.sin(ghost3Angle) + Math.sin(ghost3Angle * 1.43)) * 6 
    ghost3.position.y =  Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end()
}

tick()