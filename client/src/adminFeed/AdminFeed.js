import { useEffect, useRef, useState } from "react";
import ChangePassword from "../changePassword/ChangePassword";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import SearchStudent from "../searchStudent/SearchStudent";
import SettingsPage from "../settingsPage/SettingsPage";
import Student from "../student/Student";
import StudentStats from "../studentStats/StudentStats";



function AdminFeed({ token, userId }) {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [fullName, setFullName] = useState("");
    const [isYearChanged, setIsYearChanged] = useState(null);
    const [isAddedOrDeleted, setIsAddedOrDeleted] = useState(false)
    const [filter, setFilter] = useState('');
    
    const yearOption = useRef(null);
    
    const refreshDataInFeed = () => {
        setIsAddedOrDeleted(!isAddedOrDeleted);
    }
    
    // const [showModal, setShowModal] = useState(false);
    // const handleShowModal = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);
    
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
            }
            
        }
        const fetchName = async () => {
            const res = await api.get(`/api/getStudent/${userId}`);
            if (res.status === 200) {
                const user = res.data;
                setFullName(user.firstName + " " + user.lastName);
            }
        }
        
        fetchName()
        fetchStudents();
    }, [selectedStudent, token, userId, isYearChanged, filter, isAddedOrDeleted])
    
    return (
        <>
        <div id="window" className="container">
        {/* {showModal && <SettingsPage token={token} closeModal={handleCloseModal} />} */}
        <SettingsPage token={token} userId={userId} yearOption={yearOption} 
        refreshDataInFeed={refreshDataInFeed}
        isYearChanged={isYearChanged}/>
        <div className="row">
        <div id="adminFeed" className="col-3" style={{ height: '100%', overflowY: 'auto' }}>
        <div id="me" className="d-flex align-items-center w-100">
        <b className="ms-2 w-100">{fullName}</b>
        {/* <button onClick={handleShowModal} 
            style={{ border: 'none', backgroundColor: '#e6e6e6'}}>
            <i id="openSettings" className="bi bi-gear"></i>
            </button> */}
            <select id="year" ref={yearOption} onChange={(e) => {
                setIsYearChanged(e.target.value);
                setSelectedStudent(null);
            }}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            </select>
            <ChangePassword token={token} user={userId} />
            
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
                <StudentStats token={token} selectedStudent={selectedStudent}
                isAddedOrDeleted={isAddedOrDeleted} yearOption={yearOption}
                isYearChanged={isYearChanged}/>
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