import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';


export default class World{
    experience
    scene
    resources
    environment
    floor
    fox

    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            //Setup
            this.floor = new Floor() //Aquest primer perque s'apliqui s'environment update
            this.fox = new Fox()
            this.environment = new Environment()   //Aqui se crearien tot lo de s'environment
            
        })
    }

    update(){
        if(this.fox){
            this.fox.update()
        }
    }
}