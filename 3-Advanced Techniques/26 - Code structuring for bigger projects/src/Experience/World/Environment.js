import * as THREE from 'three'
import Experience from "../Experience";

export default class Environment{
    experience
    scene
    resources
    sunLight
    environmentMap

    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight(){
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
        // gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
        // gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
        // gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
    }

    setEnvironmentMap(){
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.setEnvironmentMap.updateMaterials
    }
}