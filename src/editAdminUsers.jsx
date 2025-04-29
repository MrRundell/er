import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Modal, Switch } from 'antd';
import './App.css';
import { set } from 'date-fns';



function EditAdminUsers({config, setShowAdmin, setSendErrorMessage, setSendSuccessMessage}) {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', userName: '', password: '', admin: 0 });

  useEffect(() => {
    
    const fetchData = async () => {
        setLoading(true);
        const JSONData = {};
        try {
            const response = await axios.post(config.api + '/getUsers.php', JSONData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
        }
    
    fetchData();
  }, [config.api, refreshUsers]);

  const handleDeleteUser = async (userId) => {
    Modal.confirm({
        title: 'Confirm Deletion',
        content: 'Are you sure you want to delete this user? This action cannot be undone.',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
            try {
                const response = await axios.post(config.api + '/deleteUser.php', { id: userId }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Delete Response:', response.data);
                if (response.status === 200) {
                    setSendSuccessMessage(response.data.message); // Use only the message field for success message
                    setUsers((prevUsers) => Array.isArray(prevUsers) ? prevUsers.filter((user) => user.id !== userId) : []);
                    setRefreshUsers(true); // Trigger a refresh of the user list
                } else {
                    setSendErrorMessage('Failed to delete user.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setSendErrorMessage('Network error. Please try again.');
            }
        },
    });
};

        const handleMakeAdmin = async (userId) => {
        Modal.confirm({
            title: 'Confirm Admin Privileges',
            content: 'Are you sure you want to make this user an admin?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await axios.post(config.api + '/makeAdmin.php', { id: userId }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log('Make Admin Response:', response.data);
                    if (response.status === 200) {
                        setSendSuccessMessage(response.data.message); // Use only the message field for success message
                        setRefreshUsers(true); // Trigger a refresh of the user list
                    } else {
                        setSendErrorMessage('Failed to make user admin.');
                    }
                } catch (error) {
                    console.error('Error making user admin:', error);
                    setSendErrorMessage('Network error. Please try again.');
                }
            },
        });
    };

    const handleAddUser = () => {
        setShowAddUser(true);
    }

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        let emailBody=config.passwordEmailBody;
    
        emailBody = emailBody.replace('**UserName**', newUser.userName);
        emailBody = emailBody.replace('**email**', newUser.email);
        emailBody = emailBody.replace('**password**', newUser.password);
        emailBody = emailBody.replace('**logo**', config.logo);
        emailBody = emailBody.replace('**churchName**', config.churchName);
        emailBody = emailBody.replaceAll('**url**', config.url);
 
        sendEmail( { to: newUser.email, subject: 'Account Details', body: emailBody } );

        // Encrypt the password using MD5
        const encryptedPassword = CryptoJS.MD5(newUser.password).toString();

        const userData = {
            ...newUser,
            passwordHash: encryptedPassword, // Add the encrypted password
        };

        try {
            const response = await axios.post(config.api + '/insertUser.php', userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Add User Response:', response.data);
            if (response.status === 200) {
                setSendSuccessMessage("User created - now send them an email with their login details.");
                setShowAddUser(false);
                setNewUser({ email: '', userName: '', admin: 0, password: '' });
            } else {
                setSendErrorMessage('Failed to add user.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setSendErrorMessage('Network error. Please try again.');
        }
    };

    const sendEmail = async (emailData) => {
        console.log('Sending email with data:', emailData);

        setLoading(true);
        try {
            const response = await axios.post(config.api + '/sendEmail.php', emailData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Email Response:', response.data);
            if (response.status === 200) {
                setSendSuccessMessage("Email sent successfully.");
                emailData.to = '';
                emailData.subject = '';
                emailData.body = '';
                setRefreshUsers(!refreshUsers);
                setLoading(false);
            } else {
                setSendErrorMessage('Failed to send email.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSendErrorMessage('Network error. Please try again.');
            setLoading(false);
        }
    };


  return (
    <>
    {loading && <div className="spinner"></div>}
    <div className="admin-container">
        <h2>Current System Users</h2>
        <div><button style={{width: '100px'}} onClick={handleAddUser}>Add</button></div>
        <p className="small">Note: These are people authorised to access this app, not members of the Parish Records.</p>
        {loading ? (
            <div className="spinner"></div>
        ) : (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>User Name</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.message && JSON.parse(users.message).map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.userName}</td>
                            <td>{user.admin ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={()=>handleDeleteUser(user.id)}>Delete</button>
                                 <button className="left-gap" onClick={()=>handleMakeAdmin(user.id)}>Make Admin</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        {showAddUser && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Add New User</h2>
                    <form onSubmit={handleAddUserSubmit}>
                        <div className="form-group">
                            <label>Email/Login</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>User Name</label>
                            <input
                                type="text"
                                value={newUser.userName}
                                onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                                placeholder="User Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="text"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Admin</label>
                            <Switch
                                checked={newUser.admin}
                                onChange={(checked) => setNewUser({ ...newUser, admin: checked ? 1 : 0 })}
                                checkedChildren="Yes"
                                unCheckedChildren="No"
                                style={{width: '100px', marginBottom: '1em'}}
                            />
                        </div>
                        <button type="submit">Add User</button>
                        <button type="button" className="left-gap" onClick={() => setShowAddUser(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )}
       
    </div>
    </>
  );

};

export default EditAdminUsers;
