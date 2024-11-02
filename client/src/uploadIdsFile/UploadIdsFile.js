import { useRef, useState } from "react";
import api from "../handleTokenRefresh/HandleTokenRefresh";

function UploadIdFile({ token, title }) {
    
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('');
    const [fileUploadedSuccessfully, setFileUploadedSuccessfully] = useState(false)
    const input = useRef(null);
    
    const save = async (e) => {
        e.preventDefault();
        
        if (!fileContent) {
            setError('No file selected');
            setFileUploadedSuccessfully(false);
            return;
        }
        const uploadIds = async () => {
            const res = await api.post(`/api/uploadValidIdFile/`, {
                'fileName': 'validIds.txt',
                "fileContent": fileContent,
            })
            if (res.status !== 200) {
                setError(res.data);
                setFileUploadedSuccessfully(false);
            } else {
                setError('Uploaded Successfully');
                setFileUploadedSuccessfully(true);
                input.current.value = '';
            }
            
        }
        uploadIds()
    }
    
    function handleChange(e) {
        const file = e.target.files[0];
        if (file) {  // Check if a file was selected
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                setFileContent(fileContent);
            };
            reader.readAsText(file);
            
            
        } else {
            setError('No file selected')
            setFileUploadedSuccessfully(false);
        }
    }
    
    return (
        <>
        <div style={{ width: '100%' }}>
        <label>Upload valid id's numbers</label>
        <form noValidate onSubmit={save} >
        {/* &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; */}
        
        <div className="justify-content-md-center" style={{ marginBottom: '10px' }}>
        
        <div className="">
        <input ref={input} type="file" className="form-control input" id={title} onChange={handleChange} required />
        </div>
        <div>
        {error &&
            
            <span className={`alert ${fileUploadedSuccessfully ? "alert-success" : "alert-danger"} w-50`} role="alert"
            style={{ padding: '5px 10px', lineHeight: '1.2', fontSize: '14px' }}>
            {error}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <i className="bi bi-x-lg" style={{ cursor: 'pointer' }}
            onClick={() => setError('')} />
            </span>}
            
            </div>
            </div>
            
            <input type="submit" className="btn btn-primary submit" value="Upload" />
            </form>
            {/* &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; */}
            </div>
            </>
        );
    }
    
    export default UploadIdFile;