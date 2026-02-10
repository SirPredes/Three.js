import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter{
    start
    current
    elapsed
    delta

    constructor(){
        super()

        //Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 //Un valor exemple per evitar bugs raros

        window.requestAnimationFrame(() => { //Se fa aixi per evitar bugs raros tambe (Esperes un frame)
            this.tick()
        })
    }

    tick(){
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        
        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}