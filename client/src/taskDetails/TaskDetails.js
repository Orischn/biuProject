

function TaskDetails({ taskName, didSubmit, canSubmitLate, grade }) {
    return (
        <>
            <ul>
                <div className="row">
                    <div className="col-3">
                        {taskName}
                    </div>
                    {/* <div className="col-2">
                        {userId}
                    </div> */}
                    {didSubmit ? (
                        <div className="col-3" style={{ color: 'green' }}>
                            {/* Submitted */}
                            <i className="bi bi-check-square" />
                        </div>

                    ) : (
                        <div className="col-3" style={{ color: 'red' }}>
                            {/* Didn't submit */}
                            <i className="bi bi-x-square" />
                        </div>
                    )}

                    {canSubmitLate ? (
                        <div className="col-1" style={{ color: 'green' }}>
                            {/* Can Submit late */}
                            <i className="bi bi-check-square" />
                        </div>

                    ) : (
                        <div className="col-2" style={{ color: 'red' }}>
                            {/* Can't submit late */}
                            <i className="bi bi-x-square" />
                        </div>
                    )}
                    <div className="col-3">
                        {grade}
                    </div>
                </div>
            </ul>
        </>
    );
}

export default TaskDetails;