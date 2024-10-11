import { useEffect, useRef, useState } from "react";


function AdminAddStudent({ token }) {

    const userIdBar = useRef(null);
    const firstNameBar = useRef(null);
    const lastNameBar = useRef(null);
    const yearBar = useRef(null);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);


    const add = async function (e) {
        e.preventDefault();
        setError('');
        const userId = userIdBar.current.value.trim();
        const firstName = firstNameBar.current.value.trim();
        const lastName = lastNameBar.current.value.trim();
        const year = yearBar.current.value.trim();

        // console.log(userId, firstName, lastName, password)

        const res = await fetch('http://localhost:5000/api/createUser', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "user": {
                    "password": 'need to be random',
                    "permissions": false,
                    "firstName": firstName,
                    "lastName": lastName,
                    "userId": userId,
                    "year": year
                }
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

            setError("Added Successfully");
            setIsSuccessful(true);

            userIdBar.current.value = "";
            firstNameBar.current.value = "";
            lastNameBar.current.value = "";
            yearBar.current.value = "";
        }
    }

    return (
        <>
            {/* Button trigger modal */}
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <i id="addStudent" className="bi bi-person-fill-add" />
            </button>
            {/* Modal */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">ADD STUDENT</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={add}>
                            <div className="modal-body">
                                <input type="text" ref={userIdBar} className="form-control" placeholder="Student's id" />
                                <input type="text" ref={firstNameBar} className="form-control" placeholder="Student's first name" />
                                <input type="text" ref={lastNameBar} className="form-control" placeholder="Student's last name" />
                                <input type="text" ref={yearBar} className="form-control" placeholder="year" />

                            </div>
                            <div className="modal-footer">
                                {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        {error}
                                    </span>}
                                <button type="button" onClick={() => {
                                    userIdBar.current.value = '';
                                    firstNameBar.current.value = '';
                                    lastNameBar.current.value = '';
                                    yearBar.current.value = '';
                                    setError('');
                                }}
                                    className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Add Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
}

export default AdminAddStudent;