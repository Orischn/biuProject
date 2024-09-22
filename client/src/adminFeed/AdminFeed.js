import { useEffect, useState } from "react";
import Student from "../student/Student";
import StudentStats from "../studentStats/StudentStats";
import ChatsHistory from "../chatsHistory/ChatsHistory";



function AdminFeed({ token, username }) {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch('http://localhost:5000/api/getStudents', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((students) => {
                    setStudentList(JSON.parse(students).map((student, key) => {
                        return <Student student={student} key={key}
                            selectedStudent={selectedStudent} 
                            setSelectedStudent={setSelectedStudent} />
                    }));
                });
            }
        }
        fetchStudents();
    }, [selectedStudent, token])

    return (
    <>
        <div id="window" className="container">
            <div className="row">
                <div id="adminFeed" className="col-3">
                    <div id="me" className="d-flex align-items-center w-100">
                        <b className="ms-2 w-100 text-black-50">{username}</b>
                        
                    </div>
                    <div className="d-flex align-items-center">
                        <br />
                    </div>
                    {studentList}
                </div>
                <div id="gradesChatBlock" class="col-9">
                    {selectedStudent ?
                        <>
                            <StudentStats selectedStudent={selectedStudent}/>
                            <ChatsHistory />
                        </> :
                        <>
                            PlaceHolder.
                        </>
                    }
            </div>  
            </div>
        </div>
    </>

    );
}

export default AdminFeed;