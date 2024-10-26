import { useRef } from 'react';

function InputFile({ title, setFileContent, isBase64 }) {
    var input = useRef('');

    function handleChange(e) {
        const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              setFileContent(fileContent);
            };
            if (isBase64) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
            input.current.valueOf('')
    }

    return (
        <>
            <input ref={input} type="file" className="form-control input" id={title} onChange={(e) => handleChange(e)} required />
        </>
    );
}

export default InputFile;