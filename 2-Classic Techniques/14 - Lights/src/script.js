import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

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
 * Lights
 */

//AIXO PODRIA SER INTERESANT PER UNA MECANICA DD'UN JOC!!!! ---------------------------------------------------------------------------->

//Aquest tipus de llum fa que tota sa superficie estigui iluminada, per lo que si els objectes
//Son des mateix color no se poden diferenciar uns devora els altres ni sa seva forma
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
ambientLight.color = new THREE.Color(0xffdaac)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('ambient')

//Afegint aquesta llum podem aconseguir un efecte de llum des sol amb molt millor rendiment que
//Calculant els hazes de llum. Si esta sola ilumina com si fos es sol d'una direccio generant sombres
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('directional')
gui.add(directionalLight.position, 'x').min(-3).max(3).step(0.01).name('directional-x')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('directional-y')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('directional-z')

//Hemisphere light es lo mateix que ambient light pero fa servir un color diferent per sa llum
//que ve d'adalt i sa que ve d'abaix
//Se veu que flipes i barat en termes de rendiment
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
scene.add(hemisphereLight)
gui.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001).name('hemisphere')

//Point light es llum que ve d'un punt, it's not that deep bro
const pointLight = new THREE.PointLight(0xff9000, 1.5) //Se li pot afegir un tercer nombre per indicar fins a quina distancia arriba
scene.add(pointLight)
gui.add(pointLight, 'intensity').min(0).max(5).step(0.001).name('point')
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.01).name('point-x')
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.01).name('point-y')
gui.add(pointLight.position, 'z').min(-5).max(5).step(0.01).name('point-z')

//RectAreaLight crea un plano que emiteix llum que pot iluminar objectes
//ATENCIÓ: Aquesta llum nomes funciona amb MeshStandardMaterial i MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 2, 3)

gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('rectArea')
gui.add(rectAreaLight, 'width').min(0).max(5).step(0.001).name('rectArea-width')
gui.add(rectAreaLight, 'height').min(0).max(5).step(0.001).name('rectArea-height')
gui.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.01).name('rectArea-x')
gui.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.01).name('rectArea-y')
gui.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.01).name('rectArea-z')
//Podem emplear lookAt method per que miri a algun lloc
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

//Spot light serveix com una llinterna
//Es 4t parameter es lo ample que es s'angle que ilumina. 180º es es maxim iluminant tot s'angle davant sa llinterna.
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
gui.add(spotLight, 'intensity').min(0).max(5).step(0.01).name('spotLight')

gui.add(spotLight.position, 'x').min(-5).max(5).step(0.01).name('spotLight-x')
gui.add(spotLight.position, 'y').min(-5).max(5).step(0.01).name('spotLight-y')
gui.add(spotLight.position, 'z').min(-5).max(5).step(0.01).name('spotLight-z')

//Si volem que apunti a un target PRIMER HAUREM D'AFEGIR-LO A S'ESCENA. Aixo es perque es target no es un vector3 sino 
//un Object3D
spotLight.target.position.x = -0.75
scene.add(spotLight.target)

//HELPERS: Se poden afegir per ajudar a visualitzarles
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight) //Per aquest hem d'importar sa classe, no forma part de THREE

scene.add(hemisphereLightHelper, directionalLightHelper, spotLightHelper, pointLightHelper, rectAreaLightHelper)
gui.add(hemisphereLightHelper, 'visible')
gui.add(directionalLightHelper, 'visible')
gui.add(spotLightHelper, 'visible')
gui.add(pointLightHelper, 'visible')
gui.add(rectAreaLightHelper, 'visible')


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()