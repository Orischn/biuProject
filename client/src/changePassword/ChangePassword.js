import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";


function ChangePassword({ userId }) {
    const navigate = useNavigate();
    const currentPassBar = useRef(null);
    const newPassBar = useRef(null);
    const newPassBarCon = useRef(null);

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true)
    }

    const handleCancel = () => {
        currentPassBar.current.value = '';
        newPassBar.current.value = '';
        newPassBarCon.current.value = '';
        setError('');
        setShowModal(false); // Close the modal on cancel
    };

    const change = async function (e) {

        e.preventDefault();
        const currentPassword = currentPassBar.current.value.trim();
        const newPassword = newPassBar.current.value.trim();
        const newPasswordConfirmation = newPassBarCon.current.value.trim(); //needs to be validated

        if (currentPassword === '' || newPassword === '' || newPasswordConfirmation === '') {
            setError('You must fill all fields');
            return;
        }
        if (newPasswordConfirmation !== newPassword) {
            setError('The passwords don\'t match')
            return;
        }

        const res = await api.post('/api/changePassword', {
            "userId": userId,
            "oldPassword": currentPassword,
            "newPassword": newPassword
        })

        if (res.status !== 200) { //error
            setError(res.data);
            setIsSuccessful(false);
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        } else {
            setError("Changed Successfully");
            setIsSuccessful(true);
            currentPassBar.current.value = "";
            newPassBar.current.value = "";
            newPassBarCon.current.value = "";
        }
    }

    return (

        <>
            <button type="button" className="btn" onClick={handleButtonClick}>
                <a href="#" className="tooltip-test" title="change password"><i id="openChangePassword" className="bi bi-shield-lock" style={{ color: 'white' }} /></a>
            </button>

            {showModal && (
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change your Password</h5>
                                <button type="button" className="btn-close btn-close-white"
                                    onClick={handleCancel} style={{ color: 'white' }}></button>
                            </div>
                            <form id="changePasswordForm" onSubmit={change}>
                                <div className="modal-body">
                                    <input type="password" ref={currentPassBar} className="form-control" placeholder="Current Password" />
                                    <input type="text" ref={newPassBar} className="form-control" placeholder="Press New Password" />
                                    <input type="text" ref={newPassBarCon} className="form-control" placeholder="Press New Password Again" />
                                </div>
                                <div className="modal-footer">
                                    {error &&
                                        <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                            <center>{error}</center>
                                        </span>}
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Close</button>
                                    <button type="submit" className="btn btn-primary">Save password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default ChangePassword;
