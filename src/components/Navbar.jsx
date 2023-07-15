import React from 'react'
import logo from '../images/logo.png'
import homeicon from '../images/home.png'
import profile from '../images/profile.png'
import {Link} from 'react-router-dom'
import elex_logo from '../images/elex_logo.png'


const Navbar = () => {
  return (
    <div className='h-[80px] w-full bg-neutral-950 flex text-white'>
        <div className='w-1/3 grid grid-cols-1 justify-items-start content-center '>
            <div className='flex'>
                <img src={elex_logo} className='scale-[25%]'/>
            </div>
            
        </div>
        <div className='w-1/3 grid grid-cols-3 gap-4 place-items-center content-center'>
            <div>
            <Link to="/electives">Electives</Link>
            </div>
            <div>
            <Link to="/students">Students</Link>
            </div>
            <div>
            <Link to="/allocations">Allocations</Link>
            </div>
        </div>
        <div className='w-1/3 grid grid-cols-1 justify-items-end content-center pr-16 flex'>
            <div className='flex'>
            <Link to="/Home">
            <button
            className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
          >
            Home
          </button>
          </Link>
          <div className='md:w-4'></div>
          <Link to="/">
            <button
            className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
          >
            Sign-out
          </button>
          </Link>

            </div>
            
            
            
                
        </div>
    </div>
  )
}

export default Navbar