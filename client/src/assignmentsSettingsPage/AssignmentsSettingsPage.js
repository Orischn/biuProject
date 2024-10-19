import { useEffect, useState } from "react";
import AssignmentDetails from "../assignment/AssignmentDetails";
import AddAssignment from "../addAssignment/AddAssignment";
import AssignemntStatus from "../assignmentStatus/AssignmentStatus";

function AssignmentsSettingsPage({ token, yearOption }) {
    const [taskList, setTaskList] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState('')
    const [expand, setExpand] = useState(false);
    const [selectedTask, setSelectedTask] = useState('');

    const handleUnexpand = () => {
        setExpand(false)
        setSelectedTask('');
    }

    const refreshData = () => {
        setIsChanged(!isChanged)
    }


    useEffect(() => {

        const fetchTasks = async () => {
            const res = await fetch('https://localhost:5000/api/getTasks', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((tasks) => {

                    setTaskList(JSON.parse(tasks).map((task, key) => {
                        if (task.year === parseInt(yearOption.current.value)) {
                            return <AssignmentDetails token={token} taskName={task.taskName}
                                endDate={task.endDate} refreshData={refreshData}
                                setExpand={setExpand} setSelectedTask={setSelectedTask} 
                                yearOption={yearOption}/>
                        }
                    }));
                });
            }
        }

        fetchTasks()
    }, [isChanged])



    return (
        <>
            <h2 className="settings-title">Manage Assignments</h2>
            <div className="settings-container">
                {!expand ? (
                    <>
                        {/* undefined for some reason, continue checking */}
                        <AddAssignment token={token} refreshData={refreshData} yearOption={yearOption} />
                        {taskList}
                    </>
                ) : (
                    <>
                        <div>
                            <i className="bi bi-caret-left" style={{ cursor: 'pointer' }} onClick={handleUnexpand} />
                            go back
                        </div>
                        <AssignemntStatus token={token} taskName={selectedTask} yearOption={yearOption} />

                    </>
                )}

            </div>


        </>
    )
}

export default AssignmentsSettingsPage