import { useRef, useState } from 'react';

function InputFile({ title, setFileContent, isBase64, setDataType, fileUploadedSuccessfully, input }) {
    const [error, setError] = useState(null);

    function handleChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                setFileContent(fileContent);
                setDataType(file.type);
            };
            if (isBase64) {
                // if (file.type === 'image/png' || file.type === 'image/jpeg') {
                reader.readAsDataURL(file);
                // } else {
                //     setError('Invalid File Format for a Picture')
                //     return;
                // }
            } else {
                // if (file.type === 'text/csv') {
                reader.readAsText(file);
                // } else {
                //     setError('Please Upload a CSV File')
                //     return;
                // }
            }
            // input.current.value = '';
            setError('')
        } else {
            setError('No File was Selected!')
        }
    }

    return (
        <>
            <div className="justify-content-md-center" style={{ marginBottom: '10px' }}>
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
                    <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)} />
                </div>
            </div>
            {/* <br /> */}
        </>
    );
}

export default InputFile;