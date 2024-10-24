import { useRef } from 'react';

function InputFile({ title, setFileName, setFileContent, error }) {
    var input = useRef('');

    function handleChange(e) {
        const file = e.target.files[0];
        // if (file && file.type === "text/csv") {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              setFileContent(fileContent);
            };
            reader.readAsText(file);
            input.current.valueOf('')
        // } else {
        //     alert("Please upload a valid CSV file.");
        // }
    }

    return (
        <>
            <div className="justify-content-md-center" style={{marginBottom: '10px'}}>
                {/* <div className="col-2 text-black">
                    {title}
                </div> */}
                
                {/* <div className='mt-1'>
                    {error &&
                        <span className="alert alert-danger w-50" role="alert">
                            {error}
                        </span>}
                </div> */}
                <div className="">
                    <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)} required />
                </div>
            </div>
            {/* <br /> */}
        </>
    );
}

export default InputFile;