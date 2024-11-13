import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GetComics from './components/getComics'
//import InputRef from './components/inputRef.jsx';

function App() {
  const [mostrarFavoritos, setmostrarFavoritos] = useState(false);

  return (
    <div className='container_global'>
      <nav id="main-nav">
        <a href="#Inicio" onClick={() => setmostrarFavoritos(false)}>comics</a>
        <a href="#favoritos" onClick={() => setmostrarFavoritos(true)}>favoritos</a>	
      </nav>

      <div>
        <GetComics mostrarFavoritos={mostrarFavoritos}></GetComics>
      </div>

      <div>

      </div>
    </div>
  )
}

export default App
