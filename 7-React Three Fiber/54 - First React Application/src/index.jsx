import './style.css'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.querySelector('#root'))

root.render(
    <>
        <App clickersCount={ 4 }>
            <h1>My First React App</h1>
            <h2>And a fancy subtitle</h2>
        </App>
        {/*<App children={
            <>
                <h1>My First React App</h1>
                <h2>And a fancy subtitle</h2>
            </>
        }/>*/}
    </>
)