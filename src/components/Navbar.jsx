import React from 'react'
import logo from '../images/logo.png'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='h-[80px] w-full bg-neutral-950 flex text-white'>
        <div className='w-1/3 grid grid-cols-1 justify-items-start content-center pl-8'>
            <div className='flex'>
                <img src={logo} className='scale-50'/>
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
        <div className='w-1/3 grid grid-cols-1 justify-items-end content-center pr-16'>
            Signout
        </div>
    </div>
  )
}

export default Navbar