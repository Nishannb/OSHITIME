import React, { useContext } from 'react'
import Menu from './Menu'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { ErrorMsgContext } from '../App'

function Navbar() {

    let navigate = useNavigate('')

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

    const handleLogout = ()=>{
        removeCookie('AuthToken')
        removeCookie('UserEmail')
        navigate('/')
        window.location.reload()
    }

  return (
    <>
        <p className='error-msg'>{errorMsg}</p>
        <div className='navbar-container'>
            <div className="navbar-brand">
                <h1>Oshi Time</h1>
            </div>
            <div className="navbar-menu">
                {/* <div className="profile">
                    <h4>MCD</h4>
                </div> */}
                <div className="logout">
                    <button onClick={handleLogout}>Sign Out</button>
                    

                </div>
            </div>
            
        </div>
    <Menu />
    </>
  )
}

export default Navbar