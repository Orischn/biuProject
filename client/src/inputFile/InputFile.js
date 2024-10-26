import { useRef } from 'react';

function InputFile({ title, setFileName, setFileContent, error, fileUploadedSuccessfully }) {
    const input = useRef(null);

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
            // input.current.value = '';
        }
        // if (file && file.type === "text/csv") {
        // setFileName(file.name);
        // const reader = new FileReader();
        // reader.onload = () => {
        //   const fileContent = reader.result;
        //   setFileContent(fileContent);
        // };
        // reader.readAsText(file);
        // input.current.valueOf('')
        // } else {
        //     alert("Please upload a valid CSV file.");
        // }
    }

    return (
        <>
            <div className="justify-content-md-center" style={{ marginBottom: '10px' }}>
                {/* <div className="col-2 text-black">
                    {title}
                </div> */}

                {/* <div className='mt-1'>
                    {error &&
                        <span className="alert alert-danger" role="alert">
                            {error}
                        </span>}
                </div> */}
                
                <div className="">
                    <input ref={input} type="file" className="form-control input" id={title} onChange={handleChange} required />
                </div>
                <div>
                    {error &&
                    
                        <span className={`alert ${fileUploadedSuccessfully ? "alert-success" : "alert-danger"} w-50`} role="alert"
                            style={{ padding: '5px 10px', lineHeight: '1.2', fontSize: '14px' }}>
                            {error}
                        </span>}
                </div>
            </div>
            {/* <br /> */}
        </>
    );
}

export default InputFile;