import AdminDeleteStudent from "../adminDeleteStudent/AdminDeleteStudent";


function StudentDetails({ token, fullName, userId }) {

    return (
        <ul>
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
                    <AdminDeleteStudent token={token} userId={userId} fullName={fullName} />
                </div>
            </div>
        </ul>
    )
}

export default StudentDetails;