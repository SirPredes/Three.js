
//Animations with clock
//clock

//const clock = new THREE.Clock()

const tick = () => {

    //Clock
    //const elapsedTime = clock.getElapsedTime()
    //console.log(elapsedTime)

    //Update objects
    //camera.position.x = Math.sin(elapsedTime);
    //camera.position.y = Math.cos(elapsedTime);

    //camera.lookAt(mesh.position)
    

    //mesh.rotation.y = elapsedTime * Math.PI * 2

    //Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}