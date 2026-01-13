import * as THREE from 'three'
import { normalize } from 'three/src/math/MathUtils.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/*
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh) */

//Position
/*
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
*/
//mesh.position.set(0.7, -0.1, 0)
//console.log(mesh.position.normalize())

/**
 * Scale
 */
/*
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
*/
//mesh.scale.set(2, 1, 1);

/**
 * Rotation
 */
/*mesh.rotation.reorder('YXZ')
mesh.rotation.y = Math.PI * 0.25; //0.25 of a rotation in x axis
mesh.rotation.x = Math.PI * 0.25 */

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
);
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'green'})
);
group.add(cube2);
cube2.position.x = -2;

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'blue'})
);
group.add(cube3);
cube3.position.x = 2;

//Move the whole group
group.position.y = 2;
group.scale.y = 2;
group.rotation.y = Math.PI * 0.65;

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//camera.position.z = 3
scene.add(camera)

camera.position.set(0, 1, 3)
//camera.lookAt(mesh.position)
//Axis helper

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper)

//console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)