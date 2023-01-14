import React, { useState, useContext }  from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ErrorMsgContext } from '../App';
import { useCookies } from 'react-cookie'


function Register() {

    let navigate = useNavigate('')

    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

    const[formData, setFormData] = useState({
        username: '',
        email:"",
        nearestLocation: "",
        phoneNum: "",
        password: "",
        RePassword: "",
        employees:""
    })

    const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
            const response = await axios.post('https://oshitimeserver.onrender.com/register', {formData});

            setCookie("UserEmail", response.data.UserId)
            setCookie("AuthToken", response.data.token)

            const success = response.status === 201;
            if(success) navigate('/home');

            window.location.reload();
        } catch(e){
            setErrorMsg(e.request.responseText)
        }
    }

    const handleChange =(e)=>{
        const name = e.target.name
        const value = e.target.value

        setFormData((prevState)=>({
            ...prevState,
            [name]: value,
        }))
    }

  return (
    <>
    <p className='error-msg'>{errorMsg}</p>
    <div className='login-container'>
        <div className="login-form">
            <div className="heading">
                <h1>Oshi Time</h1>
                <p>Register your account</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' value={formData.username} name='username' id='username' onChange={handleChange} required />
                <input type="email" name="email" id="email" value={formData.email} placeholder='Email' onChange={handleChange} required />
                <input type="text" name="nearestLocation" value={formData.nearestLocation} id="nearest" placeholder='Nearest station' onChange={handleChange} required />
                <input type="text" placeholder='Phone Number' value={formData.phoneNum} name='phoneNum' id='phone-num' onChange={handleChange} />
                <input type="password" placeholder='password' value={formData.password} name="password" onChange={handleChange} required />
                <input type="password" placeholder='Re-Confirm password' value={formData.RePassword} name="RePassword" onChange={handleChange} required/>
                <button type='submit'>Sign Up</button>
                <p>Already Have an account ?</p>
            </form>
            <a href="/">Login</a>
        </div>
    </div>
    </>
  )
}

export default Register