import { useRef, useState } from 'react';

function InputFile({ title, setFileContent, isBase64, setDataType }) {
    var input = useRef(null);
    const [error, setError] = useState('');

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
            <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)}
                style={{ width: '70%', margin: '0 auto' }} />
                
            {error &&

                <span className={'alert alert-danger w-50'} role="alert"
                    style={{ padding: '5px 10px', lineHeight: '1.2', fontSize: '14px' }}>
                    {error}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i className="bi bi-x-lg" style={{ cursor: 'pointer' }}
                        onClick={() => setError('')} />
                </span>}
                <br />
        </>
    );
}

export default InputFile;