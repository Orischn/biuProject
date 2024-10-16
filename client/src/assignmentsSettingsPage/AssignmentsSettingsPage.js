import { useEffect, useState } from "react";
import AssignmentDetails from "../assignment/AssignmentDetails";
import AddAssignment from "../addAssignment/AddAssignment";

function AssignmentsSettingsPage({ token }) {
    const [taskList, setTaskList] = useState([]);
    const [isChanged, setIsChanged] = useState('');
    const [error, setError] = useState('')

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
                        return <AssignmentDetails token={token} taskName={task.taskName}
                            endDate={task.endDate} setIsChanged={setIsChanged}/>
                    }));
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

            </div>
        </>
    )
}

export default AssignmentsSettingsPage