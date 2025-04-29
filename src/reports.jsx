import DefaultRenderEmpty from 'antd/es/config-provider/defaultRenderEmpty';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Reports({config, setSendErrorMessage}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reLoadData, setReLoadData] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await axios.post(config.api + "/getReports.php", {}, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log("Response:", response.data);
                if (response.data.status_code !== 200) {
                    setSendErrorMessage("Failed to fetch report data");
                    return;
                }
                const parsedData = JSON.parse(response.data.message); // Parse the JSON string in the message field
                setData(parsedData);
            } catch (error) {
                console.error("Error fetching report data:", error);
                setSendErrorMessage("Error fetching report data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [config.api]);

    return (
        <div className="reports-container">
            {loading && <div className="spinner"></div>}
            <table>
                <tbody>
                    <tr>
                        <td>Total Records</td>
                        <td>{data.total}</td>
                    </tr>
                    <tr>
                        <td>All on ER</td>
                        <td>{data.er}</td>
                    </tr>
                    <tr>
                        <td>Resident</td>
                        <td>{data.resident}</td>
                    </tr>
                    <tr>
                        <td>Non-Resident</td>
                        <td>{data.total - data.resident}</td>
                    </tr>
                    <tr>
                        <td>Resident and on ER</td>
                        <td>{data.erresident}</td>
                    </tr>
                    <tr>
                        <td>Over 70 Years Old Totoal</td>
                        <td>{data.over70}</td>
                    </tr>
                    <tr>
                        <td>Over 70 Years Old and on ER</td>
                        <td>{data.over70ER}</td>
                    </tr>
                    <tr>
                        <td>Under 18 Years Old Total</td>
                        <td>{data.under18}</td>
                    </tr>
                    <tr>
                        <td>Under 18 Years Old and on ER</td>
                        <td>{data.under18ER}</td>
                    </tr>
                </tbody>
            </table>
            <button className="top-gap button-small" onClick={() => window.print()}>
                <span role="img" aria-label="print" style={{ fontSize: '20px' }}>🖨️</span>
            </button>
        </div>
    );


}

export default Reports;