
import { useState, useEffect, useRef } from "react"

export default function Clicker({ keyName, color = 'darkOrchid', increment }){ //Aixi feim destructuring. Tambe posam valors per defecte

    const [count, setCount] = useState(parseInt(localStorage.getItem(keyName) ?? 0))

    const buttonRef = useRef()
    console.log(buttonRef);
    

    // useEffect(() => { // Dona a un bug en es que quan s'iniciava canviava count 
    //                  //i aixo trigger s'altre useEffect, per lo que se tornava a renderitzar
    //     const savedCount = parseInt(localStorage.getItem('count') ?? 0)
    //     setCount(savedCount)
    // }, [])

    useEffect(() => {

        console.log('first render'); //Aixo s'executa quan es component es renderitzat

        buttonRef.current.style.backgroundColor = 'papayawhip' //Important es current
        buttonRef.current.style.color = 'salmon'
        
        return () => {
            localStorage.removeItem(keyName) // Aixo s'executa quan es component es destruit
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(keyName, count)
    }, [count]) //Si no se posa res nomes s'activa a nes primer render

    const buttonClick = () => {
        setCount(count + 1)
        increment()
    }

    return <div>
        <div style={{ color }}>Clicks count: {count}</div>
        <button ref={buttonRef} onClick={buttonClick}>Click me</button>
    </div>
}