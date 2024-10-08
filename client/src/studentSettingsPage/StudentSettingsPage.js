import { useEffect, useState } from "react";
import StudentDetails from "../studentDetails/StudentDetails"

function StudentSettingsPage({ token }) {

    const [studentList, setStudentList] = useState([]);

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
                        return <StudentDetails key={key}
                            fullName={student.firstName + ' ' + student.lastName}
                            userId={student.userId} />
                    }));
                });
            }
        }

        fetchStudents();
    }, [token])

    return (
        <>
            <h2 className="settings-title">Manage Students</h2>
            <div className="settings-container">

                <ul className="setting-item">
                    <span id="searchBar" className="input-group m-2" >
                        <input className="form-control inputText"
                            placeholder="Search student by id or name" />
                    </span>
                       <button> <i className="bi bi-person-add md"></i></button>
                </ul>

                {studentList}

            </div>
        </>
    )
}

export default StudentSettingsPage