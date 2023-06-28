import React from 'react'
import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div>
        Home
        <br></br>
        <br></br>
        <Link to="/electives">Electives</Link>
        <br></br>
        <Link to="/subjects">Subjects</Link>
        <br></br>
        <Link to="/electiveselection">Elective selection</Link>
    </div>
  )
}

export default Home