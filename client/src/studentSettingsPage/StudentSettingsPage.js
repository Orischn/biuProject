import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import SearchStudent from "../searchStudent/SearchStudent";
import StudentDetails from "../studentDetails/StudentDetails";
import StudentStatus from "../studentStatus/StudentStatus";
import UploadIdFile from "../uploadIdsFile/UploadIdsFile";

function StudentSettingsPage({ token, yearOption, refreshDataInFeed, expand, setExpand, isYearChanged }) {
    const navigate = useNavigate();
    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');

    const handleUnexpand = () => {
        setExpand(false)
        setSelectedStudent('');
    }

    const refreshData = () => {
        setIsChanged(!isChanged);
        refreshDataInFeed()
    }

    useEffect(() => {
        const fetchStudents = async (filter) => {
            const res = await api.get('/api/getStudents');

            if (res.status === 200) {
                const filteredStudents = res.data
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
                        return <StudentDetails key={key}
                            user={user} setSelectedStudent={setSelectedStudent}
                            refreshData={refreshData} setExpand={setExpand} />
                    }
                    return null; // Ensure that the map function returns null if no match
                }));
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }
        fetchStudents(filter);
    }, [token, filter, isChanged, isYearChanged])

    return (
        <>
            <h2 className="settings-title">Manage Students</h2>
            <div className="settings-container">
                {!expand ? (
                    <>
                        <ul className="setting-item">
                            <SearchStudent filter={filter} setFilter={setFilter} />
                            <UploadIdFile token={token} title={'Valid ID\'s numbers'} />
                            &emsp;&emsp;&emsp;
                            <AdminAddStudent refreshData={refreshData} />

                        </ul>
                        {studentList.length > 0 ? (
                            <>
                                <ul>
                                    <div className="row">
                                        <div className="col-2">
                                            <b><u>Year</u></b>
                                        </div>
                                        <div className="col-2">
                                            <b><u>Name</u></b>
                                        </div>
                                        <div className="col-2">
                                            <b><u>Id Number</u></b>
                                        </div>
                                    </div>
                                </ul>
                                {studentList}
                            </>
                        ) : (
                            <>
                                no student matching was found, try searching again
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div>
                            <i className="bi bi-caret-left" style={{ cursor: 'pointer' }} onClick={handleUnexpand} />
                            go back
                        </div>
                        <StudentStatus token={token} selectedStudent={selectedStudent} yearOption={yearOption} />
                    </>
                )}
            </div>
        </>
    )
}

export default StudentSettingsPage