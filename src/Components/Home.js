import React, { useContext, useState } from 'react'
import { ErrorMsgContext, KeyPadContext } from '../App'
import axios from 'axios'


function Key({keyNum, inputKey, setInputKey, setMessage, setErrorMsg}){


  const postData = async()=>{
    try{
      const currentTime = Date()
      const response = await axios.post('https://oshitimeserver.onrender.com/timer', {currentTime, inputKey})
      setInputKey("")
      setMessage(response.data.returnMsg)
      setTimeout(()=>{
        window.location.reload()
      }, 1000)
      
    } catch(e){
      console.log("Error", e)
      setErrorMsg(e.request.responseText)
    }
  }

  
  function handleClick(e){
    if(Number(e.target.innerHTML)){
      setInputKey(inputKey + e.target.innerHTML)
    } else if (e.target.innerHTML === "Enter" && inputKey){
      postData()
    } else {
      setInputKey(inputKey.slice(0, inputKey.length - 1))
    }
    
  }
  return(
    <div className="keyNum" >
      <h2 onClick={handleClick}>{keyNum}</h2>
    </div>
  )
}

function Home() {

  const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)
  const { inputKey, setInputKey } = useContext(KeyPadContext)
  const [ message, setMessage ] = useState('')

  const keyPadNum = [1,2,3,4,5,6,7,8,9,"<-",0,"Enter"]
  return (
    <>  
    <div className='home-container'>
        <div className="keypad-container">
          <div className="display-box">
            <p className={message}>{message}</p>
            <label htmlFor="employeeID">Enter your Employee ID:</label>
            <input type="text" value={inputKey} id='employeeID' disabled />
          </div>
          <div className="keypad">
            {keyPadNum.map((key) => <Key key={key} setErrorMsg={setErrorMsg} keyNum={key} setInputKey={setInputKey} inputKey={inputKey} setMessage={setMessage}  />)}
          </div>
        </div>
    </div>
    </>
  )
}

export default Home;