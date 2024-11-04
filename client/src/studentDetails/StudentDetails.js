import AdminDeleteStudent from "../adminDeleteStudent/AdminDeleteStudent";


function StudentDetails({ user, setSelectedStudent, refreshData, setExpand }) {

    const handleExpand = () => {
        setExpand(true);
        setSelectedStudent(user)
    }

    return (
        <ul>
            <div className="row">
                <div className="col-2">
                    {user.year}
                </div>
                <div className="col-2">
                    {user.firstName + ' ' + user.lastName}
                </div>
                <div className="col-2">
                    {user.userId}
                </div>

                <div className="col-3">
                    <span id="click-here2" onClick={handleExpand}>See Assignments</span>
                </div>
                <div className="col-3">
                    Delete Student
                    <AdminDeleteStudent userId={user.userId} fullName={user.firstName + ' ' + user.lastName}
                        refreshData={refreshData} />
                </div>
            </div>
        </ul>
    )
}

export default StudentDetails;