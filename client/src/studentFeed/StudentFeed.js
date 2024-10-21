import { useEffect, useState } from "react";
import AddPractice from "../addPractice/AddPractice";
import ChatFeed from "../chatFeed/ChatFeed";
import Practice from "../practice/Practice";
import ChangePassword from "../changePassword/ChangePassword";
import biulogo3 from "./biulogo3.png"


function StudentFeed({ token, userId }) {
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [fullName, setFullName] = useState("");
    const [latestMessage, setLatestMessage] = useState(null);
    const [year, setYear] = useState(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isEndDatePassed, setIsEndDatePassed] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const finishPractice = async () => {
        const res = await fetch('https://localhost:5000/api/finishPractice/', {
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
        console.log(selectedPractice.chatId)
        setSelectedTask(null);
        setSelectedPractice(null);
    }

    const refreshData = () => {
        setIsChanged(!isChanged);
    }

    useEffect(() => {

        const fetchTasks = async () => {
            const res = await fetch('https://localhost:5000/api/getTasks', {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                await res.text().then((tasks) => {
                    setTaskList(JSON.parse(tasks).reverse().map((task, key) => {
                        if (year === task.year) {
                            return <Practice task={task} key={key}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                setSelectedPractice={setSelectedPractice} token={token}
                                refreshData={refreshData} />
                        }
                    }));
                });
            }
        }


        const fetchMyName = async () => {
            const res = await fetch(`https://localhost:5000/api/student`, {
                method: 'get',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                await res.text().then((user) => {
                    setFullName(JSON.parse(user).firstName + " " + JSON.parse(user).lastName);
                    setYear(JSON.parse(user).year);
                });
            }
        }

        fetchMyName();
        fetchTasks();
    }, [selectedTask, token, userId, year, isChanged])


    return (
        <>
            <div id="window" className="container">
                <div className="row">
                    <div id="practiceFeed" className="col-3" style={{ height: '100vh', overflowY: "auto" }}>
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100">{fullName}</b>

                            <ChangePassword token={token} userId={userId} />
                        </div>
                        <div className="d-flex align-items-center">
                            <br />
                        </div>
                        <div >
                            {taskList}
                        </div>
                    </div>
                    {selectedPractice ? (
                        <>
                            {/* <AddPractice token={token} selectedTask={selectedTask}
                             setSelectedTask={setSelectedTask} /> */}
                            <ChatFeed token={token} selectedPractice={selectedPractice}
                                finishPractice={finishPractice} latestMessage={latestMessage}
                                setLatestMessage={setLatestMessage} isTimeUp={isTimeUp}
                                setIsTimeUp={setIsTimeUp} isEndDatePassed={isEndDatePassed} 
                                setIsEndDatePassed={setIsEndDatePassed}
                                />
                        </>
                    ) : (

                        <>
                            {/* placeholder */}

                            {/* <img src={biulogo3} style={{width: "30%", height: "50vh"}}/> */}
                        </>
                    )}

                </div>
            </div>
        </>

    );
}

export default StudentFeed;