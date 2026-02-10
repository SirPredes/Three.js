import EventEmitter from "./EventEmitter"

export default class Sizes extends EventEmitter{
    width //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!He de mirar si es bona practica o no
    height
    pixelRatio

    constructor(){

        super()

        //Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })

    }
}