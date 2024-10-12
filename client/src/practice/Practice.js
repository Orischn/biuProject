import { useEffect, useState } from "react";


function Practice({ task, selectedTask, setSelectedTask, token, selectedPractice, setSelectedPractice }) {
    const [isCreated, setIsCreated] = useState(false);
    const [isFinished, setIsFinished] = useState(false)

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

    useEffect(() => {

        const fetchPractice = async function () {
            const res = await fetch(`http://localhost:5000/api/getPractice/${task.taskName}`, {
                'method': 'get',
                'headers': {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                const practice = await res.json(); // parse the response as JSON (???)
                if (practice && practice.chatId === task.taskName) { // check if practice exists for the task
                    setIsCreated(true);
                    if (!practice.active) {
                        setIsFinished(true);
                    } else {
                        setIsFinished(false)
                    }
                } else {
                    setIsCreated(false); // make sure it's false when no matching practice is found
                }
            }
        }
        fetchPractice();
    }, [selectedTask])


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
                        <span className="text-black badge date">
                            {!isCreated
                                ? 'Click to start'
                                : !isFinished
                                    ? 'Task in progress...'
                                    : 'Finished'}
                        </span>
                        <br />
                    </div>
                </div>
            </li>
        </>
    );
}

export default Practice;