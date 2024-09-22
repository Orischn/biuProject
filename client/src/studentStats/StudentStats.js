

function StudentStats({selectedStudent}) {
    return (
        <>
            <div id="studentDetails" class="d-flex align-items-center w-100">
                <b class="ms-2 text-black-50">{selectedStudent.firstName} {selectedStudent.lastName}</b>
            </div>

            <div id="grades" class="w-100 mt-3">
                <h5>Grades</h5>
                <ul class="list-group">
                    <li class="list-group-item">Assignment 1: 85%</li>
                    <li class="list-group-item">Assignment 2: 90%</li>
                    <li class="list-group-item">Assignment 3: 75%</li>
                </ul>
            </div>
        </>
    );
}

export default StudentStats;