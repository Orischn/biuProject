import { useState } from "react";


function DeleteAssignment({ token, taskName, year, refreshData }) {

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    }

    const handleCancel = () => {
        setError('');
        setShowModal(false);
    }

    const deleteTask = async function (e) {
        const res = await fetch('https://localhost:5000/api/deleteTask', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": taskName,
                "year": year
            })

        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                setError(errorMessage);
            })
            setIsSuccessful(false);
            return;
        }

        else {
            setIsSuccessful(true);
            refreshData();
            setShowModal(false);
        }
    }

    return (
        <>
            {/* Button trigger modal */}
            {/* <button type="button" className="btn"  */}
                <i id="deleteAssignmentIcon" className="bi bi-trash" 
                style={{ color: 'black', cursor: 'pointer' }} onClick={handleClick}></i>

            {/* </button> */}

            {/* Modal */}
            {showModal && (
                // check first line for backdrop
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">DELETE ASSIGNMENT</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete the task named: <b>{taskName}</b> from your course?
                                <br />
                                <b>This action is irreversible!</b>
                            </div>
                            <div className="modal-footer">
                                {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        {error}
                                    </span>}
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>No, cancel</button>
                                <button type="button" className="btn btn-danger"
                                    onClick={() => deleteTask()}>Yes, delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



export default DeleteAssignment;