import { useEffect, useState } from "react"
import InputFile from "../inputFile/InputFile";


function SettingsPage({ token, closeModal }) {
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('')

    const save = async (e) => {
        const updateCSV = async () => {
            const res = await fetch(`http://localhost:5000/api/uploadDecisionTree/`, {
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
                res.text().then((errorText) => alert(errorText))
            } else if (res === 400) {
                res.text.then((errorText) => setError(errorText))
            }
        }
        e.preventDefault();
        updateCSV()
        closeModal();
    }

    return (
        <>
            <div
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Settings</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <form noValidate className="container-fluid modal-body" onSubmit={save} >
                            <InputFile title={'Decision Tree: '} setFileName={setFileName} setFileContent={setFileContent} error={error} />;
                            <input type="submit" className="btn btn-primary submit" value="Save" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage