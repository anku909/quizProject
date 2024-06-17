import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from '../components/Hero'

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero/>}/>
      </Routes>
    </div>
  )
}

export default AppRoutes
