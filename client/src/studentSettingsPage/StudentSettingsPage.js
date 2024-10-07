import StudentDetails from "../studentDetails/StudentDetails"

function StudentSettingsPage({ token }) {


    return (
        <>
            <h2 class="settings-title">Manage Students</h2>
            <div className="settings-container">

                {/* <span>add student</span> */}
                <ul>
                    <StudentDetails fullName={'Israel Israeli'} userId={123456789}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Israel Israeli'} userId={123456789}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Israel Israeli'} userId={123456789}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Avatar Aang'} userId={987654321}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Avatar Aang'} userId={987654321}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Avatar Aang'} userId={987654321}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Avatar Aang'} userId={987654321}/>
                </ul>
                <ul>
                    <StudentDetails fullName={'Israel Israeli'} userId={123456789}/>
                </ul>




            </div>

        </>
    )
}

export default StudentSettingsPage