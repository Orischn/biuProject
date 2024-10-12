

function Practice({ task, selectedTask, setSelectedTask, token, selectedPractice, setSelectedPractice }) {

    const add = async function (e) {

        const res = await fetch(`http://localhost:5000/api/addPractice/`, {
            'method': 'post',
            'headers': {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                'chatId': task.taskName
            })
        });
        
        if (res.status === 200) {
            res.text().then((practice) => {
                setSelectedPractice(JSON.parse(practice));
            });
        }
    };

    return (
        <>
        {/* ${!task.submitList.find((u) => u.userId === userId).didSubmit ? 'text-muted' : ''} */}
            <li key={task.taskName}
                className={`list-group-item practice container
                ${selectedTask && selectedTask.taskName === task.taskName ? 'active' : ''}
                ${''}`} //doesn't work
                onClick={() => {
                    // if (practice.active) { // necessary checking? can be chosen even when not active
                    add();
                    setSelectedTask(task);
                    // }
                }}>
                <div className="row">
                    <div>
                        <b className="text-black w-100">Task: {task.taskName}</b>
                        <span className="text-black badge date">{true ? 'In Progress...' : 'Finished'}</span>
                        <br />
                    </div>
                </div>
            </li>
        </>
    );
}

export default Practice;