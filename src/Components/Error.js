import React from 'react'
import { Link } from 'react-router-dom'

function Error() {

  return (
    <div className='error'>
        <h4>This route path is currently not available. Go to the home page section if required </h4>
        <Link to="/">Click here to go to Oshi Time home page..</Link>
    </div>
  )
}

export default Error