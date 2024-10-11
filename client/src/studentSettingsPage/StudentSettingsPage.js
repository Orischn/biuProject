import { useEffect, useState } from "react";
import StudentDetails from "../studentDetails/StudentDetails"
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";
import SearchStudent from "../searchStudent/SearchStudent";

function StudentSettingsPage({ token, isChanged, setIsChanged }) {

    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchStudents = async (filter) => {
            const res = await fetch('http://localhost:5000/api/getStudents', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((students) => {
                    setStudentList(JSON.parse(students).filter((student) => {
                        if (filter !== '') {
                            return (student.firstName + ' ' + student.lastName).toLowerCase().
                                includes(filter.toLowerCase()) ||
                                student.userId.includes(filter);
                        }
                        return true;
                    }).map((user, key) => {
                        return <StudentDetails key={key} token={token}
                            fullName={user.firstName + ' ' + user.lastName}
                            userId={user.userId} year={user.year} setIsChanged={setIsChanged} />
                    }));
                });
            }
        }
        fetchStudents(filter);
    }, [token, filter, isChanged])

    return (
        <>
            <h2 className="settings-title">Manage Students</h2>
            <div className="settings-container">

                <ul className="setting-item">
                    <SearchStudent filter={filter} setFilter={setFilter} />
                    Add Student
                    <AdminAddStudent token={token} studentList={studentList}
                        setStudentList={setStudentList} setIsChanged={setIsChanged} />
                </ul>
                {studentList.length > 0 ? (
                     studentList 
                ) : (
                    <>
                        no student matching was found, try searching again
                    </>
                )}


            </div>
        </>
    )
}

export default StudentSettingsPage