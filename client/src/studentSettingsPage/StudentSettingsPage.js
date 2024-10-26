import { useEffect, useState } from "react";
import StudentDetails from "../studentDetails/StudentDetails"
import AdminAddStudent from "../adminAddStudent/AdminAddStudent";
import SearchStudent from "../searchStudent/SearchStudent";
import StudentStatus from "../studentStatus/StudentStatus";
import InputFile from "../inputFile/InputFile";

function StudentSettingsPage({ token, yearOption, refreshDataInFeed, expand, setExpand }) {

    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    // const [expand, setExpand] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [fileError, setFileError] = useState('');

    const handleUnexpand = () => {
        setExpand(false)
        setSelectedStudent('');
    }

    const refreshData = () => {
        setIsChanged(!isChanged);
        refreshDataInFeed()
    }

    const save = async (e) => {
        const uploadIds = async () => {
            const res = await fetch(`http://localhost:5000/api/uploadValidIdFile/`, {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                'body': JSON.stringify({
                    'fileName': 'validIds.txt',
                    "fileContent": fileContent,
                })
            })
            if (res === 500) {
                await res.text().then((errorText) => alert(errorText))
            } else if (res === 400) {
                await res.text.then((errorText) => setFileError(errorText))
            }
        }
        e.preventDefault();
        uploadIds()
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
                                user={user} setSelectedStudent={setSelectedStudent}
                                refreshData={refreshData} setExpand={setExpand} />
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
                {!expand ? (
                    <>
                        <ul className="setting-item">
                            <SearchStudent filter={filter} setFilter={setFilter} />
                            <div  style={{width: '100%'}}>
                            
                                <label htmlFor="files">Upload valid id's numbers</label>
                                <form noValidate onSubmit={save} >
                                    {/* &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; */}
                                    <InputFile title={'valid ID\'s: '} setFileName={setFileName} setFileContent={setFileContent} error={fileError} />
                                    <input type="submit" className="btn btn-primary submit" value="Upload"
                                     />
                                </form>
                                {/* &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; */}
                            </div>
                            &emsp;&emsp;&emsp;
                            <label htmlFor="addStudent">Add Student</label>
                            <AdminAddStudent token={token} studentList={studentList}
                                setStudentList={setStudentList} refreshData={refreshData} />

                        </ul>
                        {studentList.length > 0 ? (
                            <>
                                <ul>
                                    <div className="row">
                                        <div className="col-2">
                                            <b><u>year</u></b>
                                        </div>
                                        <div className="col-2">
                                            <b><u>name</u></b>
                                        </div>
                                        <div className="col-2">
                                            <b><u>id number</u></b>
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
                        <StudentStatus token={token} selectedStudent={selectedStudent} />
                    </>
                )}




            </div>
        </>
    )
}

export default StudentSettingsPage