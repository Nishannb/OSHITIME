import React from 'react'

function Menu() {
  return (
    <div className='menu-container'>
        <div className="menu">
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/team">Team</a></li>
                <li><a href="/insights">Insights</a></li>
            </ul>
        </div>
    </div>
  )
}

export default Menu