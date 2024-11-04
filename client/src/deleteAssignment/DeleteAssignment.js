import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";


function DeleteAssignment({ taskName, year, refreshData }) {
    const navigate = useNavigate();
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
        const res = await api.post('/api/deleteTask', {
            "taskName": taskName,
            "year": year
        })

        if (res.status !== 200) { //error
            setError(res.data);
            setIsSuccessful(false);
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        } else {
            setIsSuccessful(true);
            refreshData();
            setShowModal(false);
        }
    }

    return (
        <>
            <i id="deleteAssignmentIcon" className="bi bi-trash"
                style={{ color: 'black', cursor: 'pointer' }} onClick={handleClick}>
            </i>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">DELETE ASSIGNMENT</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete the task named: <b>{taskName}</b> from your course?
                                <br />
                                <b>This action is irreversible!</b>
                            </div>
                            <div className="modal-footer">
                                {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        <center>{error}</center>
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