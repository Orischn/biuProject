import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddAssignment from "../addAssignment/AddAssignment";
import AssignmentDetails from "../assignmentDetails/AssignmentDetails";
import AssignemntStatus from "../assignmentStatus/AssignmentStatus";
import api from "../handleTokenRefresh/HandleTokenRefresh";

function AssignmentsSettingsPage({ token, yearOption, expand, setExpand, refreshDataInFeed, isYearChanged }) {
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [error, setError] = useState('')
    // const [expand, setExpand] = useState(false);
    const [selectedTask, setSelectedTask] = useState('');

    const handleUnexpand = () => {
        setExpand(false)
        setSelectedTask('');
    }

    const refreshData = () => {
        setIsChanged(!isChanged)
        refreshDataInFeed()
    }


    useEffect(() => {

        const fetchTasks = async () => {
            const res = await api.get('/api/getTasks');
            if (res.status === 200) {
                setTaskList(res.data.map((task, key) => {
                    if (yearOption.current && task.year === parseInt(yearOption.current.value)) {
                        return <AssignmentDetails token={token} taskName={task.taskName}
                            endDate={task.endDate} refreshData={refreshData}
                            setExpand={setExpand} setSelectedTask={setSelectedTask}
                            yearOption={yearOption} key={key} />
                    }
                }));
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }

        fetchTasks()
    }, [isChanged, isYearChanged])



    return (
        <>
            <h2 className="settings-title">Manage Assignments</h2>
            <div className="settings-container">
                {!expand ? (
                    <>

                        <AddAssignment token={token} refreshData={refreshData} yearOption={yearOption} />
                        <ul>
                            <div className="row">
                                <div className="col-2">
                                    <b><u>Name</u></b>
                                </div>
                                <div className="col-3">
                                    <b><u>Submission Status</u></b>
                                </div>
                                <div className="col-3">
                                    <b><u>Submit Until</u></b>
                                </div>
                            </div>
                        </ul>
                        {taskList}
                    </>
                ) : (
                    <>
                        <div>
                            <i className="bi bi-caret-left" style={{ cursor: 'pointer' }} onClick={handleUnexpand} />
                            &nbsp; go back
                        </div>
                        <AssignemntStatus token={token} taskName={selectedTask} yearOption={yearOption} />

                    </>
                )}

            </div>


        </>
    )
}

export default AssignmentsSettingsPage