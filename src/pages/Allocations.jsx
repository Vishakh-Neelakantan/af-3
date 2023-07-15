import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Allocations = () => {
  return (
    <div>
      <Navbar />

    <div className='w-full h-screen bg-neutral-900 flex md:flex-row flex-col justify-center items-center'>
      

      
      <Link to="/subjectallocation"><div className='h-48 w-48 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl flex justify-center items-center p-2'>
        <h1 className='text-3xl text-center font-anton'>Subject Allocation</h1>
      </div></Link>
      <br></br>
      <div className='md:w-8 w-0'></div>
      <br></br>
      <Link to="/studentallocation"><div className='h-48 w-48 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl flex justify-center items-center p-2'>
        <h1 className='text-3xl text-center font-anton'>Student Allocation</h1>
      </div></Link>
      

    </div>
    </div>
  )
}

export default Allocations