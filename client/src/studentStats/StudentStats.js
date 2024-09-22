import { useEffect, useState } from "react";
import Practice from "../practice/Practice";
import Grade from "../grade/Grade";


function StudentStats({token, selectedStudent}) {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            const res = await fetch(`http://localhost:5000//api/studentPractices/${selectedStudent.userId}`,
                {
                    method: 'get',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            res.text().then((practices) => {
                setGrades(practices.map((practice, key) => {
                    return <Grade token={token} selectedStudent={selectedStudent}
                    chatId={practice.chatId} grade={practice.grade}
                    key={key} setGrades={setGrades} setNewGrade={setNewGrade} />
                }))
            })
        }
        fetchGrades()
    }, [selectedStudent, token, newGrade])
    return (
        <>
            <div id="studentDetails" class="d-flex align-items-center w-100">
                <b class="ms-2 text-black-50">{selectedStudent.firstName} {selectedStudent.lastName}</b>
            </div>

            <div id="grades" class="w-100 mt-3">
                <h5>Grades</h5>
                <ul class="list-group">
                    {grades}
                </ul>
            </div>
        </>
    );
}

export default StudentStats;