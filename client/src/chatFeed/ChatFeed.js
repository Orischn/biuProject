import BotMessage from "../botMessage/BotMessage";
import Countdown from "../countdown/Countdown";
import SendMessage from "../sendMessage/SendMessage";
import StudentMessage from "../studentMessage/StudentMessage";

const { useState, useEffect, useRef, useCallback } = require("react");

function ChatFeed({ token, selectedPractice, finishPractice, latestMessage, setLatestMessage }) {
    const [messages, setMessages] = useState([]);
    const [grade, setGrade] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [showTimer, setShowTimer] = useState(true);
    const [isTimeUp, setIsTimeUp] = useState(false);

    const chat = useRef(null);

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
                res.text().then((practice) => {
                    setMessages(JSON.parse(practice).messages.reverse().map((message, key) => {
                        if (message.isBot) {
                            return <BotMessage message={message} />
                        } else {
                            return <StudentMessage message={message} />
                        }
                    }));
                    setGrade(JSON.parse(practice).grade);
                    setFeedback(JSON.parse(practice).feedback);
                });
            }
        }

        chat.current.scrollTop = chat.current.scrollHeight;
        setLatestMessage(null);
        fetchMessages();
    }, [selectedPractice, token, latestMessage])

    const handleSeeFeedbackClick = useCallback(() => {
        alert(`Maybe this should be in a modal, but for now...\n
            your grade is: ${selectedPractice.grade}\n
            And the feedback of the teacher is: \n 
            ${selectedPractice.feedback}`);
    }, []);

    const handleTimerClick = () => {
        setShowTimer(!showTimer)
    }

    const addMinutesToDateString = (dateString, minutesToAdd) => {
        // Split the date and time part from the string
        const [datePart, timePart] = dateString.split(' ');

        // Split the time into hours, minutes, and seconds, and pad each part to ensure it's 2 digits
        const [hours, minutes, seconds] = timePart.split(':').map(part => part.padStart(2, '0'));

        // Reconstruct the time part with padded values
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        // Create a valid ISO string by combining the date and padded time
        const formattedString = `${datePart}T${formattedTime}`;

        // Parse the formatted string into a Date object
        const date = new Date(formattedString);

        // Add the specified number of minutes
        date.setMinutes(date.getMinutes() + minutesToAdd);

        // Format the result in yyyy-mm-ddThh:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hoursFormatted = String(date.getHours()).padStart(2, '0');
        const minutesFormatted = String(date.getMinutes()).padStart(2, '0');
        const secondsFormatted = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    };


    return (
        <>
            <div id="chatFeed" className="col-9">
                <div id="me" className="d-flex align-items-center w-100">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center">
                            <b className="ms-2">
                                {selectedPractice ? selectedPractice.chatId : ''}
                            </b>
                        </div>
                        {/*  */}
                        <div className="d-flex align-items-center">
                            <b className="ms-2">
                                {(selectedPractice.grade && selectedPractice.feedback !== '') ?
                                    (
                                        <>
                                            <span id="feedback-link" class="hyperlink">
                                                click <span id="click-here" onClick={handleSeeFeedbackClick}>here</span> to see the grade and the teacher's feedback
                                            </span>
                                        </>
                                    )
                                    : (<></>)}
                                {selectedPractice.active ? (
                                    <>
                                        {/* {isTimeUp ? (
                                            <><div>times over man</div></>
                                        ) : (
                                            <>you good</>
                                        )} */}
                                        {showTimer ? (
                                            <>
                                                <Countdown targetDate={addMinutesToDateString(
                                                    selectedPractice.startDate, selectedPractice.duration)}
                                                    setIsTimeUp={setIsTimeUp} />
                                                <button type="button"
                                                    className="btn btn-primary"
                                                    style={{ height: '5vh', text: 'center' }}
                                                    onClick={handleTimerClick}>
                                                    Hide Time
                                                </button>
                                            </>
                                        ) : (
                                            <button type="button"
                                                className="btn btn-primary"
                                                onClick={handleTimerClick}>
                                                Show Time
                                            </button>
                                        )}

                                    </>
                                ) : ('')}
                            </b>
                        </div>
                        {/*  */}
                        <button type="button"
                            className={`btn btn-danger ${(!selectedPractice.active) ? 'custom-disabled' : ''}`}
                            disabled={!selectedPractice.active}
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