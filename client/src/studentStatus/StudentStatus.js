import { useEffect, useState } from "react";
import TaskDetails from "../taskDetails/TaskDetails";


function StudentStatus({token, selectedStudent}) {

    const [taskList, setTaskList] = useState([]);
    const [average, setAverage] = useState(0);

    const calculateAverage = (gradeList) => {
        if (gradeList.length === 0) {
            setAverage(0);
            return;
        }
        const sum = gradeList.reduce((acc, grade) => acc + grade, 0);
        setAverage(sum / gradeList.length);
    };

    useEffect(() => {
        const fetchStudentsAssignments = async function () {
            const res = await fetch(`https://localhost:5000/api/adminGetTasks/`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                const gradeList = await res.text().then((tasks) => {
                    setTaskList(JSON.parse(tasks).map((task, key) => {
                        let user = task.submitList.find(user => user.userId === selectedStudent.userId);
                        return <TaskDetails taskName={task.taskName} 
                        didSubmit={user.didSubmit} 
                        canSubmitLate={user.canSubmitLate}
                        grade={user.grade ? user.grade : ''}/>
                    }))
                    return JSON.parse(tasks).map((task, key) => {
                        let user = task.submitList.find(user => user.userId === selectedStudent.userId);
                        return user.grade;
                    }).filter((grade) => grade !== undefined && grade !== null);
                });
                return gradeList;
            } else {
                await res.text().then((error) => {
                    console.log(error)
                })
                return [];
            }
            
        }

        const loadAverage = async () => {
            const gradeList = await fetchStudentsAssignments();
            calculateAverage(gradeList);
        }
        loadAverage();
    }, [token])


    return (
        <>
            <h2 className="settings-title">
                {selectedStudent.firstName +' '+ selectedStudent.lastName}
                {' '}assignments details</h2>
                average (of submitted assignments): {average}
                <ul></ul>

            <ul>
                <div className="row">
                    <div className="col-2">
                        <b><u>name</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Submission Status</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Late submission</u></b>
                    </div>
                    <div className="col-3">
                        <b><u>Grade</u></b>
                    </div>
                    {}
                </div>
            </ul>

            {/* {studentList.length > 0 ? (
                studentList
            ) : (
                <>
                    no student matching was found, try searching again
                </>
            )} */}
            {taskList}


            {/* </div> */}
        </>
    );
}

export default StudentStatus;