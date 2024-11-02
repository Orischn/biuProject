import { useState } from "react";
import ChangePassword from "../changePassword/ChangePassword";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import InputFile from "../inputFile/InputFile";

function GeneralSettingsPage({ token, userId }) {
    
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('')
    
    const save = async (e) => {
        const updateCSV = async () => {
            const res = await api.post(`/api/uploadDecisionTree/`, {
                'fileName': fileName,
                "CSVTree": fileContent,
            })
            if (res === 500) {
                alert(res.data)
            } else if (res === 400) {
                setError(res.data)
            }
        }
        e.preventDefault();
        updateCSV()
    }
    
    return (
        <>
        <h2 className="settings-title">General Settings</h2>
        <div className="settings-container">
        {/* need theme??? */}
        {/* <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select id="theme">
            <option value="white-mode">Light Mode</option>
            <option value="dark-mode">Dark Mode</option>
            </select>
            </div> */}
            
            <div className="setting-item">
            <label htmlFor="uploadFile">Upload CSV Files</label>
            <form id="uploadFile" noValidate onSubmit={save} >
            <InputFile title={'Decision Tree: '} setFileName={setFileName} setFileContent={setFileContent} error={error} />
            <input type="submit" className="btn btn-primary submit" value="Save" />
            </form>
            </div>
            
            <div className="setting-item">
            <label htmlFor="changePasswordForm">Change your password</label>
            <ChangePassword token={token} userId={userId} />
            <div>123</div>
            </div>
            
            {/* <div className="setting-item">
                <button className="save-button">Save Changes</button>
                </div> */}
                </div>
                
                </>
            )
        }
        
        export default GeneralSettingsPage