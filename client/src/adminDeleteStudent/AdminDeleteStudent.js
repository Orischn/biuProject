import { useEffect, useRef, useState } from "react";


function AdminDeleteStudent({ token, userId, fullName }) {

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    console.log(fullName)


    const deleteStudent = async function (e) {

        const res = await fetch('http://localhost:5000/api/deleteUser', {
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
            setError("Deleted Successfully");
            setIsSuccessful(true);
        }
    }

    return (
        <>
            {/* Button trigger modal */}
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target={`#deleteStudentModal-${userId}`}>
            <i id="deleteStudentIcon" className="bi bi-person-x"></i>
            </button>
            {/* Modal */}
            <div className="modal fade" id={`deleteStudentModal-${userId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">ADD STUDENT</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            onClick={() => setError('')}></button>
                        </div>
                        <div className="modal-body">
                            ARE YOU SURE YOU WANT TO DELETE {fullName} FROM YOUR COURSE?
                        </div>


                        <div className="modal-footer">
                            {error &&
                                <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                    {error}
                                </span>}
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                            onClick={() => setError('')}>No, cancel</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => deleteStudent()}>Yes, delete {fullName}</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default AdminDeleteStudent;