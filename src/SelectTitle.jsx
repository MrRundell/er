import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function SelectTitle({ config, memberTitle, setMemberTitle, setSendErrorMessage }) {
    const [titles, setTitles] = useState([]);

    const handleTitleSelect = (title) => {
        setMemberTitle(title);
        console.log("Selected title:", title);
    };

    return (
        <div>
                <select
                    className="title-dropdown"
                    value={memberTitle || ''}
                    onChange={(e) => handleTitleSelect(e.target.value)} >
                    <option value="" disabled>Select title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Mx">Mx</option>
                    <option value="Master">Master</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                    <option value="Rev">Rev</option>
                    <option value="Fr">Fr</option>
                    <option value="Rev Dr">Rev Dr</option>
                    <option value="Rev Prof">Rev Dr</option>
                    <option value="Bp">Bp</option>
                    <option value="Sir">Sir</option>
                    <option value="Dame">Dame</option>
                    <option value="Lord">Lord</option>
                    <option value="Lady">Lady</option>
                    <option value="Capt">Capt</option>
                    <option value="Major">Major</option>
                    <option value="Brig">Brig</option>
                    <option value="Gen">Gen</option>
                    <option value="Col">Col</option>
                    <option value="Lt">Lt</option>
                    <option value="Sgt">Sgt</option>
                    <option value="Admiral">Admiral</option>
                </select>
            
        </div>
    );
}

export default SelectTitle;