import { useEffect, useState } from "react";
import Practice from "../practice/Practice";
import ChatFeed from "../chatFeed/ChatFeed";
import AddPractice from "../addPractice/AddPractice";



function StudentFeed({ token, username }) {
    const [practiceList, setPracticeList] = useState([]);
    const [selectedPractice, setSelectedPractice] = useState(null);

    useEffect(() => {
        const fetchPractices = async () => {
            const res = await fetch('http://localhost:5000/api/practices', {
                'method': 'get',
                'headers': {
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
        fetchPractices();
    }, [])

    return (
    <>
        <div id="window" class="container">
            <div class="row">
                <div id="practiceFeed" class="col-3">
                    <div id="me" class="d-flex align-items-center w-100">
                        <b class="ms-2 w-100 text-black-50">{username}</b>
                        <AddPractice token={token} practiceList={practiceList} setPracticeList={setPracticeList}/>
                    </div>
                    <div class="d-flex align-items-center">
                        <br />
                    </div>
                    {practiceList}
                </div>
                <ChatFeed />
            </div>
        </div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
    </>

    );
}

export default StudentFeed;