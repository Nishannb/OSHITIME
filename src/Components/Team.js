import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useCookies } from 'react-cookie'
import { ErrorMsgContext } from '../App'


function List({name}){
  return(
    <li>- {name}</li>
  )
}

function Team() {

  const [teamList, setTeamList ] = useState() 
  const [cookies, setCookie, removeCookie] = useCookies('')
  const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

  const email = cookies.UserEmail

  const fetchTeam = async()=>{
    try {
      const response = await axios.get('https://oshitimeserver.onrender.com/team', {params: {email: email}})
      setTeamList(response.data)
    } catch (error) {
      setErrorMsg(error.request.responseText)
    }
  }

  useEffect(()=>{
    fetchTeam()
  },[])

  return (
    <div className='team-container'>
      <div className="heading-section">
        <h1>Team List</h1>
        <a href="/addteam"><button>+</button> </a>
      </div>
      <hr />
      <div className="teamlist-container">
        <ol>
          {teamList && teamList.employees.map((employee) => <List key={employee._id} name={employee.username} /> )}
          {!teamList && <h2>Loading your teams data........</h2>}
        </ol>
      </div>
    </div>
  )
}

export default Team