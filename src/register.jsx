import { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';


function Register({ config, setShowRegister, setSendErrorMessage, setSendSuccessMessage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        // Hash the password with MD5

        if (email === '' || password === '' || userName === '') {
            setSendErrorMessage('Please fill in all fields');
            return;
        }

        const hashedPassword = CryptoJS.MD5(password).toString();

        const jsonData = {  email: email, 
                            passwordHash: hashedPassword, 
                            userName: userName 
 };

        console.log("JSONData:", jsonData);
        const response = await axios.post(config.api + '/insertUser.php', jsonData);
        const data = response.data;
        setSendSuccessMessage(data.message);
        setShowRegister(false);

    };

    return (
        <>

            <div className="login-container">

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
                        <div className='form-group'>
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Full Name"
                            />
                        </div>

                        <div className='form-group-button'>
                            <button type="submit">Register</button>
                            <button type="button" className="smalltop" onClick={() => setShowRegister(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div> 
        </>
    );
}

export default Register;