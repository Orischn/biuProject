import { useRef } from "react";
import { useNavigate } from "react-router";
import BotMessage from "../botMessage/BotMessage";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import StudentMessage from "../studentMessage/StudentMessage";

function SendMessage({ token, selectedPractice, messages, setMessages, setLatestMessage, isTimeUp, isEndDatePassed }) {
    const navigate = useNavigate();
    const typeBar = useRef(null);
    const send = async (e) => {

        e.preventDefault();
        if (typeBar.current.value.trim() === '') {
            return;
        }
        const content = typeBar.current.value.trim();
        const message = { content: content }
        setLatestMessage(message);
        setMessages(messages => [...messages, <StudentMessage message={message} />]);
        typeBar.current.value = '';
        const res = await api.post(`/api/sendMessage/`, {
            'chatId': selectedPractice.chatId,
            'year': selectedPractice.year,
            "msg": content,
        })
        if (res.status === 500) {
            setMessages(messages.slice(0, -1));
        } else if (res.status === 403) {
            navigate('/');
            return
        } else if (res.status === 200) {
            setMessages(messages => [...messages, <BotMessage message={res.data} />]);
        }
        setLatestMessage(message);

    }


    return (
        <div className="d-flex">
            <span id="messageBar" className="input-group">
                <form onSubmit={send} className="input-group">
                    <input ref={typeBar}
                        className={`form-control input ${(!selectedPractice.active || isTimeUp ||
                            (isEndDatePassed && !selectedPractice.lateSubmit)
                        ) ? 'custom-disabled' : ''}`}
                        placeholder="Type a message"
                        disabled={!selectedPractice.active || isTimeUp ||
                            (isEndDatePassed && !selectedPractice.lateSubmit)
                        } />
                    <button id="sendButton" type="submit"
                        className={`btn ${(!selectedPractice.active || isTimeUp) ? 'custom-disabled' : ''}`}
                        disabled={!selectedPractice.active || isTimeUp ||
                            (isEndDatePassed && !selectedPractice.lateSubmit)
                        }>
                        <i className="bi bi-send" style={{ color: 'black' }} />
                    </button>
                </form>
            </span>
        </div>
    );
}

export default SendMessage;