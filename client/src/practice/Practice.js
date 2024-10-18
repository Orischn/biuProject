import { useEffect, useState } from "react";

function Practice({ task, selectedTask, setSelectedTask, token, selectedPractice, setSelectedPractice }) {
    const [isCreated, setIsCreated] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEndDatePassed, setIsEndDatePassed] = useState(false);
    // const [isTimeUp, setIsTimeUp] = useState(false);

    const handleTaskClick = () => {
        if (!isCreated) {
            setShowModal(true);
        } else {
            setSelectedTask(task);
            add();
        }
    };

    const handleConfirm = () => {
        add();
        setSelectedTask(task);
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const add = async function () {
        const res = await fetch(`http://localhost:5000/api/addPractice/`, {
            method: 'post',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                chatId: task.taskName,
                durationHours: task.durationHours,
                durationMinutes: task.durationMinutes,
                endDate: task.endDate,
                year: task.year
            }),
        });

        if (res.status === 200) {
            const practice = await res.text();
            setSelectedPractice(JSON.parse(practice));
        }
    };

    useEffect(() => {
        const fetchPractice = async function () {
            const res = await fetch(`http://localhost:5000/api/getPractice/${task.taskName}`, {
                method: 'get',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                const practice = await res.json(); // parse the response as JSON
                if (practice && practice.chatId === task.taskName) { // check if practice exists for the task
                    setIsCreated(true);
                    setIsFinished(!practice.active);
                    setIsFeedbackAvailable((practice.grade && practice.feedback !== ''));
                    // setIsLateSubmitAllowed(practice.lateSubmit);
                } else {
                    setIsCreated(false); // make sure it's false when no matching practice is found
                }
            }
        };

        const hadEndDatePassed = function (endDate) {
            const [datePart, timePart] = endDate.split('T');
            const [day, month, year] = datePart.split('-');
            const formattedDateString = `${year}-${month}-${day}T${timePart}`;
            const inputDate = new Date(formattedDateString.replace(/-/g, '/'));
            const currentDate = new Date();
            setIsEndDatePassed(inputDate < currentDate);
        }
        hadEndDatePassed(task.endDate);
        fetchPractice();

    }, [selectedTask, task.taskName, token]);



    const convertTimestampToDateOnly = (timestamp) => {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);

        // Extract and format the year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        // Return the formatted date string (yyyy-mm-dd)
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <li
                key={task.taskName}
                className={`list-group-item practice container
                    ${selectedTask && selectedTask.taskName === task.taskName ? 'practice-active' : ''}
                    ${''}`}
                onClick={handleTaskClick}
            >
                <div className="row">
                    <div>
                        <b className="text-black w-100">Task: {task.taskName}</b>
                        <span className="text-black badge date">
                            {(isEndDatePassed && !isFinished) ?
                                'Can\'t submit' :
                                !isCreated
                                    ? 'Click to start'
                                    : !isFinished
                                        ? 'Task in progress...'
                                        : 'Finished'}
                        </span>
                        <br />
                    </div>
                </div>
                <div style={{ color: 'blue' }}>
                    {isFeedbackAvailable ? (
                        <>
                            Grade and feedback are available
                        </>
                    ) : isFinished ? (
                        <>
                            Waiting for checking
                        </>
                    ) : isEndDatePassed ? (
                        <>
                            Submission date had passed!
                        </>
                    ) :
                        isCreated ? (
                            <>
                                Started
                            </>
                        ) : (
                            <>
                                submission until {task.endDate.split('T')[0]}
                                <br />
                                at {task.endDate.split('T')[1].slice(0, -3)}
                            </>
                        )
                    }
                </div>
            </li >

            {showModal && (
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">Start Practice</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to start <b>{task.taskName}</b>?<br />
                                This will start a timer of&nbsp;
                                <b>{task.durationHours > 0 ? (
                                    `${task.durationHours} hours and `
                                ) : ('')}
                                    {task.durationMinutes} minutes.</b><br />
                                After the time ends, you will have to submit what you've done so far, and no changes will be possible afterward.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>No, Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                                    Yes, Start Practice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )
            }
        </>

    );
}

export default Practice;
