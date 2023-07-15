import React from 'react'
import {Link} from 'react-router-dom'
import '../index.css'
import Navbar from '../components/Navbar'
import elex_logo from '../images/elex_logo.png'

const Home = () => {
  return (
    <div>
      <Navbar/>
        <div className='w-full h-screen bg-neutral-900 flex flex-col justify-center items-center pb-12'>
          <div className='w-5/6 h-2/3 flex'>
            <div className='w-3/4 h-full bg-red-50 rounded-xl m-2 flex flex-col justify-center items-center'>
              <h1 className='text-7xl w-full text-center font-anton'><strong>Elective Management System</strong></h1>
              <div>
              <img className='scale-50' src={elex_logo}/>
            </div>
            </div>
            
            <div className='w-1/4 h-full bg-front-page rounded-xl m-2'>

            </div>
          </div>
          <br></br>
          <div className='w-5/6 h-1/3 flex text-white'>
            <div className='w-1/3 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500  rounded-xl m-2 flex justify-center items-center'>
            <Link to="/electives"><h1 className='text-5xl font-anton'>Electives</h1></Link>
            </div>
            <div className='w-1/3 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl m-2 flex justify-center items-center'>
            <Link to="/students"><h1 className='text-5xl font-anton'>Students</h1></Link>
            </div>
            <div className='w-1/3 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl m-2 flex justify-center items-center'>
            <Link to="/allocations"><h1 className='text-5xl font-anton'>Allocations</h1></Link>
            </div>

          </div>
          

        </div>
        
        
    </div>
  )
}

export default Home