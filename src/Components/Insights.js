import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { v4 as uuidv4 } from 'uuid'
import { ErrorMsgContext } from '../App'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'


function DisperData({data}) {
  return(
    <tr className="table-data">
      <td>
        <small>{data.username}</small>
      </td>
      <td>
        <small>{data.date}</small>
      </td>
      <td>
        <small>{data.timeCard}</small>
      </td>
      <td>
        <small>{(data.workedHour/3600000).toFixed(1)}</small>
      </td>
    </tr>
  )
}



function Insights() {

  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const email = cookies.UserEmail

  const [ insightsData, setInsightsData ] = useState()
  const [dates, setDate ] = useState()

  const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext)

  const handleChange = (e) =>{
    let selectedDate = e.target.value

    let date = new Date(selectedDate)
    fetchData(date)
    setDate(String(date).slice(4,7))
  }

  const fetchData = async(selectedDate)=>{
    try {
      const response = await axios.get('https://oshitimeserver.onrender.com/insights', {params: {date: selectedDate, email:email}})
      setInsightsData(response.data)
    } catch (error) {
      setErrorMsg(error.request.responseText)
    }
  }

  useEffect(()=>{
    fetchData(Date())
    setDate(Date().slice(4,7))
  }, [])

  return (
    <div className='insights-container'>
      <div className="time-input">
        <input type="date" name="date" id="date" onChange={handleChange}/>

       <div className="other-option">
        <ReactHTMLTableToExcel 
            id='table-to-excel' 
            className='table-to-excel' 
            filename={dates+'_Worktimetally'}
            sheet={dates+'_Worktimetally'}
            table='table' 
            buttonText='Download excel' 
          />
          <a href="/insights/edit-data" className='edit-data'>Edit table</a>
       </div>
        
      </div>

      

      <div className="table-container">
            <table id="table">
                <thead>
                    <tr className="table-heading">
                        <th>
                            <h6>Employees</h6>
                        </th>
                        <th>
                            <h6>Month</h6>
                        </th>
                        <th>
                            <h6>Time Card <br /> (hh:mm:ss)</h6>
                        </th>
                        <th>
                            <h6>Total <br /> Worked Hours</h6>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {insightsData && insightsData.map((data)=><DisperData data={data} key={uuidv4()}/>)}
                    {!insightsData && <h2>Loading work time table.....</h2>}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Insights