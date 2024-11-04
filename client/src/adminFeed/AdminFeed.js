import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ChangePassword from "../changePassword/ChangePassword";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import SearchStudent from "../searchStudent/SearchStudent";
import SettingsPage from "../settingsPage/SettingsPage";
import Student from "../student/Student";
import StudentStats from "../studentStats/StudentStats";



function AdminFeed({ token, userId }) {
    const navigate = useNavigate();
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [fullName, setFullName] = useState("");
    const [isYearChanged, setIsYearChanged] = useState(null);
    const [isAddedOrDeleted, setIsAddedOrDeleted] = useState(false)
    const [filter, setFilter] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const yearOption = useRef(null);

    const refreshDataInFeed = () => {
        setIsAddedOrDeleted(!isAddedOrDeleted);
    }

    useEffect(() => {
        const fetchStudents = async () => {

            const year = parseInt(yearOption.current.value);
            // const year = 2024;

            const res = await api.get('/api/getStudents');

            if (res.status === 200) {
                const filteredStudents = res.data.filter((student) => {
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
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }
        const fetchName = async () => {
            const res = await api.get(`/api/getStudent/${userId}`);
            if (res.status === 200) {
                const user = res.data;
                setFullName(user.firstName + " " + user.lastName);
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }

        fetchName()
        fetchStudents();
    }, [selectedStudent, token, userId, isYearChanged, filter, isAddedOrDeleted])

    const logout = () => {
        api.post('/api/logout/');
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        navigate('/')
        setShowLogoutModal(false)
    }

    const handleCancel = () => {
        setShowLogoutModal(false);
    }

    return (
        <>
            <div id="window" className="container">
                <SettingsPage token={token} yearOption={yearOption}
                    refreshDataInFeed={refreshDataInFeed}
                    isYearChanged={isYearChanged} />
                <div className="row">
                    <div id="adminFeed" className="col-3" style={{ height: '100%', overflowY: 'auto' }}>
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100">{fullName}</b>

                            <select id="year" ref={yearOption} onChange={(e) => {
                                setIsYearChanged(e.target.value);
                                setSelectedStudent(null);
                            }}>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                            <ChangePassword user={userId} />

                            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#settingsModal">
                                <i id="openSettings" className="bi bi-gear" />
                            </button>
                            <a href="#" className="tooltip-test" title="logout">
                                <i className="bi bi-box-arrow-left" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>

                        </div>
                        <div className="d-flex align-items-center">
                            <br />
                        </div>

                        <SearchStudent filter={filter} setFilter={setFilter} />
                        {studentList}
                    </div>
                    <div id="gradesChatBlock" className="col-9" style={{ height: '100%', overflowY: "auto" }}>
                        {selectedStudent ?
                            <>
                                <StudentStats token={token} selectedStudent={selectedStudent}
                                    isAddedOrDeleted={isAddedOrDeleted} yearOption={yearOption}
                                    isYearChanged={isYearChanged} />
                            </> :
                            <>
                            </>
                        }
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showLogoutModal && (
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">LOGOUT</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to logout from the system?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>No, stay</button>
                                <button type="button" className="btn btn-danger"
                                    onClick={logout}>Yes, logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}

export default AdminFeed;