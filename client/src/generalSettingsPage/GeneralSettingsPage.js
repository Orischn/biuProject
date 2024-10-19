import { useState } from "react";
import InputFile from "../inputFile/InputFile";
import ChangePassword from "../changePassword/ChangePassword";

function GeneralSettingsPage({ token, userId }) {

    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('')

    const save = async (e) => {
        const updateCSV = async () => {
            const res = await fetch(`https://localhost:5000/api/uploadDecisionTree/`, {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                'body': JSON.stringify({
                    'fileName': fileName,
                    "CSVTree": fileContent,
                })
            })
            if (res === 500) {
                await res.text().then((errorText) => alert(errorText))
            } else if (res === 400) {
                await res.text.then((errorText) => setError(errorText))
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
                    <label htmlFor="files">Upload CSV Files</label>
                    <form noValidate onSubmit={save} >
                        <InputFile title={'Decision Tree: '} setFileName={setFileName} setFileContent={setFileContent} error={error} />
                        <input type="submit" className="btn btn-primary submit" value="Save" />
                    </form>
                </div>

                <div className="setting-item">
                    <label htmlFor="changePassword">Change your password</label>
                    <ChangePassword token={token} userId={userId} />
                    <div>123</div>
                </div>

                {/* <div class="setting-item">
                <button class="save-button">Save Changes</button>
            </div> */}
            </div>

        </>
    )
}

export default GeneralSettingsPage