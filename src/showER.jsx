import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Input, Switch } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CheckOutlined, CloseOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import SelectTitle from './SelectTitle';
import moment from 'moment';
import { format } from 'date-fns';

function ShowER({ config, currentUser, setSendErrorMessage, setSendSuccessMessage }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditUser, setShowEditUser] = useState(false);
    const [showPCCEnd, setShowPCCEnd] = useState(false);
    const [editItem, setEditItem] = useState({});
    const [reLoadData, setReLoadData] = useState(false);
    const [justER, setJustER] = useState(false);
    const [justPCC, setJustPCC] = useState(false);
    const [justResident, setJustResident] = useState(false);
    const [justNonResident, setJustNonResident] = useState(false);
    const [justUnder18, setJustUnder18] = useState(false);
    const [justOver70, setJustOver70] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showData, setShowData] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await axios.post(config.api + "/getER.php", {}, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log("Response:", response.data);
                if (response.data.status_code !== 200) {
                    setSendErrorMessage("Failed to fetch ER data");
                    return;
                }
                const parsedData = JSON.parse(response.data.message); // Parse the JSON string in the message field
                setData(parsedData);
            } catch (error) {
                console.error("Error fetching ER data:", error);
                setSendErrorMessage("Error fetching ER data");
            } finally {
                setShowData(true);
                setLoading(false);
            }
        };
        fetchData();
    }, [config.api, reLoadData]);

    const handleEditLine = (item) => {
        console.log("Edit line clicked:", item);
        setEditItem({ ...item }); // Clone the selected item into editItem
        setShowData(false);
        setShowEditUser(true);
    };

    const handleEditChange = (field, value) => {
        setEditItem((prev) => ({
            ...prev,
            [field]: value, // Dynamically update the specific field in editItem
        }));
    };

    const handleJustER = (checked) => {
        setJustER(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.er === 1));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleJustPCC = (checked) => {
        setJustPCC(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.pcc === 1));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleJustResident = (checked) => {
        setJustResident(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.resident === 1));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleJustNonResident = (checked) => {
        setJustNonResident(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.resident === 0 || item.resident === null));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleJustOver70 = (checked) => {
        setJustOver70(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.over70 === 1));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleJustUnder18 = (checked) => {
        setJustUnder18(checked);
        if (checked) {
            setData((prevData) => prevData.filter((item) => item.under18=== 1));
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting:", editItem);

        try {
            const response = await axios.post(config.api + '/updateER.php', editItem, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response:', response.data);
            if (response.data.status_code === 200) {
                setSendSuccessMessage("Member details updated successfully");
                setShowEditUser(false);
                setShowData(true);
                setLoading(true);
                setReLoadData(!reLoadData); // Refresh the data after update
            } else {
                setSendErrorMessage("Failed to update member details");
            }
        } catch (error) {
            console.error('Error:', error);
            setSendErrorMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
            setShowEditUser(false);
            setShowData(true);
            setEditItem({});
        }
    };

    const handleResident = (checked) => {
        setEditItem((prev) => ({ ...prev, resident: checked }));
        setSendSuccessMessage(checked ? "Marked as resident in the parish" : "Marked as non-resident in the parish");
    };

    const handleER = (checked) => {
        setEditItem((prev) => ({ ...prev, er: checked }));
        setSendSuccessMessage(checked ? "Marked as on the parish electoral roll" : "Marked as not on the parish electoral roll");
    };

    const handleCommunicant = (checked) => {
        setEditItem((prev) => ({ ...prev, communicant: checked }));
        setSendSuccessMessage(checked ? "Marked as a communicant member of the church" : "Marked as non-communicant member of the church");
    };

    const handleGDPR = (checked) => {
        setEditItem((prev) => ({ ...prev, gdpr: checked }));
        setSendSuccessMessage(checked ? "GDPR Consent given" : "GDPR Consent withdrawn");
    };

    const handlePCC = (checked) => {
        setEditItem((prev) => ({ ...prev, pcc: checked }));
        setShowPCCEnd(checked);
        setSendSuccessMessage(checked ? "Marked as member of the PCC" : "Not a member of the PCC");
    };

    const handleOver70 = (checked) => {
        setEditItem((prev) => ({ ...prev, over70: checked }));
        setSendSuccessMessage(checked ? "Marked as over 70 years old" : "Marked as not over 70 years old");
    };

    const handleUnder18 = (checked) => {
        setEditItem((prev) => ({ ...prev, under18: checked }));
        setSendSuccessMessage(checked ? "Marked as under 18 years old" : "Marked as not under 18 years old");
    };

    const onChangePCCEnd = (e) => {
        const selectedYear = e.target.value; // Get the selected value from the dropdown
        console.log("PCC End: ", selectedYear);
        setEditItem((prev) => ({ ...prev, pccEnd: selectedYear })); // Update the state with the selected year
    };

    const handleDateChange = (field, date) => {
        console.log(`${field}:`, date);
        setEditItem((prev) => ({
            ...prev,
            [field]: date ? format(date, 'yyyy-MM-dd') : null, // Send as 'YYYY-MM-DD' to the backend
        }));
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        if (value) {
            setData((prevData) =>
                prevData.filter(
                    (item) =>
                        (item.firstName && item.firstName.toLowerCase().includes(value)) ||
                        (item.lastName && item.lastName.toLowerCase().includes(value))
                )
            );
        } else {
            setReLoadData(!reLoadData); // Reload data to reset the filter
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        setData((prevData) => {
            const sortedData = [...prevData].sort((a, b) => {
                if (a[key] < b[key]) {
                    return direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            return sortedData;
        });
    };

    const addMember = () => {
        setShowData(false);
        setEditItem({});
        setShowEditUser(true);
    }

    const closeEditUser = () => {
        setShowEditUser(false);
        setShowData(true);
        setEditItem({});
    }

    return (
        <>
            {loading && <div className="spinner"></div>}

            {data && showData && (
                <div className="data-container">
                    <h2>Electoral Roll</h2>
                    
                    <div className="filter-container">
                    <button onClick={addMember} style={{width: '100px'}}>Add</button>
                    <div>Just ER: <Switch
                                        checked={justER || false}
                                        onChange={handleJustER}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    /></div>
                    <div>Just PCC: <Switch
                                        checked={justPCC || false}
                                        onChange={handleJustPCC}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    /></div>
                    <div>Just Resident: <Switch
                                        checked={justResident || false}
                                        onChange={handleJustResident}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    /></div>
                    <div>Just Non-Resident: <Switch
                                        checked={justNonResident || false}
                                        onChange={handleJustNonResident}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    /></div>
                    <div>Just Over 70s: <Switch
                                        checked={justOver70 || false}
                                        onChange={handleJustOver70}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    /></div>
                    <div>Just Under 18s: <Switch
                                        checked={justUnder18 || false}
                                        onChange={handleJustUnder18}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                    /></div>
                    </div>
                    <div className="two-inputs">
                    <div>Search: <Input size="small" 
                                        onChange={handleSearch} 
                                        allowClear 
                                        placeholder="first or last name"
                                        className="data-input" />
                       
                    </div>
                    <div><button className="top-gap button-small" onClick={() => window.print()}>
                            <span role="img" aria-label="print" style={{ fontSize: '20px' }}>🖨️</span>
                        </button></div>
                        </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>On ER</th>
                                <th>First Name<br />
                                <span className="v-small">&nbsp;</span>
                                </th>
                                <th onClick={() => handleSort('lastName')} style={{ cursor: 'pointer' }}>
                                    Last Name {sortConfig.key === 'lastName' && (sortConfig.direction === 'ascending' ? <UpOutlined /> : <DownOutlined />)}
                                    <span className="v-small">({sortConfig.direction || 'unsorted'})</span>
                                </th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Mobile</th>
                                <th colSpan="3">Address</th>
                                <th>Postcode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} onClick={() => handleEditLine(item)}>
                                    <td>{item.id}</td>
                                    <td>{item.er ? <CheckOutlined /> : null}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.tel}</td>
                                    <td>{item.mobile}</td>
                                    <td>{item.address1}</td>
                                    <td>{item.address2}</td>
                                    <td>{item.address3}</td>
                                    <td>{item.postcode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showEditUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <div className="two-inputs">
                                    <SelectTitle
                                        config={config}
                                        memberTitle={editItem.title}
                                        setMemberTitle={(title) => handleEditChange('title', title)}
                                        setSendErrorMessage={setSendErrorMessage}
                                        setSendSuccessMessage={setSendSuccessMessage}
                                    />  
                                    <input
                                        type="text"
                                        value={editItem.firstName || ''}
                                        onChange={(e) => handleEditChange('firstName', e.target.value)}
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        value={editItem.lastName || ''}
                                        onChange={(e) => handleEditChange('lastName', e.target.value)}
                                        placeholder="Last Name"
                                        className="bold"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                            <div className="two-inputs">
                            <label>Date of Birth</label>
                                <div className="date-picker">
                                     <DatePicker
                                        selected={editItem.dateofBirth ? new Date(editItem.dateofBirth) : null}
                                        onChange={(date) => handleDateChange('dateofBirth', date)}
                                        dateFormat={config.dateFormat} // Display as 'DD/MM/YYYY'
                                        placeholderText="Select Date of Birth"
                                        className="dob"
                                    />
                                </div>
                                </div>
                                <div className="form-group">
                                <div className="two-inputs">
                                    <label>Under 18&nbsp;</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.under18 || false}
                                        onChange={handleUnder18}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                    <label>Over 70&nbsp;</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.over70 || false}
                                        onChange={handleOver70}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                </div>
                                
                            </div>
                            </div>
                            <div className="form-group">
                                <div className="admin-switch">
                                <div className="address-container">
                                <label>Address</label>
                                    <input
                                        type="text"
                                        value={editItem.address1 || ''}
                                        onChange={(e) => handleEditChange('address1', e.target.value)}
                                        placeholder="Address"
                                    />
                                    <input
                                        type="text"
                                        value={editItem.address2 || ''}
                                        onChange={(e) => handleEditChange('address2', e.target.value)}
                                        placeholder=""
                                    /> 
                                    <input
                                        type="text"
                                        value={editItem.address3 || ''}
                                        onChange={(e) => handleEditChange('address3', e.target.value)}
                                        placeholder=""  
                                    />
                                    <input
                                        type="text"
                                        value={editItem.postcode || ''}
                                        onChange={(e) => handleEditChange('postcode', e.target.value)}
                                        placeholder="Postcode"
                                    />
                                </div>
                                <div className="switches-container">
                                <label className='biglabel'>Resident</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.resident || false}
                                        onChange={handleResident}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                    <label className='biglabel'>Electoral Roll</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.er || false}
                                        onChange={handleER}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                <label className='biglabel'>Communicant</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.communicant || false}
                                        onChange={handleCommunicant}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                />
                                <label className='biglabel'>GDPR Consent</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.gdpr || false}
                                        onChange={handleGDPR}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                />
                                <label className='biglabel'>PCC Member</label>
                                    <Switch
                                        className="switch"
                                        checked={editItem.pcc || false}
                                        onChange={handlePCC}
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                    {editItem.pcc && (
                                        <>
                                            <label className='biglabel'>PCC End Date</label>
                                            <select 
                                                onChange={onChangePCCEnd} 
                                                value={editItem.pccEnd || ''} 
                                            >
                                            <option key={2025} value={2025}>2025</option>
                                            <option key={2026} value={2026}>2026</option>
                                            <option key={2027} value={2027}>2027</option>
                                            <option key={2028} value={2028}>2028</option>
                                            <option key={2029} value={2029}>2029</option>
                                            <option key={2030} value={2030}>2030</option>
                                            <option key={2031} value={2031}>2031</option>
                                            <option key={2032} value={2032}>2032</option>
                                            <option key={2033} value={2033}>2033</option>
                                            <option key={2034} value={2034}>2034</option>
                                            <option key={2035} value={2035}>2035</option>
                                            <option key={2036} value={2036}>2036</option>
                                            <option key={2037} value={2037}>2037</option>
                                            </select>
                                        </>
                                    )}
                                </div>
                            </div>
                            </div>
                            <div className="form-group">
                            <div className="two-inputs">
                            <label>Email</label>
                                <input
                                    type="email"
                                    value={editItem.email || ''}
                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                    placeholder="Email"
                                />
                            </div>
                            </div>
                            <div className="form-group">
                            <div className="two-inputs">
                                <label>Phone</label>
                                    <input
                                        type="text"
                                        value={editItem.tel || ''}
                                        onChange={(e) => handleEditChange('tel', e.target.value)}
                                        placeholder="Home Phone"
                                    />

                                        <label>Mobile</label>
                                    <input
                                        type="text"
                                        value={editItem.mobile || ''}
                                        onChange={(e) => handleEditChange('mobile', e.target.value)}
                                        placeholder="Mobile Phone"
                                    />
                                
                            </div>
                            </div>
                            <button type="submit">Update</button>
                            <button type="button" className="left-gap" onClick={closeEditUser}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default ShowER;