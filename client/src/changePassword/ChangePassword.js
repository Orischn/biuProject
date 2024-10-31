import { useRef, useState } from "react";


function ChangePassword({ token, userId }) {

    const currentPassBar = useRef(null);
    const newPassBar = useRef(null);
    const newPassBarCon = useRef(null);

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true)
    }

    // const handleConfirm = () => {

    //     setShowModal(false); // Close the modal
    // };

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
                setError(errorMessage)
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
                                    onClick={handleCancel} style={{color: 'white'}}></button>
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

// import React, { useState, useRef } from 'react';

// const ChangePasswordModal = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [error, setError] = useState(null);
//     const [isSuccessful, setIsSuccessful] = useState(false);
//     const currentPassBar = useRef();
//     const newPassBar = useRef();
//     const newPassBarCon = useRef();

//     const handleButtonClick = () => {
//         setShowModal(true);
//     };

//     const handleCancel = () => {
//         setShowModal(false);
//     };

//     const handleOverlayClick = (e) => {
//         // Check if the click was outside the modal content
//         if (e.target.classList.contains('modal-overlay')) {
//             alert('Please close the modal before proceeding.');
//         }
//     };

//     const change = (e) => {
//         e.preventDefault();
//         // Add your change password logic here
//     };

//     return (
//         <>
//             <button type="button" className="btn" onClick={handleButtonClick}>
//                 <a href="#" className="tooltip-test" title="change password">
//                     <i id="openChangePassword" className="bi bi-shield-lock" style={{ color: 'white' }} />
//                 </a>
//             </button>

//             {showModal && (
//                 <div className="modal-overlay" onClick={handleOverlayClick}>
//                     <div className="modal show d-block" tabIndex="-1" role="dialog">
//                         <div className="modal-dialog modal-dialog-centered" role="document">
//                             <div className="modal-content">
//                                 <div className="modal-header text-white">
//                                     <h5 className="modal-title">Change your Password</h5>
//                                     <button type="button" className="btn-close" onClick={handleCancel}></button>
//                                 </div>
//                                 <form onSubmit={change}>
//                                     <div className="modal-body">
//                                         <input type="password" ref={currentPassBar} className="form-control" placeholder="Current Password" />
//                                         <input type="text" ref={newPassBar} className="form-control" placeholder="New Password" />
//                                         <input type="text" ref={newPassBarCon} className="form-control" placeholder="Confirm New Password" />
//                                     </div>
//                                     <div className="modal-footer">
//                                         {error && (
//                                             <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
//                                                 {error}
//                                             </span>
//                                         )}
//                                         <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
//                                         <button type="submit" className="btn btn-primary">Save new Password</button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ChangePasswordModal;
