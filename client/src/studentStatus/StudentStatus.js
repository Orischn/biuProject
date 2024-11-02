import { useEffect, useState } from "react";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import TaskDetails from "../taskDetails/TaskDetails";


function StudentStatus({token, selectedStudent, yearOption}) {
    
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
            const res = await api.get(`/api/adminGetTasks/${yearOption.current.value}`);
            if (res.status === 200) {
                const tasks = res.data
                setTaskList(tasks.map((task, key) => {
                    let user = task.submitList.find(user => user.userId === selectedStudent.userId);
                    return <TaskDetails taskName={task.taskName} 
                    didSubmit={user.didSubmit} 
                    canSubmitLate={user.canSubmitLate}
                    grade={user.grade ? user.grade : ''} key={key}/>
                }))
                return tasks.map((task, key) => {
                    let user = task.submitList.find(user => user.userId === selectedStudent.userId);
                    return (user.grade !== undefined && user.grade !== null) ? user.grade : 0;
                })
            }
            console.log(res.data)
            return [];
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
        Average: {average}
        <ul></ul>
        
        <ul>
        <div className="row">
        <div className="col-2">
        <b><u>Name</u></b>
        </div>
        <div className="col-3">
        <b><u>Submission Status</u></b>
        </div>
        <div className="col-3">
        <b><u>Late Submission</u></b>
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