import BotMessage from "../botMessage/BotMessage";
import SendMessage from "../sendMessage/SendMessage";
import StudentMessage from "../studentMessage/StudentMessage";

const { useState, useEffect, useRef } = require("react");

function ChatFeed({ token, selectedPractice, finishPractice, latestMessage, setLatestMessage }) {
    const [messages, setMessages] = useState([]);
    const chat = useRef(null);

    useEffect(() => {
        chat.current.scrollTop = chat.current.scrollHeight;
        setLatestMessage(null);
    }, [selectedPractice, latestMessage])

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
                });
            }
        }
        fetchMessages();
    }, [selectedPractice, token])

    return (
        <>
            <div id="chatFeed" className="col-9">
                <div id="me" className="d-flex align-items-center w-100">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center">
                            <b className="ms-2 text-black-50">
                                {selectedPractice ? selectedPractice.chatId : ''}
                            </b>
                        </div>
                        <button type="button"
                            className={`btn btn-danger ${!selectedPractice.active ? 'custom-disabled' : ''}`}
                            disabled={!selectedPractice.active}
                            data-bs-toggle="modal" data-bs-target="#confirmModal">
                            Finish Practice
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
                />
            </div>

            {/* Confirmation Modal */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmModalLabel">Confirm Finish Practice</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to finish this practice? This will send the result to the teacher, and no changes will be possible afterward.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => finishPractice()}>
                                Yes, Finish and Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ChatFeed;