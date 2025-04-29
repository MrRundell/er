import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Modal } from 'antd';
import axios from 'axios';
import Register from './register';

const Login = ({ config, setUserDetails, setSendErrorMessage, setSendSuccessMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Hash the password with MD5
    const hashedPassword = CryptoJS.MD5(password).toString();
    const JSONData = { email: email, passwordHash: hashedPassword };

    console.log("JSONData:", JSONData);

    try {
      const response = await axios.post(config.api + '/getLogin.php', JSONData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log('Response:', data);

      // Handle the response data here
      if (data.status_code === 200) {
        const user = JSON.parse(data.message)[0]; // Parse the JSON string and get the first user object
        if (user) {
          setUserDetails(user);
          console.log('Login successful');
          setIsLoading(false);
        } else {
          console.log('User not found');
          setFailedLogin(true);
          setIsLoading(false);
        }
      } else {
        // Login failed
        console.log('Login failed');
        setFailedLogin(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Network error. Please try again.");
      setIsLoading(false);
      setFailedLogin(true);
    }
  };

  return (
    <>
      {isLoading && <div className="spinner"></div>}
      <Modal
        title="Login Failed"
        centered
        open={failedLogin}
        footer={null}
        onCancel={() => setFailedLogin(false)}
      >
        <p>Sorry, your login failed. Please try again.</p>
        <button onClick={() => setFailedLogin(false)}>OK</button>
      </Modal>

      {showRegister ? (
        <Register config={config} setShowRegister={setShowRegister} setSendErrorMessage={setSendErrorMessage} setSendSuccessMessage={setSendSuccessMessage} />
      ) : (
        <div className="login-container">
          <h1>{config.appName}</h1>
          <p>{config.strapline}</p>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>eMail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className='form-group'>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className='form-group-button'>
                <button type="submit" style={{width: '250px'}}>Login</button>
              </div>
            </form>
            {/* <button onClick={() => setShowRegister(true)}>Register (free)</button> */}
          </div>
          <p className="small">This application is subject to the Data Protection Act and the General Data Protection Regulations. Unauthorised access is prohibited.</p>
          <p className="small">{config.credits}</p>
        </div>
      )}
    </>
  );
};

export default Login;