import { useEffect, useState } from "react";
import Practice from "../practice/Practice";
import Grade from "../grade/Grade";
import ChatsHistory from "../chatsHistory/ChatsHistory";
import Feedback from "../feedback/Feedback";


function StudentStats({ token, selectedStudent }) {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState(null);
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [isChanged, setIsChanged] = useState(false);

    const refreshData = () => {
        setIsChanged(!isChanged);
    }

    useEffect(() => {
        const fetchGrades = async () => {
            const res = await fetch(`https://localhost:5000/api/studentPractices/${selectedStudent.userId}`,
                {
                    method: 'get',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            if (res.status === 200) {
                await res.text().then((practices) => {
                    setGrades(JSON.parse(practices).reverse().filter(practice => !practice.active).map((practice, key) => {
                            return <Grade selectedGradeId={selectedGradeId}
                                setSelectedGradeId={setSelectedGradeId}
                                token={token} selectedStudent={selectedStudent}
                                chatId={practice.chatId} grade={practice.grade}
                                feedback={practice.feedback}
                                key={key} setGrades={setGrades} setNewGrade={setNewGrade}
                                isActive={practice.active} refreshData={refreshData}/>
                    }))
                })
            } else {
                await res.text().then((error) => {
                    alert(error);
                })
            }
        }
        fetchGrades()
        setSelectedGradeId('');
    }, [selectedStudent, token, newGrade, isChanged])
    return (
        <>
            {/* <div id="studentDetails" className="d-flex align-items-center w-100">
                <b className="ms-2 text-black-50">{selectedStudent.firstName} {selectedStudent.lastName}</b>
            </div> */}

            <div id="grades" className="w-100 mt-3">
                {grades.length > 0 ? (
                    <>
                        <h5>Check Assignemnts of {selectedStudent.firstName} {selectedStudent.lastName}</h5>
                        <div className="grades-grid">
                            {grades}
                        </div>
                    </>
                ) : (
                    <>
                        No assignemnts had been submitted
                        by {selectedStudent.firstName} {selectedStudent.lastName} yet
                    </>
                )}

            </div>

            <div id="chatHistory" className="w-100 mt-3">
                <ChatsHistory token={token} selectedGradeId={selectedGradeId} selectedStudent={selectedStudent} />
            </div>

        </>
    );
}

export default StudentStats;