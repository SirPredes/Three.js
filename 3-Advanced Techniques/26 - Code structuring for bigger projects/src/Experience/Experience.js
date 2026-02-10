import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import * as THREE from 'three'
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Resources from "./Utils/Resources"
import sources from "./Sources.js"

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
        this.renderer.update()
    }
}