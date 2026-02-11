import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import * as THREE from 'three'
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Resources from "./Utils/Resources"
import sources from "./Sources.js"
import Debug from "./Utils/Debug.js"

let instance = null

export default class Experience{
    canvas
    sizes
    time
    scene
    camera
    renderer
    world
    resources
    sources
    debug

    constructor(canvas){
        if(instance){   //Aixo fa que sigui un Singleton (Clase que no pot esser instanciada, nomes pot tenir una instancia)
            return instance
        }

        instance = this
        //To give global access to this class (opcional pero a vegades util)
        window.experience = this

        //Options
        this.canvas = canvas

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.sizes.on('resize', () => {
            this.resize() //If not from here, inside the aarrow function, we lose the context
        })
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update() //Primer sa camara perque sino va un fotograma per darrere
        this.world.update()
        this.renderer.update()
    }

    destroy(){ //Per projectes mes complexes igual s'ha de fer un metode destroy per cada classe (Most times)
        this.sizes.off('resize')
        this.time.off('tick')

        //Traverse the scene
        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const key in child.material){
                    const value = child.material[key]
                    if(value && typeof value.dispose === 'function'){
                        value.dispose()
                    }
                }
            }
        })

        if(this.debug.active){
            this.debug.ui.destroy()
        }

        removeEventListener('resize', Sizes) //No se si se fa aixi...

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        //Aqui tambe eliminariem EffectComposer i WebGLRenderTarget
    }
}