import { useRef, useState } from 'react';

function InputFile({ title, setFileContent, isBase64, setDataType, input }) {
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
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
            setError('')
        } else {
            setError('No File was Selected!')
        }
    }

    return (
        <>
            <div className="justify-content-md-center" style={{ marginBottom: '10px' }}>
                <div className="">
                    <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)} />
                </div>
            </div>
        </>
    );
}

export default InputFile;