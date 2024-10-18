import { useEffect, useState } from "react";
import StudentDetails from "../studentDetails/StudentDetails"
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";
import SearchStudent from "../searchStudent/SearchStudent";

function StudentSettingsPage({ token, yearOption }) {

    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');
    const [isChanged, setIsChanged] = useState(false);

    const refreshData = () => {
        setIsChanged(!isChanged);
    }


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
                await res.text().then((students) => {
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
            
                    setStudentList(sortedStudents.map((user, key) => {
                        if (user.year === parseInt(yearOption.current.value)) {
                            return <StudentDetails key={key} token={token}
                                fullName={user.firstName + ' ' + user.lastName}
                                userId={user.userId} year={user.year} refreshData={refreshData} />
                        }
                        return null; // Ensure that the map function returns null if no match
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
                        setStudentList={setStudentList} refreshData={refreshData} />
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