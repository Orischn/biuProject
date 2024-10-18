import { useEffect, useRef, useState } from "react";
import Student from "../student/Student";
import StudentStats from "../studentStats/StudentStats";
import ChatsHistory from "../chatsHistory/ChatsHistory";
import SettingsPage from "../settingsPage/SettingsPage";
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";
import StudentSettingsPage from "../studentSettingsPage/StudentSettingsPage";
import AssignmentsSettingsPage from "../assignmentsSettingsPage/AssignmentsSettingsPage";
import SearchStudent from "../searchStudent/SearchStudent";



function AdminFeed({ token, userId }) {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [fullName, setFullName] = useState("");
    const [isChanged, setIsChanged] = useState(null);
    const [filter, setFilter] = useState('');

    const yearOption = useRef(null);

    // const [showModal, setShowModal] = useState(false);
    // const handleShowModal = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchStudents = async () => {

            const year = parseInt(yearOption.current.value);
            // const year = 2024;

            const res = await fetch('http://localhost:5000/api/getStudents', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                res.text().then((students) => {
                    const filteredStudents = JSON.parse(students)
                        .filter((student) => {
                            if (filter !== '') {
                                return (student.firstName + ' ' + student.lastName).toLowerCase()
                                    .includes(filter.toLowerCase()) ||
                                    student.userId.includes(filter);
                            }
                            return true;
                        });

                    const sortedStudents = filteredStudents
                        .sort((a, b) => {
                            const firstNameComparison = a.firstName.localeCompare(b.firstName);
                            if (firstNameComparison !== 0) {
                                return firstNameComparison;  // Sort by first name if different
                            }
                            return a.lastName.localeCompare(b.lastName);  // Sort by last name if first names are the same
                        });

                    setStudentList(sortedStudents.map((student, key) => {
                        if (student.year === parseInt(yearOption.current.value)) {
                            return <Student student={student} key={key}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent} />
                        }
                        return null; // Ensure that the map function returns null if no match
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
    }, [selectedStudent, token, userId, isChanged, filter])

    return (
        <>
            <div id="window" className="container">
                {/* {showModal && <SettingsPage token={token} closeModal={handleCloseModal} />} */}
                <SettingsPage token={token} userId={userId} yearOption={yearOption} />
                <div className="row">
                    <div id="adminFeed" className="col-3">
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100">{fullName}</b>
                            {/* <button onClick={handleShowModal} 
                            style={{ border: 'none', backgroundColor: '#e6e6e6'}}>
                            <i id="openSettings" className="bi bi-gear"></i>
                            </button> */}
                            <select id="year" ref={yearOption} onChange={(e) => setIsChanged(e.target.value)}>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>

                            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#settingsModal">
                                <i id="openSettings" className="bi bi-gear" />
                            </button>

                        </div>
                        <div className="d-flex align-items-center">
                            <br />
                        </div>
                        
                            <SearchStudent filter={filter} setFilter={setFilter} />
                        {studentList}
                    </div>
                    <div id="gradesChatBlock" className="col-9">
                        {selectedStudent ?
                            <>
                                <StudentStats token={token} selectedStudent={selectedStudent} />
                            </> :
                            <>
                                {/* <StudentSettingsPage token={token} isChanged={isChanged} setIsChanged={setIsChanged} yearOption={yearOption}/> */}
                                {/* <AssignmentsSettingsPage token={token} yearOption={yearOption}/> */}
                            </>
                        }
                    </div>
                </div>
            </div>
        </>

    );
}

export default AdminFeed;