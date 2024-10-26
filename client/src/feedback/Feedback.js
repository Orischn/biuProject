import React, { useRef, useState } from "react";


function Feedback({ token, chatId, feedback, selectedStudent, refreshData, year }) {

    const feedbackBar = useRef(null);
    const [showModal, setShowModal] = useState(false)

    
    const createFeedback = async function (e) {
        e.preventDefault();
        const feedback = feedbackBar.current.value.trim();
        const res = await fetch('https://localhost:5000/api/createFeedback', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": selectedStudent.userId,
                "chatId": chatId,
                "feedback": feedback,
                "year": year
            })
        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                alert(errorMessage);
            })
            return;
        } else {
            alert('feedback sent to student')
            setShowModal(false)
            refreshData()
        }
    }

    const handleButtonClick = () => {
        setShowModal(true)
    }

    const handleCancel = () => {
        // feedbackBar.current.value = '';
        // setError('');
        setShowModal(false); // Close the modal on cancel
    };

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
                                <button type="button" className="btn-close"
                                    onClick={handleCancel}></button>
                            </div>
                            <form onSubmit={createFeedback}>
                                <div className="modal-body">
                                    <textarea
                                        ref={feedbackBar}
                                        placeholder="Enter feedback"
                                        className="form-control feedback-textarea"
                                        rows={3} // You can adjust this for height
                                    />
                                    {feedback ? 
                                    <><b><u>Feedback Given:</u></b> <br /> </>: <></>}
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

        </>
    )
}

export default Feedback;