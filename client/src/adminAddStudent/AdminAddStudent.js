import { useRef, useState } from "react";


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

    // const handleSubmit = async (e) => {
    //     await add(e);
    // };

    const handleCancel = () => {
        userIdBar.current.value = '';
        firstNameBar.current.value = '';
        lastNameBar.current.value = '';
        yearBar.current.value = '';
        emailBar.current.value = '';
        setShowModal(false);
        setError('');

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

        if (userId === '' || firstName === '' || lastName === '' ||
            year === '' || email === '') {
            setError('Must fill all fields!');
            setIsSuccessful(false);
            return;
        }


        const userIdRegex = new RegExp('^[0-9]+$')
        if (!userIdRegex.test(userId)) {
            setError('User ID must be digits only!');
            setIsSuccessful(false);
            return;
        }

        const nameRegex = new RegExp('^[a-zA-Z]+$')
        if (!nameRegex.test(firstName)) {
            setError('First name invalid!');
            setIsSuccessful(false);
            return;
        }

        if (!nameRegex.test(lastName)) {
            setError('Last name invalid!');
            setIsSuccessful(false);
            return;
        }

        const yearRegex = new RegExp('^[0-9]+$')
        if (!yearRegex.test(year)) {
            setError('Year must be a number!');
            setIsSuccessful(false);
            return;
        }

        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        if(!emailRegex.test(email)) {
            setError('Invalid email address');
            setIsSuccessful(false);
            return;
        }



        const res = await fetch('http://localhost:5000/api/createUser', {
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
                    "email": email,
                    "isSelfRegistered": false
                }
            })

        })

        if (res.status !== 201) { //error
            await res.text().then((errorMessage) => {
                setError(errorMessage);
            })
            setIsSuccessful(false);
            return;
        }

        else {
            setError("Added Successfully");
            setIsSuccessful(true);
            refreshData()
            userIdBar.current.value = '';
            firstNameBar.current.value = '';
            lastNameBar.current.value = '';
            yearBar.current.value = '';
            emailBar.current.value = '';
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
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                            </div>


                            <form onSubmit={add}>
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
                                            <center>{error}</center>
                                        </span>}
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Close</button>
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