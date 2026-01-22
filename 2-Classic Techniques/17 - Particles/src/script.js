import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/particles/2.png')

/**
 * Particles
 */

//Geometry
//const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const count = 20000
const particlesGeometry = new THREE.BufferGeometry()

const positions = new Float32Array(count * 3) //Usam aaquest tipo d'array perque es molt mes rapid
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3 * Math.PI
    colors[i] = (Math.random())                         //Cada valor de RGB va de 0 a 1
}

particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)



//Material
const particlesMaterial = new THREE.PointsMaterial({
    //color: '#65bb65', //Influeix en es colors des vertex (han de tenir un poc dels altre colors sino nomes mostra un)
    size: 0.1,
    sizeAttenuation: true, //to create the illusion particles are near or far
    //map: particleTexture // se veuen ses parts negres des costats. per arreglar-ho empleam alphaMap
    alphaMap: particleTexture,
    transparent: true,
    //alphaTest: 0.001, //Ara sa GPU deixara de renderitzar els pixels que no superin un valor alpha, per lo que 
                      //ja s'eliminara aquest problema
    //depthTest: false, //Tambe funcionaria pero te bugs amb particules i geometries d'altres colors
    depthWrite: false, //Aixo funciona bastant be

    blending: THREE.AdditiveBlending, //Se sumen ses llums de ses particules pero afecta negaativament sa optimitzacio

    vertexColors: true //Mos permet fer servir es colors de cada vertex de sa geometria que hem triat
})
//We can change this material's properties later with particlesMaterial.size = 1


//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Test cube
 */
/* const cube = new THREE.Mesh(
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles

    /*AIXO ES BASTANT INEFICIENT, MILLOR NO FER-HO
    
    Per fer-ho de bona manera hauriem de crear un shader*/
    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        let y = particlesGeometry.attributes.position.array[i3+1]
        const z = particlesGeometry.attributes.position.array[i3+2]

        particlesGeometry.attributes.position.array[i3+1] = y + (Math.sin(elapsedTime + x) * 0.001) - (Math.sin(elapsedTime + z) * 0.001)
        
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()