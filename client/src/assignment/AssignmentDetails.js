import { useEffect, useState } from "react";


function AssignmentDetails({ token, taskName, timeTillEnd }) {

    const [numOfAssigned, setNumOfAssigned] = useState(0);
    const [numOfSubmits, setNumOfSubmits] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

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
                    console.log('hello', JSON.parse(submissionList).filter(user => user.didSubmit));
                    setNumOfSubmits((JSON.parse(submissionList).filter(user => user.didSubmit)).length);
                    console.log(numOfSubmits, numOfAssigned)
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
                        <div className="col-4">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-4">
                            {/* needs to be input so we could edit? like in grade? */}
                            Due to {timeTillEnd} more days
                        </div>

                        <div className="col-2">

                            <i className="bi bi-pencil" onClick={() => {setIsEditing(true)}}/>
                        </div>
                    </div>
                </ul>
            ) : (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            <input type="text" placeholder="bla" style={{width: "70%"}}/>
                        </div>
                        <div className="col-4">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-4">
                            {/* needs to be input so we could edit? like in grade? */}
                            Due to <input type="text" placeholder="bla" style={{width: "50%"}}/> more days
                        </div>

                        <div className="col-2">

                            <button type="button" className="btn btn-danger" onClick={() => {setIsEditing(false)}}>ok</button>
                        </div>
                    </div>
                </ul>
            )}

        </>

    )
}

export default AssignmentDetails;