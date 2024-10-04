import { useRef } from "react";
import BotMessage from "../botMessage/BotMessage";
import StudentMessage from "../studentMessage/StudentMessage";

function SendMyMessage({ token, selectedPractice, messages, setMessages }) {

    const typeBar = useRef(null);
    const send = async (e) => {

        e.preventDefault();
        if (typeBar.current.value.trim() === '') {
            return;
        }
        const content = typeBar.current.value.trim();
        const message = {content: content}
        setMessages(messages => [...messages, <StudentMessage message={message} />]);
        typeBar.current.value = '';
        const res = await fetch(`http://localhost:5000/api/sendMessage/`, {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                'chatId': selectedPractice.chatId,
                "msg": content,
            })
        })
        if (res.status === 500) {
            setMessages(messages.slice(0, -1));
        }

        if (res.status === 200) {
            res.text().then((message) => {
                setMessages(messages => [...messages, <BotMessage message={JSON.parse(message)} />]);
            })
        }
        
    }
    

    return (
        <div className="d-flex">
            <span id="messageBar" className="input-group">
                <form onSubmit={send} className="input-group">
                    <input ref={typeBar} className="form-control input" placeholder="Type a message" />
                    <button id="sendButton" type="submit" className="btn">
                        <i className="bi bi-send" />
                    </button>
                </form>
            </span>
        </div>
    );
}

export default SendMyMessage;