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




            {/* <div className="row row-cols-2 justify-content-md-center">
                <div className="col-2 text-white">
                    {title}
                </div>
                <div className="col-4">
                    <input ref={input} type="text" className="form-control input" placeholder={placeholder} id={title} onChange={(e) => handleChange(e)} required />
                </div>
                <div className='col-4 mt-1'>
                    {error &&
                        <span className="alert alert-danger w-50" role="alert">
                            {error}
                        </span>}
                </div>
            </div>
            <br /> */}
        </>
    );
}

export default InputText;