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
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const finishPractice = async () => {
        const res = await api.post('/api/finishPractice/', {
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

    useEffect(() => {
        const fetchTasks = async (yearJson) => {
            const res = await api.get(`/api/getTasks/${yearJson.year}`);
            if (res.status === 200) {
                setTaskList(res.data.reverse().map((task, key) => {
                    return <Practice task={task} key={key}
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                        setSelectedPractice={setSelectedPractice} token={token} />
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

    }, [selectedTask, token, userId, year])

    const logout = () => {
        api.post('/api/logout/');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        navigate('/')
        setShowLogoutModal(false);
    }

    const handleCancel = () => {
        setShowLogoutModal(false);
    }

    return (
        <>
            <div id="window" className="container">
                <div className="row">
                    <div id="practiceFeed" className="col-3" style={{ height: '100%', overflowY: "auto" }}>
                        <div id="me" className="d-flex align-items-center w-100">
                            <b className="ms-2 w-100">{fullName}</b>
                            <ChangePassword userId={userId} />
                            <a href="#" className="tooltip-test" title="logout">
                                <i className="bi bi-box-arrow-left" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer', color: 'white' }} />
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
                        </>
                    )}

                </div>
            </div>
            {/* Modal */}
            {showLogoutModal && (
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">LOGOUT</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to logout from the system?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>No, stay</button>
                                <button type="button" className="btn btn-danger"
                                    onClick={logout}>Yes, logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}

export default StudentFeed;