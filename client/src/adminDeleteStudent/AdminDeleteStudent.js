import { useState } from "react";


function AdminDeleteStudent({ token, userId, fullName, refreshData }) {

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


    const deleteStudent = async function (e) {

        const res = await fetch('https://localhost:5000/api/deleteUser', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": userId
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
            // setError("Deleted Successfully");
            setIsSuccessful(true);
            // setIsChanged(userId);
            refreshData();
            setShowModal(false);
        }
    }

    return (
        <>
            {/* Button trigger modal */}
            <button type="button" className="btn" onClick={handleClick}>
                <i id="deleteStudentIcon" className="bi bi-person-x" style={{ color: 'black' }}></i>

            </button>

            {/* Modal */}
            {showModal && (
                // check first line for backdrop
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">DELETE STUDENT</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete {fullName} from your course?
                                <br />
                                <b>This action is irreversible!</b>
                            </div>
                            <div className="modal-footer">
                                {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        <center>{error}</center>
                                    </span>}
                                <button type="button" className="btn btn-secondary"onClick={handleCancel}>No, cancel</button>
                                <button type="button" className="btn btn-danger"
                                    onClick={() => deleteStudent()}>Yes, delete {fullName}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminDeleteStudent;