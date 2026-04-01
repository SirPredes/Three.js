
import { useState, useMemo } from "react"
import Clicker from "./Clicker.jsx"
import People from "./People.jsx"

export default function App({children, clickersCount}){
    

    const [hasClicker, setHasClicker] = useState(true)
    const [count, setCount] = useState(0)

    const toggleClickerClick = () => {
        setHasClicker(!hasClicker)
    }

    const increment = () => {
        setCount(count + 1)
    }

    const colors = useMemo(() => { //Works like a cache
        console.log('usememo is caalling my function')
        const colors = []

        for (let i = 0; i < clickersCount; i++) {
            colors.push(`hsl(${Math.random() * 360}deg, 100%, 70%)`)
        }

        return colors
    }, [clickersCount])

    return <>
        {children}

        <div>Total count: {count}</div>

        <button onClick={toggleClickerClick}>{hasClicker? 'Hide' : 'Show'} clicker</button>
        {/*{hasClicker? <Clicker keyName="countD"/> : null}*/}
        {hasClicker && <> 
            { [...Array(clickersCount)].map((value, index) => 
                <Clicker 
                    key={index}
                    keyName={`count${index}`} 
                    color={ colors[index] } 
                    increment={increment}
                />
            ) }
            {/*<Clicker keyName="countA" color={ `hsl(${Math.random() * 360}deg, 100%, 70%)` } increment={increment}/>
            <Clicker keyName="countB" color={ `hsl(${Math.random() * 360}deg, 100%, 70%)` } increment={increment}/>
            <Clicker keyName="countC" color={ `hsl(${Math.random() * 360}deg, 100%, 70%)` } increment={increment}/> */}
        </>}
        <People /> 
    </>
    //Si se fa aixo de &&, comprova saa de l'esquerra i sa de la dreta la comprova i la retorna, per aixo funciona
}