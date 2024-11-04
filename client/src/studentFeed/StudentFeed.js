import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ChangePassword from "../changePassword/ChangePassword";
import ChatFeed from "../chatFeed/ChatFeed";
import api from "../handleTokenRefresh/HandleTokenRefresh";
import Practice from "../practice/Practice";


function StudentFeed({ token, userId }) {
    const navigate = useNavigate();
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
        await api.post('/api/finishPractice/', {
            'chatId': selectedPractice.chatId,
        });
        if (res.status === 200) {
            setSelectedTask(null);
            setSelectedPractice(null);
        } else if (res.status === 403) {
            navigate('/');
            return
        }
    }

    const refreshData = () => {
        setIsChanged(!isChanged);
    }

    useEffect(() => {
        const fetchTasks = async (yearJson) => {
            const res = await api.get(`/api/getTasks/${yearJson.year}`);
            if (res.status === 200) {
                setTaskList(res.data.reverse().map((task, key) => {
                    // if (year === task.year) {
                    return <Practice task={task} key={key}
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                        setSelectedPractice={setSelectedPractice} token={token}
                        refreshData={refreshData} />
                    // }
                }));
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }


        const fetchMyName = async (yearJson) => {
            const res = await api.get(`/api/student`);
            if (res.status === 200) {
                const user = res.data
                setFullName(user.firstName + " " + user.lastName);
                setYear(user.year);
                yearJson.year = user.year;
            } else if (res.status === 403) {
                navigate('/');
                return
            }
        }

        const yearJson = {}

        const loadData = async () => {
            await fetchMyName(yearJson);
            await fetchTasks(yearJson);
        }

        loadData();

    }, [selectedTask, token, userId, year, isChanged])

    const logout = () => {
        api.post('/api/logout/');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        navigate('/')
    }

    return (
        <>
            <div id="window" className="container">
                <div className="row">
                    <div id="practiceFeed" className="col-3" style={{ height: '100%', overflowY: "auto" }}>
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100">{fullName}</b>
                            <ChangePassword token={token} userId={userId} />
                            <a href="#" className="tooltip-test" title="logout">
                                <i className="bi bi-box-arrow-left" onClick={logout} style={{ cursor: 'pointer', color: 'white' }} />
                            </a>
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
                                selectedTask={selectedTask} finishPractice={finishPractice} latestMessage={latestMessage}
                                setLatestMessage={setLatestMessage} isTimeUp={isTimeUp}
                                setIsTimeUp={setIsTimeUp} isEndDatePassed={isEndDatePassed}
                                setIsEndDatePassed={setIsEndDatePassed}
                                setSelectedPractice={setSelectedPractice} setSelectedTask={setSelectedTask}
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