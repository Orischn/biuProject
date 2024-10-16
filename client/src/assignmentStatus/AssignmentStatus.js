import { useEffect, useState } from "react";
import SearchStudent from "../searchStudent/SearchStudent";
import StudentAssignment from "../studentAssignment/StudentAssignment";


function AssignemntStatus({ token, taskName }) {

    const [studentList, setStudentList] = useState([]);
    const [filter, setFilter] = useState('');
    const [isChanged, setIsChanged] = useState(false);

    const refreshData = () => {
        setIsChanged(!isChanged); // This will trigger the useEffect to refetch the data
    };

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
                        return <StudentAssignment token={token}
                            fullname={student.firstName + ' ' + student.lastName}
                            userId={student.userId} didSubmit={student.didSubmit}
                            canSubmitLate={student.canSubmitLate} taskName={taskName}
                            refreshData={refreshData} />

                    }))
                });
            }
        }
        fetchSubmissionStatus(taskName);
    }, [token, filter, isChanged])

    return (


        <>
            <h2 className="settings-title">title</h2>
            <div className="settings-container">

                <ul className="setting-item">
                    <SearchStudent filter={filter} setFilter={setFilter} />
                </ul>

                <ul>
                    <div className="row">
                        <div className="col-2">
                            <b><u>name</u></b>
                        </div>
                        <div className="col-1">
                        <b><u>id</u></b>
                        </div>
                        <div className="col-3">
                            <b><u>submission status</u></b>
                        </div>

                    </div>
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