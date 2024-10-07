import BotMessage from "../botMessage/BotMessage";
import SendMessage from "../sendMessage/SendMessage";
import StudentMessage from "../studentMessage/StudentMessage";

const { useState, useEffect } = require("react");

function ChatFeed({ token, selectedPractice, finishPractice }) {
    const [messages, setMessages] = useState([]);

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
                            return <BotMessage message={message}/>
                        } else {
                            return <StudentMessage message={message}/>
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
                            {selectedPractice ? selectedPractice.chatId : ''}</b>
                    </div>
                    <button className={`btn btn-danger ${!selectedPractice.active ? 'custom-disabled' : ''}`}
                    disabled={!selectedPractice.active}
                    onClick={finishPractice}>finish practice</button>
                </div>
            </div>
            <div id="chat" className="w-100">  {/*the id is chat, there is no mistake*/}
                {messages}
            </div>
            <SendMessage token={token} selectedPractice={selectedPractice}
            messages={messages} setMessages={setMessages} />
        </div>
        </>
    )
}

export default ChatFeed;