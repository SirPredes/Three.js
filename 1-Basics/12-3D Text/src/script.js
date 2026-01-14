import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';



/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Axis helper
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace                        //Mandatory in Three.js latest versions

/**
 * Fonts
 */

//Fisrt the font loader is created and the font is loaded
const fontLoader = new FontLoader();
const font = await fontLoader.loadAsync('/fonts/helvetiker_regular.typeface.json');

//Then the geometry of the text is created: we must imput the text we want to show and then their properties
const bevelSize = 8;
const bevelThickness = 10; //Si no es 10 no se que passa
const textGeometry = new TextGeometry('Hola!', {
    font: font,
    size: 100,
    depth: 50,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThikness: bevelThickness,
    bevelSize: bevelSize,
    bevelOffset: 0,
    bevelSegments: 2
});

//CENTERING THE TEXT (Hard way)

/* //By default we have a spherical compute bounding, so we want it to be a box
textGeometry.computeBoundingBox()
console.log(textGeometry.boundingBox)

//We can translate the geometry and divide it by half to compensate and be able to rotate it by its center
//but we must recompute it after
textGeometry.translate(
    - (textGeometry.boundingBox.max.x - bevelSize) * 0.5,      //We substract the bevelSize
    - (textGeometry.boundingBox.max.y - bevelSize) * 0.5,
    - (textGeometry.boundingBox.max.z - bevelThickness )* 0.5  //and the bevel thickness
)
textGeometry.computeBoundingBox()
console.log(textGeometry.boundingBox) */

//CENTERING THE TEXT (Simple way)

textGeometry.center() //ª

//Then the mesh material is created and all imputed to the mesh to create the text mesh 
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
});
//textMaterial.wireframe = true
const text = new THREE.Mesh(textGeometry, material);

//Remind to add it to the scene
scene.add(text);

console.time('donuts')

const donutGeometry = new THREE.TorusGeometry(20, 10, 20, 45);
//const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

for(let i = 0; i < 500; i++){
    /* const donutGeometry = new THREE.TorusGeometry(20, 10, 20, 45);                  This is optimizationally terrible
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture}); */
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 1000;
    donut.position.y = (Math.random() - 0.5) * 1000;
    donut.position.z = (Math.random() - 0.5) * 1000;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.x = Math.random() * Math.PI;

    const scale = Math.random() * 1.5;
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}

console.timeEnd('donuts')

/* /**
 * Object
 
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

scene.add(cube) */

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 10, 2000)
camera.position.x = 150
camera.position.y = 150
camera.position.z = 300
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()