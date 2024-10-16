import { useRef } from 'react';

function InputText({ title, iconTitle, iconName, placeholder, setValue, error }) {
    var input = useRef('');

    function handleChange(e) {
        setValue(e.target.value)
    }
    return (
        <>
            <div class="input-field">
                <input ref={input} type="text" className="form-control input" placeholder={placeholder} id={title} onChange={(e) => handleChange(e)} required />
                <i id={iconTitle} className={iconName} />
            </div>
            <div>
                {error &&
                    <span className="alert alert-danger w-50" role="alert">
                        {error}
                    </span>}
            </div>
        </>
    );
}

export default InputText;