import './App.css'
import { Routes, Route } from 'react-router-dom'
import React from 'react';
import About from './pages/About';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';

function App() {
 
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/login' element={<Login />}/> 
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
       </Routes>
      <Footer/>
    </div>
  )
}

export default App
