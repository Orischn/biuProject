import { useEffect, useState } from "react";
import Practice from "../practice/Practice";
import ChatFeed from "../chatFeed/ChatFeed";
import AddPractice from "../addPractice/AddPractice";



function StudentFeed({ token, username }) {
    const [practiceList, setPracticeList] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState(null);

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

    useEffect(() => {
        fetchPractices();
    }, [selectedPractice])

    function finishPractice() {
        
    }

    return (
    <>
        <div id="window" className="container">
            <div className="row">
                <div id="practiceFeed" className="col-3">
                    <div id="me" className="d-flex align-items-center w-100">
                        <b className="ms-2 w-100 text-black-50">{username}</b>
                        <AddPractice token={token} practiceList={practiceList} setPracticeList={setPracticeList}
                        selectedPractice={selectedPractice} setSelectedPractice={setSelectedPractice}/>
                    </div>
                    <div className="d-flex align-items-center">
                        <br />
                    </div>
                    {practiceList}
                </div>
                <ChatFeed token={token} botID={selectedPractice && selectedPractice.chatId}
                finishPractice={finishPractice}/>
            </div>
        </div>
    </>

    );
}

export default StudentFeed;