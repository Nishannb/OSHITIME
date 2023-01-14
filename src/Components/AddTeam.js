import React, {useState, useContext} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { ErrorMsgContext } from '../App'

function AddTeam() {

  const [registerUser, setRegisterUser] = useState({
    username:"",
    email:"",
    perHour:"",
    employeeID: ""
  })
  const [cookies, setCookie, removeCookie] = useCookies('')
  const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

  const email = cookies.UserEmail

  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post('https://oshitimeserver.onrender.com/addteam', {registerUser, email});

        const success = response.status === 201;
        if(success) setRegisterUser({ username:"", email:"", perHour:"", employeeID: ""})

        window.location.reload();
        setErrorMsg(e.request.responseText)  // using setErrorMsg to display success msg
    } catch(e){
        setErrorMsg(e.request.responseText)
    }
  }

  const handleChange =(e)=>{
    const name = e.target.name
    const value = e.target.value

    setRegisterUser((prevState)=>({
        ...prevState,
        [name]: value,
    }))
}

  return (
    <div className='addteam-container'>
      <div className="heading">
        <h1>Add Team Member</h1>
        <p>Create a new vacant job</p>
      </div>
      <form onSubmit={handleSubmit}>
          <div className="inputboxes">
            <label htmlFor="username">FullName: </label>
            <input type="text" id='username' name='username' placeholder='Full Name' required onChange={handleChange}/>
          </div>
          <div className="inputboxes">
            <label htmlFor="email">Email: </label>
            <input type="email" name="email" id="email" placeholder='Email' required onChange={handleChange}/>
          </div>
          <div className="inputboxes">
            <label htmlFor="wage">Hourly Wage: </label>
            <input type="text" id='wage' name='perHour' placeholder='Hourly Wage' required onChange={handleChange} />
          </div>
          <div className="inputboxes">
            <label htmlFor="employeeID">EmployeeID: </label>
            <input type="number" id='wage' name='employeeID' placeholder='Set 6 digit Employee ID' required onChange={handleChange} />
          </div>
         
          <div className="btns">
            <button type='submit' >Submit</button>
            <a href="/team" className='backbtn'>Back</a>
          </div>

        </form>
        
        
    </div>
  )
}

export default AddTeam