import { useEffect, useState } from "react";
import Grade from "../grade/Grade";
import ChatsHistory from "../chatsHistory/ChatsHistory";


function StudentStats({ token, selectedStudent, isAddedOrDeleted }) {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState(null);
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
    const [practiceList, setPracticeList] = useState([]);

    const refreshData = () => {
        setIsChanged(!isChanged);
    }


    useEffect(() => {
        const fetchPractices = async () => {
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
                const practices = await res.json();
                setPracticeList(practices);  // Update the practice list state
                return practices;  // Return the practices for immediate use
            }
            return [];
        }


        const fetchGrades = async (practices) => {
            const res = await fetch(`http://localhost:5000/api/adminGetTasks`,
                {
                    method: 'get',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            if (res.status === 200) {
                await res.text().then((tasks) => {
                    setGrades(JSON.parse(tasks).reverse().map((task, key) => {
                        const practice = practices.find(practice => practice.chatId === task.taskName);
                        const user = task.submitList.find(user => user.userId === selectedStudent.userId)
                        return <Grade selectedGradeId={selectedGradeId}
                            setSelectedGradeId={setSelectedGradeId}
                            token={token} selectedStudent={selectedStudent}
                            chatId={task.taskName}
                            grade={user.grade}
                            feedback={user.feedback}
                            key={key} setGrades={setGrades} setNewGrade={setNewGrade}
                            isActive={practice ? practice.active : true}
                            refreshData={refreshData} year={task.year} 
                            isStarted={practice ? true : false}/>

                    }))
                })
            } else {
                await res.text().then((error) => {
                    alert(error);
                })
            }
        }

        const loadStudentData = async () => {
            const practices = await fetchPractices();
            fetchGrades(practices); 
        };
        loadStudentData();
        setSelectedGradeId('');
    }, [selectedStudent, token, newGrade, isChanged, isAddedOrDeleted])

    // useEffect(() => {
    //     const fetchTasks = async () =>{
    //         const res = await fetch(`http://localhost:5000/api/getTasks/`,
    //             {
    //                 method: 'get',
    //                 headers: {
    //                     'accept': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 }
    //             }
    //         )
    //         if (res.status === 200) {
    //             await res.text().then((tasks) => {
    //                 setTaskList(JSON.parse(tasks).map((task, key) => {
    //                     return task;
    //                 }))
    //             })
    //         }
    //     }


    //     const fetchGrades = async () => {
    //         const res = await fetch(`http://localhost:5000/api/studentPractices/${selectedStudent.userId}`,
    //             {
    //                 method: 'get',
    //                 headers: {
    //                     'accept': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 }
    //             }
    //         )
    //         if (res.status === 200) {
    //             await res.text().then((practices) => {
    //                 console.log('1');
    //                 setGrades(JSON.parse(practices).reverse().map((practice, key) => {
    //                         return <Grade selectedGradeId={selectedGradeId}
    //                             setSelectedGradeId={setSelectedGradeId}
    //                             token={token} selectedStudent={selectedStudent}
    //                             chatId={practice.chatId} grade={practice.grade}
    //                             feedback={practice.feedback}
    //                             key={key} setGrades={setGrades} setNewGrade={setNewGrade}
    //                             isActive={practice.active} refreshData={refreshData}
    //                             year={practice.year}/>
    //                 }))
    //             })
    //         } else {
    //             await res.text().then((error) => {
    //                 alert(error);
    //             })
    //         }
    //     }
    //     fetchTasks();
    //     fetchGrades()
    //     setSelectedGradeId('');
    // }, [selectedStudent, token, newGrade, isChanged])
    return (
        <>

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