import { useEffect, useState } from "react";
import SearchStudent from "../searchStudent/SearchStudent";
import StudentAssignment from "../studentAssignment/StudentAssignment";


function AssignemntStatus({ token, taskName }) {

    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchSubmissionStatus = async function (taskName) {
            const res = await fetch(`http://localhost:5000/api/getSubmissionStatus/${taskName}`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((submissionList) => {
                    setStudentList(JSON.parse(submissionList).filter((user) => {
                        if (filter !== '') {
                            return (user.firstName + ' ' + user.lastName).toLowerCase().
                                includes(filter.toLowerCase()) ||
                                user.userId.includes(filter);
                        }
                        return true;
                    }).map((student, key) => {
                        return <StudentAssignment
                            fullname={student.firstName + ' ' + student.lastName}
                            didSubmit={student.didSubmit} canSubmitLate={student.canSubmitLate} />

                    }))
                });
            }
        }
        fetchSubmissionStatus(taskName);
    }, [token, filter])

    return (


        <>
            <h2 className="settings-title">title</h2>
            <div className="settings-container">

                <ul className="setting-item">
                    <SearchStudent filter={filter} setFilter={setFilter} />
                </ul>
                {/* {console.log(studentList)} */}
                {studentList.length > 0 ? (
                    studentList
                ) : (
                    <>
                        no student matching was found, try searching again
                    </>
                )}


            </div>
        </>








    );
}

export default AssignemntStatus;