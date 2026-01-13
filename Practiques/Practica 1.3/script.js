import * as THREE from 'three';

console.log('JavaScript esta funcionant');
console.log(`no s'ha de recarregar sa pagina`);
//console.log(THREE);

//CANVAS
const canvas = document.querySelector('canvas.webgl');

//SCENE
const scene = new THREE.Scene();

//Object
const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(boxGeometry, material);

scene.add(mesh);


//Sizes
const sizes = {
    width: 800,
    height: 600
}

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);