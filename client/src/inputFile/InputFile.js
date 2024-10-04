import { useRef } from 'react';

function InputFile({ title, setFileName, setFileContent, error }) {
    var input = useRef('');

    function handleChange(e) {
        const file = e.target.files[0];
        if (file && file.type === "text/csv") {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              setFileContent(fileContent);
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    }

    return (
        <>
            <div className="row row-cols-2 justify-content-md-center">
                <div className="col-2 text-white">
                    {title}
                </div>
                <div className="col-4">
                    <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)} required />
                </div>
                <div className='col-4 mt-1'>
                    {error &&
                        <span className="alert alert-danger w-50" role="alert">
                            {error}
                        </span>}
                </div>
            </div>
            <br />
        </>
    );
}

export default InputFile;