import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Insights from './Components/Insights';
import Team from './Components/Team';
import AddTeam from './Components/AddTeam';
import { createContext, useState } from 'react';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Register from './Components/Register';
import { useCookies } from 'react-cookie';
import EditDBData from './Components/EditDBData';
import Error from './Components/Error';

export const KeyPadContext = createContext({})
export const ErrorMsgContext = createContext({})

function App() {

  const[cookies, setCookie, removeCookie]= useCookies(['user'])
  const authToken = cookies.AuthToken

  const [errorMsg, setErrorMsg] = useState("")
  
  let letXBe = false

  const [ inputKey, setInputKey] = useState("")
  return (
    <KeyPadContext.Provider value={{inputKey, setInputKey}}>
      <ErrorMsgContext.Provider value={{errorMsg, setErrorMsg}}>
        <BrowserRouter>
          <div className="App">
            {authToken && <Navbar />}
              <Routes>
                <Route path='/' element={<Login />} />
                {authToken && <Route path='/home' element={<Home />} />}
                <Route path='/register' element={<Register />}/>
                {authToken && <Route path='/team' element={<Team />} />}
                {authToken && <Route path='/addteam' element={<AddTeam />} />}
                {authToken && <Route path='/insights' element={<Insights />} />}
                {authToken && <Route path='/insights/edit-data' element={<EditDBData />} />}
                <Route path='*' element={<Error />} />
              </Routes> 
              <Footer /> 
          </div>
        </BrowserRouter>
      </ErrorMsgContext.Provider>
    </KeyPadContext.Provider>
  );
}

export default App;
