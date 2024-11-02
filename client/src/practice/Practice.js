import { useEffect, useState } from "react";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import { useNavigate } from "react-router";

function Practice({ task, selectedTask, setSelectedTask, token, setSelectedPractice, refreshData }) {
    const navigate = useNavigate();
    const hasTimePassed = function (targetDate) {
        const currentDate = new Date();
        return targetDate < currentDate;
    }
    
    
    const [isCreated, setIsCreated] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isFeedbackAvailable, setIsFeedbackAvailable] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEndDatePassed, setIsEndDatePassed] = useState(hasTimePassed(task.endDate));
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isLateSubmitAllowed, setIsLateSubmitAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleTaskClick = () => {
        if (!isCreated) {
            setShowModal(true);
        } else {
            setSelectedTask(task);
            add();
        }
    };
    
    const handleConfirm = async () => {
        add();
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 15000);
        });
        setSelectedTask(task);
        setShowModal(false);
        setIsLoading(false);
    };
    
    const handleCancel = () => {
        setShowModal(false);
    };
    
    const add = async function () {
        const res = await api.post(`/api/addPractice/`, {
            chatId: task.taskName,
            durationHours: task.durationHours,
            durationMinutes: task.durationMinutes,
            endDate: task.endDate,
            year: task.year
        });
        
        if (res.status === 200) {
            const practice = res.data
            setSelectedPractice(practice);
        } else if (res.status === 403) {
            navigate('/');
            return
        }
    };
    
    const convertTimestampToDate = (timestamp) => {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);
        
        // Extract and format the parts of the date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        // Return the formatted date string
        return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
    };
    
    useEffect(() => {
        const fetchPractice = async function () {
            const res = await api.get(`/api/getPractice/${task.taskName}`);
            
            if (res.status === 200) {
                const practice = res.data; // parse the response as JSON
                if (practice && practice.chatId === task.taskName) { // check if practice exists for the task
                    setIsCreated(true);
                    setIsFinished(!practice.active);
                    setIsFeedbackAvailable((practice.grade !== null && practice.feedback !== ''));
                    setIsLateSubmitAllowed(practice.lateSubmit);
                    setIsTimeUp(hasTimePassed(practice.startDate + practice.durationHours * 3600000
                        + practice.durationMinutes * 60000));
                        setIsEndDatePassed(hasTimePassed(practice.endDate));
                } else {
                    setIsCreated(false); // make sure it's false when no matching practice is found
                }
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }
        fetchPractice();
            
    }, [selectedTask, task.taskName, token]);
        
        return (
            <>
            <li
            key={task.taskName}
            className={`list-group-item practice container
                    ${selectedTask && selectedTask.taskName === task.taskName ? 'practice-active' : ''}
                    ${''}`}
                onClick={handleTaskClick}
                >
                
                {/* <br /> */}
                {/* isEndDatePassed ? {String(isEndDatePassed)} */}
                {/* <br /> */}
                {/* isLateSubmitAllowed ? {String(isLateSubmitAllowed)} */}
                <div className="row">
                <div>
                <b className="text-black w-100">{task.taskName}</b>
                <span className="text-black badge date">
                {(isEndDatePassed && !isFinished && !isLateSubmitAllowed) ?
                    'Can\'t submit' :
                    (isTimeUp && !isFinished && task.durationHours !== null 
                        && task.durationMinutes !== null) ? 'Time\'s up!' :
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
                        ) : (isEndDatePassed && !isLateSubmitAllowed) ? (
                            <>
                            Submission date has passed!
                            </>
                        ) : isEndDatePassed ? (
                            <>
                            Late submission is allowed
                            </>
                        ) : isTimeUp ? (
                            <>
                            submission until {convertTimestampToDate(task.endDate).split('T')[0]}
                            <br />
                            at {convertTimestampToDate(task.endDate).split('T')[1].slice(0, -3)}
                            </>
                        ) : isCreated ? (
                            <>
                            submission until {convertTimestampToDate(task.endDate).split('T')[0]}
                            <br />
                            at {convertTimestampToDate(task.endDate).split('T')[1].slice(0, -3)}
                            </>
                        ) : (
                            <>
                            submission until {convertTimestampToDate(task.endDate).split('T')[0]}
                            <br />
                            at {convertTimestampToDate(task.endDate).split('T')[1].slice(0, -3)}
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
                        {!isLoading &&
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                        }
                        </div>
                        {task.durationHours ? (
                            <div className="modal-body">
                            Are you sure you want to start <b>{task.taskName}</b>?<br />
                            This will start a timer of&nbsp;
                            <b>{task.durationHours > 0 ? (
                                `${task.durationHours} hours and `
                            ) : ('')}
                            {task.durationMinutes} minutes.</b><br />
                            After the time ends, you will have to submit what you've done so far, and no changes will be possible afterward.
                            </div>
                        ) : (
                            <div className="modal-body">
                            Are you sure you want to start <b>{task.taskName}</b>?<br />
                            Please note that this assignment <b>does not have a time limit</b>, 
                            and you can take a much time you need, as long you submit it 
                            before the last date of submission.
                            </div>
                        )}
                        
                        {!isLoading &&
                            <div className="modal-footer">
                            
                            <>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>No, Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                            Yes, Start Practice
                            </button>
                            </>
                            </div>
                        }
                        {isLoading &&
                            <>
                            <div className="modal-body">
                            <span><b>Loading Assignment...<br />
                            Please do not close this window!
                            </b></span>
                            </div>
                            </>}
                            </div>
                            </div>
                            </div>
                            
                        )
                    }
                    </>
                    
                );
            }
            
            export default Practice;
            