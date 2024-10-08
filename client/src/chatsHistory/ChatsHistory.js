import { useEffect, useState } from "react";
import BotMessage from "../botMessage/BotMessage";
import StudentMessage from "../studentMessage/StudentMessage";


function ChatsHistory({ token, selectedGradeId, selectedStudent }) {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedGradeId) {
                return;
            }
            console.log(selectedGradeId);
            // const res = await fetch(`http://localhost:5000/api/getPractice/${selectedGradeId}`, {
            //     'method': 'get',
            //     'headers': {
            //         'accept': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     }
            // });

            const res = await fetch(`http://localhost:5000/api/studentPractices/${selectedStudent.userId}`,
                {
                    method: 'get',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )

            // if (res.status === 200) {
            //     res.text().then((practice) => {
            //         setMessages(JSON.parse(practice).messages.reverse().map((message, key) => {
            //             if (message.isBot) {
            //                 return <BotMessage message={message}/>
            //             } else {
            //                 return <StudentMessage message={message}/>
            //             }
            //         }));
            //     });
            // }

            if (res.status === 200) {
                res.text().then((practices) => {
                    JSON.parse(practices).map((practice, index) => {
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

                });
            }
        }
        fetchMessages();
    }, [selectedGradeId, token])

    return (
        <>
            <h5>Chat History</h5>
            {messages}
        </>
    )
}

export default ChatsHistory;