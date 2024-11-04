import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BotMessage from "../botMessage/BotMessage";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import StudentMessage from "../studentMessage/StudentMessage";


function ChatsHistory({ token, selectedGradeId, selectedStudent }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedGradeId) {
                return;
            }
            const res = await api.get(`/api/studentPractices/${selectedStudent.userId}`)

            if (res.status === 200) {
                res.data.map((practice, key) => {
                    if (practice.chatId === selectedGradeId) {
                        setMessages((practice).messages.reverse().map((message, key) => {
                            if (message.isBot) {
                                return <BotMessage message={message} />
                            } else {
                                return <StudentMessage message={message} />
                            }
                        }));
                    }
                })
            } else if (res.status === 403) {
                navigate('/');
                return;
            }
        }
        fetchMessages();
    }, [selectedGradeId, token, selectedStudent])

    return (
        <>
            {selectedGradeId ?
                <>
                    <h5>Chat History - {selectedGradeId}</h5>
                    {messages}
                </> :
                <></>}
        </>
    )
}

export default ChatsHistory;