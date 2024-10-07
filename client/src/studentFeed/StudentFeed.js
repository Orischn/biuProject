import { useEffect, useState } from "react";
import AddPractice from "../addPractice/AddPractice";
import ChatFeed from "../chatFeed/ChatFeed";
import Practice from "../practice/Practice";



function StudentFeed({ token, userId }) {
    const [practiceList, setPracticeList] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [fullName, setFullName] = useState("");

    const finishPractice = async () => {
        const res = await fetch('http://localhost:5000/api/finishPractice/', {
            'method': 'post',
            'headers': {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                'chatId': selectedPractice.chatId,
            }),
        });
    }

    useEffect(() => {
        const fetchPractices = async () => {
            const res = await fetch('http://localhost:5000/api/getPractices', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((practices) => {
                    setPracticeList(JSON.parse(practices).map((practice, key) => {
                        return <Practice practice={practice} key={key}
                            selectedPractice={selectedPractice}
                            setSelectedPractice={setSelectedPractice} />
                    }));
                });
            }
        }

        const fetchMyName = async () => {
            const res = await fetch(`http://localhost:5000/api/student`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                res.text().then((user) => {
                    setFullName(JSON.parse(user).firstName + " " + JSON.parse(user).lastName);
                });
            }
        }

        fetchMyName();
        fetchPractices();
    }, [selectedPractice, token, userId])

    

    return (
        <>
            <div id="window" className="container">
                <div className="row">
                    <div id="practiceFeed" className="col-3">
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100 text-black-50">{fullName}</b>
                            <AddPractice token={token} setSelectedPractice={setSelectedPractice} />
                        </div>
                        <div className="d-flex align-items-center">
                            <br />
                        </div>
                        {practiceList}
                    </div>
                    {selectedPractice ?
                        <ChatFeed token={token} selectedPractice={selectedPractice} 
                        finishPractice={finishPractice} /> :
                        <>placeholder</>
                }

                </div>
            </div>
        </>

    );
}

export default StudentFeed;