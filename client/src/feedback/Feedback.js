import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";

function Feedback({ chatId, feedback, selectedStudent, refreshData, year }) {
    const navigate = useNavigate();
    const feedbackBar = useRef(null);
    const [showModal, setShowModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);


    const createFeedback = async function (e) {
        e.preventDefault();
        const feedback = feedbackBar.current.value.trim();
        const res = await api.post('/api/createFeedback', {
            "userId": selectedStudent.userId,
            "chatId": chatId,
            "feedback": feedback,
            "year": year
        })

        if (res.status !== 200) { //error
            alert(res.data);
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        } else {
            setShowConfirmationModal(true);
            refreshData()
        }
    }

    const handleButtonClick = () => {
        setShowModal(true)
    }

    const handleCancel = () => {
        setShowModal(false); // Close the modal on cancel
    };

    const handleConfirm = () => {
        setShowConfirmationModal(false);
        setShowModal(false)
    }

    return (

        <>
            <button type="button" className="btn btn-primary" onClick={handleButtonClick}>
                feedback
            </button>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-white">
                                <h5 className="modal-title">Give Feedback</h5>
                                <button type="button" className="btn-close btn-close-white"
                                    onClick={handleCancel}></button>
                            </div>
                            <form onSubmit={createFeedback}>
                                <div className="modal-body">
                                    <textarea
                                        ref={feedbackBar}
                                        placeholder="Enter feedback"
                                        className="form-control feedback-textarea"
                                        rows={3} // adjust this for height
                                    />
                                    {feedback ?
                                        <><b><u>Feedback Given:</u></b> <br /> </> : <></>}
                                    {feedback.replace(/^"|"$/g, '').split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={handleCancel}
                                        className="btn btn-secondary">Close</button>
                                    <button type="submit" className="btn btn-primary" >Send Feedback</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmationModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header"></div>
                            <div className="modal-body">
                                <b>Feedback successfully sent to student</b>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={handleConfirm}
                                    className="btn btn-primary">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Feedback;