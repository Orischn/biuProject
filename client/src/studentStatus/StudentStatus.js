import { useEffect, useState } from "react";
import TaskDetails from "../taskDetails/TaskDetails";


function StudentStatus({token, selectedStudent}) {

    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        const fetchStudentsAssignments = async function () {
            const res = await fetch(`https://localhost:5000/api/adminGetTasks/`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                await res.text().then((tasks) => {
                    setTaskList(JSON.parse(tasks).map((task, key) => {
                        let user = task.submitList.find(user => user.userId === selectedStudent.userId);
                        return <TaskDetails taskName={task.taskName} 
                        didSubmit={user.didSubmit} 
                        canSubmitLate={user.canSubmitLate}
                        grade={user.grade ? user.grade : ''}/>
                    }))
                });
            } else {
                await res.text().then((error) => {
                    console.log(error)
                })
            }
            
        }
        fetchStudentsAssignments();
    }, [token])


    return (
        <>
            <h2 className="settings-title">
                {selectedStudent.firstName +' '+ selectedStudent.lastName}
                {' '}assignments details</h2>
            {/* <div className="settings-container"> */}

            {/* <ul className="setting-item">
                <SearchStudent filter={filter} setFilter={setFilter} />
            </ul> */}

            <ul>
                <div className="row">
                    <div className="col-2">
                        <b><u>name</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Submission Status</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Late submission</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Grade</u></b>
                    </div>
                    {}
                </div>
            </ul>

            {/* {studentList.length > 0 ? (
                studentList
            ) : (
                <>
                    no student matching was found, try searching again
                </>
            )} */}
            {taskList}


            {/* </div> */}
        </>
    );
}

export default StudentStatus;