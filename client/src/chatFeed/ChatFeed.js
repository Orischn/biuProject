const BOTMESSAGE = 0;
const HUMANMESSAGE = 1;
const { useState } = require("react");

function ChatFeed({ token, botID }) {
    const [messages, setMessages] = useState([]);

    useEffect(async () => {
        const res = await fetch(`http://localhost:5000/api/practice/${botID}`, {
            'method': 'get',
            'headers': {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (res.status === 200) {
            res.text().then((practice) => {
                setMessages(JSON.parse(practice).messages.map((message, key) => {
                    if (message.type == BOTMESSAGE) {
                        return <BotMessage content={message.content} />
                    } else {
                        return <StudentMessage content={message.content} />
                    }
                }));
            });
        }
    })

    return (
        <>
            <div id="chatFeed" class="col-9">
                <div id="me" class="d-flex align-items-center w-100">
                    <b class="ms-2 text-black-50">bot</b>
                </div>
                {messages}
                        
            </div>
        </>
    )
}