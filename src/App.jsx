import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import LandingLayout from './components/LandingPageLayout'
import LandingPage from './LandingPage'
import Singup from './singup'
import Singin from './singin'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingLayout/>} >
            <Route index element={<LandingPage/>}/>
            
          </Route>
          <Route path='/singup' element={<Singup/>}/>
          <Route path='/singin' element={<Singin/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
