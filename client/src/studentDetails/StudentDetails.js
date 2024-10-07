

function StudentDetails({fullName, userId}) {
    return (
        <div className="row">
            <div className="col-2">
                <i className="bi bi-pen"></i>
            </div>
            <div className="col-4">
                {fullName}
            </div>
            <div className="col-4">
                {userId}
            </div>
            <div className="col-2">
                <i className="bi bi-person-x"></i>
            </div>
        </div>   
    )
}

export default StudentDetails;