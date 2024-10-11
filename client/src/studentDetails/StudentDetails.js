import AdminDeleteStudent from "../adminDeleteStudent/AdminDeleteStudent";


function StudentDetails({ token, fullName, userId, year }) {

    return (
        <ul>
            <div className="row">
                <div className="col-2">
                    {/* <i className="bi bi-pen"></i> */}
                    {year}
                </div>
                <div className="col-2">
                    {fullName}
                </div>
                <div className="col-2">
                    {userId}
                </div>

                <div className="col-3">
                    maybe grades?
                </div>
                <div className="col-3">
                    Delete Student
                    <AdminDeleteStudent token={token} userId={userId} fullName={fullName} />
                </div>
            </div>
        </ul>
    )
}

export default StudentDetails;