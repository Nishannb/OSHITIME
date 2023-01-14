import React, {useState, useContext} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { ErrorMsgContext } from '../App'

function EditDBData() {

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const email = cookies.UserEmail

    const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

    const [timeFormData, setTimeFormData ] = useState({
        username:"",
        starttime:"",
        endtime:""
    })

    const [message, setMessage] = useState('')

    const handleSubmit =async(e)=>{
        e.preventDefault()
        try {
            const response = await axios.post('https://oshitimeserver.onrender.com/edit', {email, timeFormData})
            setMessage(response.data)
            setTimeout(()=>{
                window.location.reload()
            }, 1000)
        } catch (error) {
            console.log('Error', error)
            setErrorMsg(error.request.responseText)
        }
    }

    const handleChange =(e)=>{
        const name = e.target.name
        const value = e.target.value

        setTimeFormData((prevState)=>({
            ...prevState,
            [name]: value,
        }))
    }
  return (
    <div className='editdbdata-container'>
        <p>{message}</p>
        <div className="heading-section">
            <h3>Edit Work Time Data</h3>
            <small>Use this form to add new or correct old work time information. </small>
        </div>
        <div className="edit-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input type="text" placeholder='Username' name='username' id='username' onChange={handleChange} required/>
                <small>Please check username in team page if required!!</small>
                <label htmlFor="start">Clock-in time: </label>
                <input type="datetime-local" className='datetime-input' name='starttime' id='start' onChange={handleChange} required/>
                <label htmlFor="end">Clock-out time: </label>
                <input type="datetime-local" className='datetime-input' id='end' name='endtime' onChange={handleChange} required/>
                <button type='submit' >Submit</button>
            </form>
        </div>
    </div>
  )
}

export default EditDBData