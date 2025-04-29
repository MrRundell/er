import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'
import { message } from 'antd'
import Login from './login'
import EditUser from './editUser';
import EditAdminUsers from './editAdminUsers';
import ShowER from './showER';
import CMFloatAd from './cmFloatAd';
import Reports from './reports';

function App() {
  const [config, setConfig] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [sendSuccessMessage, setSendSuccessMessage] = useState(false);
  const [sendErrorMessage, setSendErrorMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showER, setShowER] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showReports, setShowReports] = useState(false);


  useEffect(() => {
    axios.get('/.config.json')
      .then(response => {
        setConfig(response.data);
        console.log('Config:', response.data);
        setSendSuccessMessage("Config fetched successfully");
      })
      .catch(error => {
        console.error('Error fetching config:', error);
        setSendErrorMessage('Error fetching config');
      });
  }, []); 


  useEffect(() => {
    if (sendSuccessMessage) {
       messageApi.success(sendSuccessMessage);
    }
      setSendSuccessMessage(false);
    
  }, [sendSuccessMessage]);

  useEffect(() => {
    if (sendErrorMessage) {
      messageApi.error(sendErrorMessage);
    }
  }, [sendErrorMessage]);

  const logOut = () => {
    setCurrentUser(null);
    setSendSuccessMessage("Logged out successfully");
  };

  return (
    <>
    {contextHolder}
    { !config && <div className="spinner"></div> }
    { config && !currentUser && (
      <div className="App">
        <Login config={config} setUserDetails={setCurrentUser} />
      </div>
      )}
    { currentUser && (
      <div className="App">

        <h1 className="churchName">{config.churchName}</h1>

         <div className="menubar">
          <button onClick={logOut}>Log Out</button>
          <button onClick={() => setShowEditUser(!showEditUser)}>My Account</button>
          <button onClick={() => setShowER(!showER)}>Electoral Roll</button>
          <button onClick={() => setShowReports(!showReports)}>Reports</button>
          {(currentUser.admin===1) &&  <button onClick={() => setShowAdmin(!showAdmin)}>Admin</button> }
          <img src={config.logo} alt="Logo" className="logo" />
        </div>

        {showReports && (
        <Reports config={config} setSendErrorMessage={setSendErrorMessage} />
        )}
        
        {showEditUser && (
                <EditUser config={config} setShowEditUser={setShowEditUser} 
                          currentUser={currentUser} setCurrentUser={setCurrentUser} 
                          setSendErrorMessage={setSendErrorMessage} 
                          setSendSuccessMessage={setSendSuccessMessage} />
        )}

        {showAdmin && (
                <EditAdminUsers config={config} setShowAdmin={setShowAdmin}
                                              setSendErrorMessage={setSendErrorMessage} 
                                              setSendSuccessMessage={setSendSuccessMessage} />
        )}

        {showER && (
                <ShowER config={config} currentUser={currentUser}
                        setSendErrorMessage={setSendErrorMessage} 
                        setSendSuccessMessage={setSendSuccessMessage} />
                
        )}

      </div>
      )}
      <CMFloatAd config={config} backgroundColor='#ffffff' color='#000000' border='0px transparent'/>
    </>
  )
}

export default App
