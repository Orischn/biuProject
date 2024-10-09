import { useEffect, useState } from "react";
import Student from "../student/Student";
import StudentStats from "../studentStats/StudentStats";
import ChatsHistory from "../chatsHistory/ChatsHistory";
import SettingsPage from "../settingsPage/SettingsPage";
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";



function AdminFeed({ token, userId }) {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [fullName, setFullName] = useState("");
    // const [showModal, setShowModal] = useState(false);
    // const handleShowModal = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch('http://localhost:5000/api/getStudents', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((students) => {
                    setStudentList(JSON.parse(students).map((student, key) => {
                        return <Student student={student} key={key}
                            selectedStudent={selectedStudent}
                            setSelectedStudent={setSelectedStudent} />
                    }));
                });
            }
        }
        const fetchName = async () => {
            const res = await fetch(`http://localhost:5000/api/getStudent/${userId}`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((user) => {
                    setFullName(JSON.parse(user).firstName + " " + JSON.parse(user).lastName);
                });
            }
        }

        fetchName()
        fetchStudents();
    }, [selectedStudent, token, userId])

    return (
        <>
            <div id="window" className="container">
                {/* {showModal && <SettingsPage token={token} closeModal={handleCloseModal} />} */}
                <SettingsPage token={token} />
                <div className="row">
                    <div id="adminFeed" className="col-3">
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100 text-black-50">{fullName}</b>
                            {/* <button onClick={handleShowModal} 
                            style={{ border: 'none', backgroundColor: '#e6e6e6'}}>
                            <i id="openSettings" className="bi bi-gear"></i>
                            </button> */}

                            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#settingsModal">
                                <i id="openSettings" className="bi bi-gear" />
                            </button>

                        </div>
                        <div className="d-flex align-items-center">
                            <br />
                        </div>
                        {studentList}
                    </div>
                    <div id="gradesChatBlock" className="col-9">
                        {selectedStudent ?
                            <>
                                <StudentStats token={token} selectedStudent={selectedStudent} />
                            </> :
                            <>
                                {/* PlaceHolder. */}
                                <AdminAddStudent token={token} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>

    );
}

export default AdminFeed;