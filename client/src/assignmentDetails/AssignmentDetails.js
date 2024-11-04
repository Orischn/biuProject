import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import DeleteAssignment from "../deleteAssignment/DeleteAssignment";
import api from "../handleTokenRefresh/HandleTokenRefresh";


function AssignmentDetails({ token, taskName, endDate, refreshData, setExpand, setSelectedTask, yearOption }) {
    const navigate = useNavigate();
    const [numOfAssigned, setNumOfAssigned] = useState(0);
    const [numOfSubmits, setNumOfSubmits] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);


    const handleExpand = () => {
        setExpand(true);
        setSelectedTask(taskName)
    }

    const newEndDateBar = useRef(null)

    const handleCancel = () => {
        setError('')
        setIsEditing(false);
        newEndDateBar.current.value = "";
    }

    const editAssignment = async (e) => {

        if (!newEndDateBar.current.value.trim()) {
            setError('must choose a new date')
            return;
        }

        e.preventDefault();
        const newEndDate = newEndDateBar.current.value.trim();

        const res = await api.post('/api/updateTask', {
            "taskName": taskName,
            "newEndDate": new Date(newEndDate).getTime(),
            "year": yearOption.current.value
        })

        if (res.status !== 200) { //error
            setError(res.data);
            setIsSuccessful(false);
            refreshData()
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        } else {
            setError("Changed Successfully");
            setIsSuccessful(true);
            newEndDateBar.current.value = "";
            refreshData()

        }
    }

    const convertTimestampToDate = (timestamp) => {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);

        // Extract and format the parts of the date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Return the formatted date string
        return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const fetchSubmissionStatus = async function (taskName, year) {
            const res = await api.get(`/api/getSubmissionStatus/${taskName}/${year}`);
            if (res.status === 200) {
                const submissionList = res.data;
                setNumOfAssigned(submissionList.length);
                setNumOfSubmits((submissionList.filter(user => user.didSubmit)).length);
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }
        fetchSubmissionStatus(taskName, yearOption.current.value);
    }, [])

    return (
        <>
            {!isEditing ? (
                <>
                    <ul>
                        <div className="row">
                            <div className="col-2">
                                {taskName}
                            </div>
                            <div className="col-3">
                                {numOfSubmits} / {numOfAssigned} submitted
                            </div>
                            <div className="col-4">
                                {convertTimestampToDate(endDate).split('T')[0]}{' '}
                                on {convertTimestampToDate(endDate).split('T')[1]}
                            </div>
                            <div className="col-1">
                                <i className="bi bi-pencil" style={{ cursor: 'pointer' }} onClick={() => { setIsEditing(true) }} />
                            </div>
                            <div className="col-1">
                                <DeleteAssignment taskName={taskName}
                                    year={yearOption.current.value} refreshData={refreshData} />
                            </div>
                            <div className="col-1">
                                <i className="bi bi-caret-right" style={{ cursor: 'pointer' }} onClick={handleExpand} />
                            </div>
                        </div>
                    </ul>
                </>
            ) : (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            {taskName}
                        </div>
                        <div className="col-3">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-3">
                            <input className="editAssignmentInput" ref={newEndDateBar} type="datetime-local" placeholder="new date" style={{ width: "80%" }} />
                        </div>

                        <div className="col-1">

                            <i className="bi bi-x-circle" onClick={handleCancel}></i>
                        </div>

                        <div className="col-1">

                            <button type="button" className="btn btn-danger" onClick={editAssignment}>save</button>
                        </div>
                    </div>
                    {error &&
                        <center><span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert"
                            style={{ padding: '5px 10px', lineHeight: '1.2', fontSize: '14px' }}>
                            {error}
                        </span></center>}
                </ul>
            )}

        </>

    )
}

export default AssignmentDetails;