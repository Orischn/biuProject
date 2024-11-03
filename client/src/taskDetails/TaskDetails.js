

function TaskDetails({ taskName, didSubmit, endDate, grade }) {


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
                        <div className="col-2" style={{ color: 'green' }}>
                            {/* Submitted */}
                            <i className="bi bi-check-square" />
                        </div>

                    ) : (
                        <div className="col-2" style={{ color: 'red' }}>
                            {/* Didn't submit */}
                            <i className="bi bi-x-square" />
                        </div>
                    )}

                    <div className="col-3">
                        {convertTimestampToDate(endDate).split('T')[0]}{' '}
                        on {convertTimestampToDate(endDate).split('T')[1]}
                    </div>

                    {/* {canSubmitLate ? (
                        <div className="col-2" style={{ color: 'green' }}>
                            Can Submit late
                            <i className="bi bi-check-square" />
                        </div>

                    ) : (
                        <div className="col-2" style={{ color: 'red' }}>
                            Can't submit late
                            <i className="bi bi-x-square" />
                        </div>
                    )} */}
                    <div className="col-3">
                        {grade ? grade : 'no grade given'}
                    </div>
                </div>
            </ul>
        </>
    );
}

export default TaskDetails;