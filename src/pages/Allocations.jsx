import React from 'react'
import { Link } from 'react-router-dom'

const Allocations = () => {
  return (
    <div>
        <div>Allocations</div>
        <Link to="/subjectallocation">Subject Allocation</Link>
        <Link to="/studentallocation">Student Allocation</Link>

    </div>
  )
}

export default Allocations