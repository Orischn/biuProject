import { useRef, useState } from "react";


function ChangePassword({ token, userId }) {

    const currentPassBar = useRef(null);
    const newPassBar = useRef(null);
    const newPassBarCon = useRef(null);

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const change = async function (e) {

        e.preventDefault();
        setError('');
        const currentPassword = currentPassBar.current.value.trim();
        const newPassword = newPassBar.current.value.trim();
        const newPasswordConfirmation = newPassBarCon.current.value.trim(); //needs to be validated

        if (newPasswordConfirmation !== newPassword) {
            alert('The passwords aren\'t matching')
            return;
        }

        const res = await fetch('http://localhost:5000/api/changePassword', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": userId,
                "oldPassword": currentPassword,
                "newPassword": newPassword
            })
        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                alert(errorMessage);
            })
            setIsSuccessful(false);
            return;
        }

        else {

            setError("Changed Successfully");
            setIsSuccessful(true);

            currentPassBar.current.value = "";
            newPassBar.current.value = "";
            newPassBarCon.current.value = "";
        }
    }

    return (
        <>
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#changePassModal">
            <a href="#" class="tooltip-test" title="change password"><i id="openChangePassword" className="bi bi-shield-lock" style={{color: 'white'}}/></a>
            </button>
{/* change password */}

            {/* Confirmation Modal */}
            <div className="modal fade" id="changePassModal" tabIndex="-1" aria-labelledby="changePassModalLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-white">
                            <h5 className="modal-title" id="changePassModalLabel">Change your Password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={() => {
                                    currentPassBar.current.value = '';
                                    newPassBar.current.value = '';
                                    newPassBarCon.current.value = '';
                                    setError('');
                                }}></button>
                        </div>
                        {/* ----------------------------------------------------------------- */}


                        <form onSubmit={change}>
                            <div className="modal-body">
                                <input type="password" ref={currentPassBar} className="form-control" placeholder="Current Password" />
                                <input type="text" ref={newPassBar} className="form-control" placeholder="Press New Password" />
                                <input type="text" ref={newPassBarCon} className="form-control" placeholder="Press New Password Again" />

                            </div>
                            <div className="modal-footer">
                                {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        {error}
                                    </span>}
                                <button type="button" onClick={() => {
                                    currentPassBar.current.value = '';
                                    newPassBar.current.value = '';
                                    newPassBarCon.current.value = '';
                                    setError('');
                                }}
                                    className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save new Password</button>
                            </div>
                        </form>



                        {/* ------------------------------------------------------------------- */}
                        {/* <div className="modal-body">
                            bla bla bla
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => change()}>
                                Save new Password
                            </button>
                        </div> */}
                    </div>
                </div>
            </div >
        </>
    );

}

export default ChangePassword;