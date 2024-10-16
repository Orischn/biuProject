import { useEffect, useRef, useState } from "react";


function AssignmentDetails({ token, taskName, endDate, setIsChanged }) {

    const [numOfAssigned, setNumOfAssigned] = useState(0);
    const [numOfSubmits, setNumOfSubmits] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const newTaskNameBar = useRef(null);
    const newEndDateBar = useRef(null)

    const editAssignment = async (e) => {

        if (!newTaskNameBar.current.value.trim() || !newEndDateBar.current.value.trim()) {
            alert('must fill both fields')
            return;
        }

        e.preventDefault();
        const newTaskName = newTaskNameBar.current.value.trim();
        const newEndDate = newEndDateBar.current.value.trim();

        const res = await fetch('http://localhost:5000/api/updateTask', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": taskName,
                "newTaskName": newTaskName,
                "newEndDate": convertTimestampToDate(new Date(newEndDate).getTime()),
            })

        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                setError(errorMessage);
            })
            return;
        } else {
            setError("Added Successfully");
            newTaskNameBar.current.value = "";
            newEndDateBar.current.value = "";
            setIsEditing(false);
            setIsChanged(newEndDate);
            
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
                    setNumOfAssigned(JSON.parse(submissionList).length);
                    setNumOfSubmits((JSON.parse(submissionList).filter(user => user.didSubmit)).length);
                });
            }
        }
        fetchSubmissionStatus(taskName);
    }, [])

    return (
        <>
            {!isEditing ? (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            {taskName}
                        </div>
                        <div className="col-3">
                            {numOfSubmits} / {numOfAssigned} submitted
                            <i className="bi bi-caret-down" style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="col-5">
                            {/* maybe remove the T for design */}
                            Submission until {endDate}
                        </div>

                        <div className="col-2">

                            <i className="bi bi-pencil" style={{ cursor: 'pointer' }} onClick={() => { setIsEditing(true) }} />
                        </div>
                    </div>
                </ul>
            ) : (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            <input ref={newTaskNameBar} type="text" placeholder="new name" style={{ width: "70%" }} />
                        </div>
                        <div className="col-3">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-5">
                            {/* needs to be input so we could edit? like in grade? */}
                            Submission until <input ref={newEndDateBar} type="datetime-local" placeholder="new date" style={{ width: "50%" }} />
                        </div>

                        <div className="col-2">

                            <button type="button" className="btn btn-danger" onClick={editAssignment}>save</button>
                        </div>
                    </div>
                </ul>
            )}

        </>

    )
}

export default AssignmentDetails;