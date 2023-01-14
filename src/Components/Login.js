import axios from 'axios';
import React, {useState, useContext} from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { ErrorMsgContext } from '../App';

function Login() {

    let navigate = useNavigate('')

    const [ userId, setUserId ] = useState();
    const [ userPwd, setUserPwd ] = useState(); 
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post('https://oshitimeserver.onrender.com/login', {userId, userPwd})
            setCookie("UserEmail", response.data.UserId)
            setCookie("AuthToken", response.data.token)

            const success = response.status === 201;

            if(success) navigate('/home');

            window.location.reload()
               
        } catch (error) {
            console.log('Error', error)
            setErrorMsg(error.request.responseText)
        }
    }

  return (
    <>
     <p className='error-msg'>{errorMsg}</p>
    <div className='login-container'>
        <div className="login-form">
            <div className="heading">
                <h1>Oshi Time</h1>
                <p>Login your account</p>
            </div>
            <form action="" onSubmit={handleSubmit}>
                <input type="email" name="email" id="email" placeholder='email' onChange={(e)=>setUserId(e.target.value)} />
                <input type="password" placeholder='password' name="password" onChange={(e)=>setUserPwd(e.target.value)} />
                <button type='submit'>Login</button>
                <p>Haven't registered yet ?</p>
            </form>
            <a href="/register">Create new account</a>
        </div>
    </div>
    </>
  )
}

export default Login