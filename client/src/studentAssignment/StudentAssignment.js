

function StudentAssignment({ token, fullname, userId, didSubmit, canSubmitLate, taskName, refreshData }) {

    const allowLateSubmit = async function (userId, taskName) {
        const res = await fetch('http://localhost:5000/api/allowLateSubmit', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": taskName,
                "userId": userId
            })
        })

        if (res.status !== 200) { //error
            await res.text().then((error) => {
                alert(error)
            })
        } else {
            refreshData();
        }
    }

    const cancelLateSubmit = async function (userId, taskName) {
        const res = await fetch('http://localhost:5000/api/cancelLateSubmit', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": taskName,
                "userId": userId
            })
        })

        if (res.status !== 200) { //error
            await res.text().then((error) => {
                alert(error)
            })
        } else {
            refreshData();
        }
    }


    return (
        <>
            <ul>
                <div className="row">
                    <div className="col-2">
                        {fullname}
                    </div>
                    <div className="col-2">
                        {userId}
                    </div>
                    {didSubmit ? (
                        <div className="col-1" style={{ color: 'green' }}>
                            {/* Submitted */}
                            <i className="bi bi-check-square" />
                        </div>

                    ) : (
                        <div className="col-1" style={{ color: 'red' }}>
                            {/* Didn't submit */}
                            <i className="bi bi-x-square" />
                        </div>
                    )}

                    <div className="col-5">
                        {didSubmit ? ('') : (

                            !canSubmitLate ? (
                                <button className="btn btn-success" disabled={didSubmit}
                                    onClick={() => allowLateSubmit(userId, taskName)}>Allow late submit</button>
                            ) : (
                                <button className="btn btn-danger" disabled={didSubmit}
                                    onClick={() => cancelLateSubmit(userId, taskName)}>cancel late submit</button>
                            )
                        )}
                    </div>


                    {/* <div className="col-2">
                    grade: {grade}
                </div> */}

                </div>
            </ul>
        </>
    );
}

export default StudentAssignment;