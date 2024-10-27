import BotMessage from "../botMessage/BotMessage";
import Countdown from "../countdown/Countdown";
import SendMessage from "../sendMessage/SendMessage";
import StudentMessage from "../studentMessage/StudentMessage";

const { useState, useEffect, useRef, useCallback } = require("react");

function ChatFeed({ token, selectedPractice, finishPractice, latestMessage, setLatestMessage,
    isTimeUp, setIsTimeUp, isEndDatePassed, setIsEndDatePassed, setSelectedPractice, setSelectedTask }) {
    const [messages, setMessages] = useState([]);
    const [grade, setGrade] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [showTimer, setShowTimer] = useState(true);
    const [showTimesUpModal, setShowTimesUpModal] = useState(false);
    const [showEndDateModal, setShowEndDateModal] = useState(false);

    const chat = useRef(null);

    const changeEndDateFormat = (endDate) => {
        const [datePart, timePart] = endDate.split('T');
        const [day, month, year] = datePart.split('-');
        const formattedDateString = `${year}-${month}-${day}T${timePart}`;
        return formattedDateString;
    }

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedPractice) {
                return;
            }
            const res = await fetch(`http://localhost:5000/api/getPractice/${selectedPractice.chatId}`, {
                'method': 'get',
                'headers': {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 200) {
                await res.text().then((practice) => {
                    setMessages(JSON.parse(practice).messages.reverse().map((message, key) => {
                        if (message.isBot) {
                            return <BotMessage message={message} />
                        } else {
                            return <StudentMessage message={message} />
                        }
                    }));
                });
            }
        }

        chat.current.scrollTop = chat.current.scrollHeight;
        setLatestMessage(null);
        fetchMessages();
    }, [selectedPractice, token, latestMessage])

    const handleTimerClick = () => {
        setShowTimer(!showTimer)
    }

    const addTimeToDateString = (dateString, hoursToAdd = 0, minutesToAdd = 0) => {
        const [datePart, timePart] = dateString.split(' ');
        const [hours, minutes, seconds] = timePart.split(':').map(part => part.padStart(2, '0'));
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        const formattedString = `${datePart}T${formattedTime}`;
        const date = new Date(formattedString);

        date.setHours(date.getHours() + hoursToAdd);
        date.setMinutes(date.getMinutes() + minutesToAdd);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hoursFormatted = String(date.getHours()).padStart(2, '0');
        const minutesFormatted = String(date.getMinutes()).padStart(2, '0');
        const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    };

    const handleCloseTimesUpModal = () => {
        setShowTimesUpModal(false);
        setSelectedPractice(null);
        setSelectedTask(null)
    }

    const handleCloseEndDateModal = () => {
        setShowEndDateModal(false);
        setSelectedPractice(null);
        setSelectedTask(null)
    }


    return (
        <>
            <div id="chatFeed" className="col-9">
                <div id="me" className="d-flex align-items-center w-100">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center">
                            {/* <img className="ms-3 rounded-circle" src={selectedPractice.botPic} /> */}
                            <b className="ms-2">
                                {selectedPractice ? selectedPractice.chatId : ''}
                            </b>
                        </div>
                        {/*  */}
                        <div className="d-flex align-items-center">
                            <b className="ms-2">
                                {(selectedPractice.grade !== null && selectedPractice.feedback !== '' && !selectedPractice.active) ?
                                    (
                                        <>
                                            <span id="feedback-link" className="hyperlink">
                                                click <span id="click-here" data-bs-toggle="modal" data-bs-target="#feedbackModal">here</span>
                                                {' '}to see the grade and the teacher's feedback</span>

                                            {/* Feedback Modal */}
                                            <div className="modal fade" id="feedbackModal" tabIndex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header text-white">
                                                            <h5 className="modal-title" id="confirmModalLabel">Grade and Feedback</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body text-black">
                                                            <div>grade: {selectedPractice.grade}</div>
                                                            <div>feedback: {selectedPractice.feedback}</div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">OK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    : (<></>)}
                                {selectedPractice.active ? (
                                    <>
                                        {!isEndDatePassed ? (
                                            <>
                                                <Countdown targetDate={changeEndDateFormat(selectedPractice.endDate)}
                                                    setIsTimeUp={setIsTimeUp}
                                                    setIsEndDatePassed={setIsEndDatePassed}
                                                    purpose={'date'}
                                                    setShowModal={setShowEndDateModal}
                                                />

                                                <>
                                                    {showTimer ? (
                                                        <>
                                                            {!isTimeUp ? (
                                                                <>
                                                                    <Countdown targetDate={addTimeToDateString(
                                                                        selectedPractice.startDate, selectedPractice.durationHours,
                                                                        selectedPractice.durationMinutes)}
                                                                        setIsTimeUp={setIsTimeUp}
                                                                        purpose={'timer'}
                                                                        setShowModal={setShowTimesUpModal} />
                                                                    <button type="button"
                                                                        className="btn btn-primary"
                                                                        style={{ height: '5vh', text: 'center' }}
                                                                        onClick={handleTimerClick}>
                                                                        Hide Time
                                                                    </button>
                                                                </>
                                                            ) : ('Time\'s up!')}



                                                        </>
                                                    ) : (
                                                        <button type="button"
                                                            className="btn btn-primary"
                                                            onClick={handleTimerClick}>
                                                            Show Time
                                                        </button>
                                                    )}
                                                </>
                                            </>
                                        ) : selectedPractice.lateSubmit && !isTimeUp ? (
                                            <>
                                                Late submission is allowed
                                                <Countdown targetDate={addTimeToDateString(
                                                    selectedPractice.startDate, selectedPractice.durationHours,
                                                    selectedPractice.durationMinutes)}
                                                    setIsTimeUp={setIsTimeUp}
                                                    purpose={'timer'}
                                                    setShowModal={setShowTimesUpModal} />
                                            </>

                                        ) : selectedPractice.lateSubmit ? (
                                            'Time\'s up!'
                                        ) : (
                                                'Submission date has passed!'
                                            )}


                                        {showTimesUpModal && (
                                            <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                                                <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                                                    <div className="modal-content">
                                                        <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                                            <h5 className="modal-title text-white">Time's Up</h5>
                                                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseTimesUpModal}></button>
                                                        </div>

                                                        <div className="modal-body" style={{ color: 'black', fontWeight: 'normal' }}>
                                                            The time for this assignemnt has over. <br />
                                                            Please submit your progress before the last date of submission. <br />
                                                            <b>Submit until: {selectedPractice.endDate.split('T')[0]}
                                                                {' '}on {selectedPractice.endDate.split('T')[1]}. </b><br />
                                                            After this time you won't be allowed to submit your work. <br />
                                                            Good Luck!

                                                        </div>
                                                        <div className="modal-footer">

                                                            <button type="button" className="btn btn-primary" onClick={handleCloseTimesUpModal}>OK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        {showEndDateModal && (
                                            <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                                                <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                                                    <div className="modal-content">
                                                        <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                                            <h5 className="modal-title text-white">Missed Submission</h5>
                                                            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseEndDateModal}></button>
                                                        </div>

                                                        <div className="modal-body" style={{ color: 'black', fontWeight: 'normal' }}>
                                                            The submission date of this assignemnt has passed, and submission is no longer allowed. <br />
                                                            If you are allowed to submit late, please open again this assignemnt,
                                                            and you will be able to continue from where you stopped. <br />
                                                            If you feel you may need more time for submission, please contact your instructor. <br />
                                                            Good Luck!
                                                        </div>
                                                        <div className="modal-footer">

                                                            <button type="button" className="btn btn-primary" onClick={handleCloseEndDateModal}>OK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </>
                                ) : ('')}
                            </b>
                        </div>
                        {/*  */}
                        <button type="button"
                            className={`btn btn-danger ${(!selectedPractice.active) ? 'custom-disabled' : ''}`}
                            disabled={!selectedPractice.active ||
                                (isEndDatePassed && !selectedPractice.lateSubmit)}
                            data-bs-toggle="modal" data-bs-target="#confirmModal">
                            Submit
                        </button>
                    </div>
                </div>
                <div id="chat" ref={chat} className="w-100"> {/*the id is chat, there is no mistake*/}
                    {messages}
                </div>
                <SendMessage
                    token={token}
                    selectedPractice={selectedPractice}
                    messages={messages}
                    setMessages={setMessages}
                    setLatestMessage={setLatestMessage}
                    isTimeUp={isTimeUp}
                    isEndDatePassed={isEndDatePassed}
                />
            </div>

            {/* Confirmation Modal */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-white">
                            <h5 className="modal-title" id="confirmModalLabel">Confirm Submission</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to submit <b>{selectedPractice.chatId}</b>? This will send the result to the teacher, and no changes will be possible afterward.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => finishPractice()}>
                                Yes, Finish and Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ChatFeed;