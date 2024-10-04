

function Student({ student, selectedStudent, setSelectedStudent }) {
    return (
        <li key={student.userId}
            className={`list-group-item practice container ${selectedStudent && selectedStudent.userId === student.userId ? 'active' : ''}`}
            onClick={() => setSelectedStudent(student)}>
            <div className="row">
                <div>
                    <b className="text-black w-100">{student.firstName} {student.lastName}</b>
                    <br />
                </div>
            </div>
        </li>
    );
}

export default Student;