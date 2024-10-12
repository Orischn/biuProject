import { useEffect, useState } from "react";
import AssignmentDetails from "../assignment/AssignmentDetails";
import AddAssignment from "../addAssignment/AddAssignment";

function AssignmentsSettingsPage({ token }) {
    const [taskList, setTaskList] = useState([]);
    const [error, setError] = useState('')
    const [numOfSubmits, setNumOfSubmits] = useState(0);
    const [numOfAssigned, setNumOfAssigned] = useState(0);
    const [teskName, setTaskName] = useState('')

    useEffect(() => {

        const fetchTasks = async () => {
            const res = await fetch('http://localhost:5000/api/getTasks', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((tasks) => {
                    
                    setTaskList(JSON.parse(tasks).map((task, key) => {
                        fetchSubmissionStatus(task.taskName);
                        return <AssignmentDetails name={task.taskName}
                            numOfSubmits={numOfSubmits} numOfAssigned={numOfAssigned}
                            timeTillEnd={15} />

                    }));
                });
            }
        }

        const fetchSubmissionStatus = async function (taskName) {
            const res = await fetch('http://localhost:5000/api/getSubmissionStatus', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    taskName: taskName
                })
            });
            if (res.status === 200) {
                res.text().then((submissionList) => {
                    setNumOfAssigned(submissionList.length);
                    setNumOfSubmits(submissionList.filter(user => user.didSubmit).length);
                });
            }
        }
        fetchTasks()
    }, [])


    return (
        <>
            <h2 className="settings-title">Manage Assignments</h2>
            <div className="settings-container">
                <AddAssignment token={token} />
                {taskList}

                {/* <AssignmentDetails name={"ass1"} numOfSubmits={15} numOfAssigned={30} timeTillEnd={5} /> */}
                {/* <AssignmentDetails name={"ass2"} numOfSubmits={6} numOfAssigned={30} timeTillEnd={10} /> */}
                {/* <AssignmentDetails name={"ass3"} numOfSubmits={7} numOfAssigned={30} timeTillEnd={15} /> */}
                {/* <AssignmentDetails name={"ass4"} numOfSubmits={1} numOfAssigned={30} timeTillEnd={20} /> */}


            </div>
        </>
    )
}

export default AssignmentsSettingsPage