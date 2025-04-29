import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Modal, Switch } from "antd";
import "./App.css";

function EditUser({ config, currentUser, setSendErrorMessage, setSendSuccessMessage }) {
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState(currentUser.passwordHash);
    const [password2, setPassword2] = useState('');
    const [password1, setPassword1] = useState('');
    const [userName, setUserName] = useState(currentUser.userName);
    const [loading, setLoading] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [nonMatchingPasswords, setNonMatchingPasswords] = useState(false);
    const [goodToGo, setGoodToGo] = useState(true);
    const [incompleteData, setIncompleteData] = useState(false);

    const handleShowPasswordChange = (checked) => {
        setShowPasswordChange(checked);
        if (checked) {
          setSendSuccessMessage("Change Password");
        } else {
          setSendSuccessMessage("Not changing Password");
        }
      }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || userLocation === "" || userName === "") {
            setIncompleteData(true);
            setGoodToGo(false);
        }

        if (password1 !== password2) {
            setNonMatchingPasswords(true);
            setGoodToGo(false);
            
        }

        const hashedPassword = password1 !== "" ? CryptoJS.MD5(password1).toString() : password;
        console.log("Password:", password1, "Hashed Password:", hashedPassword);

        const jsonData = {
            email: email,
            passwordHash: hashedPassword,
            userName: userName,
            id: currentUser.id
        };

        if (goodToGo) {
            
        
        console.log("JSONData:", jsonData);
        setLoading(true);

        try {
            const response = await axios.post(config.api + "/updateUser.php", jsonData);
            const data = response.data;
            console.log("Response:", data);

            if (data.status_code === 200) {
                setSendSuccessMessage(data.message);
                setcurrentUser(jsonData);
                console.log("User updated successfully");
            } else {
                console.log("Update failed");
                setSendErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }

        } // goodToGo

    };

    return (
        <div className="edit-user-container">
            {loading ? (
                        <div className="spinner"></div>
            ) : (
                <>
                 <div className="login-form">
                    <form onSubmit={handleSubmit}>
                         <div className="form-group">
                             <label>eMail/Login</label>
                             <input
                                 type="email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="Email"
                             />
                         </div>
                         <div className="form-group">
                         <span className="medium-switch"><Switch checkedChildren="Leave Password" 
                                                                 unCheckedChildren="Change Password" 
                                                                 onChange={handleShowPasswordChange}/>
                         </span>
                          {showPasswordChange && (
                            <>
                             <label>Reset Password (leave blank if unchanged)</label>
                             <input
                                 type="password"
                                 onChange={(e) => setPassword1(e.target.value)}
                                 placeholder="Password"
                             />
                            <input
                                 type="password"
                                 onChange={(e) => setPassword2(e.target.value)}
                                 placeholder="Re-enter Password"
                             />
                             </>
                            )}
                         </div>
                         <div className="form-group">
                             <label>User Name</label>
                             <input
                                 type="text"
                                 value={userName}
                                 onChange={(e) => setUserName(e.target.value)}
                                 placeholder="User Name"
                             />
                         </div>

                         <button type="submit">Update User</button>
                         
                     </form>
                 </div>

                        <Modal
                            title="Password Error"
                            centered
                            open={nonMatchingPasswords}
                            footer={null}
                            onCancel={() => setNonMatchingPasswords(false)}>
                            <p>Sorry, your passwords do not match. Please try again.</p>
                            <button onClick={() => setNonMatchingPasswords(false)}>OK</button>
                        </Modal>
                        <Modal
                            title="Incomplete Data"
                            centered
                            open={incompleteData}
                            footer={null}
                            onCancel={() => setIncompleteData(false)}>
                            <p>Sorry, your passwords do not match. Please try again.</p>
                            <button onClick={() => setIncompleteData(false)}>OK</button>
                        </Modal>
                </>
            )}
            </div>
    );
}

export default EditUser;
