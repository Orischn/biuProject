import { useEffect, useState } from "react";
import Practice from "../practice/Practice";
import Grade from "../grade/Grade";


function StudentStats({ token, selectedStudent }) {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            const res = await fetch(`http://localhost:5000/api/studentPractices/${selectedStudent.userId}`,
                {
                    method: 'get',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            if (res.status === 200) {
                res.text().then((practices) => {
                    setGrades(JSON.parse(practices).map((practice, key) => {
                        return <Grade token={token} selectedStudent={selectedStudent}
                            chatId={practice.chatId} grade={practice.grade}
                            key={key} setGrades={setGrades} setNewGrade={setNewGrade} />
                    }))
                })
            } else {
                res.text().then((error) => {
                    console.log(error);
                })
            }
        }
        fetchGrades()
    }, [selectedStudent, token, newGrade])
    return (
        <>
            <div id="studentDetails" className="d-flex align-items-center w-100">
                <b className="ms-2 text-black-50">{selectedStudent.firstName} {selectedStudent.lastName}</b>
            </div>

            <div id="grades" className="w-100 mt-3">
                <h5>Grades</h5>
                <ul className="list-group">
                    {grades}
                </ul>
            </div>
        </>
    );
}

export default StudentStats;