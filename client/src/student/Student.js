
function Student({ student, selectedStudent, setSelectedStudent }) {
    return (
        // practice-active is a class name for the design of active with brighter color
        <li key={student.userId}
            className={`list-group-item practice container ${selectedStudent && selectedStudent.userId === student.userId ? 'practice-active' : ''}`}
            onClick={() => setSelectedStudent(student)}
            style={{ height: "11%" }}>
            <div className="row">
                <div>
                    <b className="text-black w-100">{student.firstName} {student.lastName}</b>
                    <br />
                    ID: {student.userId}
                </div>
            </div>
        </li>
    );
}

export default Student;