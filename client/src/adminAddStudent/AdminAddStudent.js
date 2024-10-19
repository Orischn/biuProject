import { useEffect, useRef, useState } from "react";
import StudentDetails from "../studentDetails/StudentDetails";


function AdminAddStudent({ token, studentList, setStudentList, refreshData }) {

    const [isSuccessful, setIsSuccessful] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const userIdBar = useRef(null);
    const firstNameBar = useRef(null);
    const lastNameBar = useRef(null);
    const yearBar = useRef(null);
    const emailBar = useRef(null);
    const [error, setError] = useState('');

    const generateRandomPassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+~";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    };

    const handleClick = () => {
        setShowModal(true)
        // if (!isCreated) {
        //     setShowModal(true);
        // } else {
        //     setSelectedTask(task);
        //     add();
        // }
    };

    const handleSubmit = (e) => {
        add(e);
        userIdBar.current.value = '';
        firstNameBar.current.value = '';
        lastNameBar.current.value = '';
        yearBar.current.value = '';
        emailBar.current.value = '';
        refreshData();
        setShowModal(false);
    };

    const handleCancel = () => {
        userIdBar.current.value = '';
        firstNameBar.current.value = '';
        lastNameBar.current.value = '';
        yearBar.current.value = '';
        emailBar.current.value = '';
        setShowModal(false);
        // setError('');

    };

    const add = async function (e) {
        e.preventDefault();
        setError('');
        const userId = userIdBar.current.value.trim();
        const firstName = firstNameBar.current.value.trim();
        const lastName = lastNameBar.current.value.trim();
        const year = yearBar.current.value.trim();
        const password = generateRandomPassword();
        const email = emailBar.current.value.trim();


        const res = await fetch('https://localhost:5000/api/createUser', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "user": {
                    "password": password,
                    "permissions": false,
                    "firstName": firstName,
                    "lastName": lastName,
                    "userId": userId,
                    "year": year,
                    "email": email
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
            // refreshData()
            setIsSuccessful(true);
            // setShowModal(false);

            // userIdBar.current.value = "";
            // firstNameBar.current.value = "";
            // lastNameBar.current.value = "";
            // yearBar.current.value = "";
            // emailBar.current.value = "";

            // setStudentList([...studentList, <StudentDetails token={token}
            //     fullName={firstName + ' ' + lastName}
            //     userId={userId} year={year} /> ])

            // setIsChanged(userId + firstName); //probably there is a better way to do so...

        }
    }

    return (
        <>


            {/* Button trigger modal */}
            <button type="button" className="btn" onClick={handleClick}>
                <i id="addStudent" className="bi bi-person-fill-add" style={{ color: "black" }} />
            </button>

            {/* Modal */}
            {showModal && (
                // check first line for backdrop
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">ADD STUDENT</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
                            </div>


                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input type="text" ref={userIdBar} className="form-control" placeholder="Student's id" />
                                    <input type="text" ref={firstNameBar} className="form-control" placeholder="Student's first name" />
                                    <input type="text" ref={lastNameBar} className="form-control" placeholder="Student's last name" />
                                    <input type="text" ref={yearBar} className="form-control" placeholder="year" />
                                    <input type="text" ref={emailBar} className="form-control" placeholder="Student's email address" />

                                </div>
                                <div className="modal-footer">
                                    {error &&
                                        <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                            {error}
                                        </span>}
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel} >Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Student</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}

export default AdminAddStudent;