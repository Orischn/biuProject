import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";


function StudentAssignment({ fullname, userId, didSubmit, taskName, refreshData, grade, year }) {
    const navigate = useNavigate();

    const [expand, setExpand] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const newDateBar = useRef(null);

    const allowLateSubmit = async function (userId, taskName) {

        const newDate = newDateBar.current.value.trim();

        if (newDate === '') {
            setError('Must choose date');
            return
        }
        const res = await api.post('/api/allowLateSubmit', {
            "taskName": taskName,
            "userId": userId,
            "endDate": new Date(newDate).getTime(),
            "year": year
        })

        if (res.status !== 200) { //error
            setIsSuccessful(false);
            setError(res.data)
        } else if (res.status === 403) {
            navigate('/');
            return
        } else {
            setIsSuccessful(true);
            setError('Changed Successfully');
            refreshData();
        }
    }

    const handleCancel = () => {
        setError('');
        setExpand(false);
    }

    return (
        <>
            <ul>
                <div className="row">
                    <div className="col-2">
                        {fullname}
                    </div>
                    <div className="col-2">
                        {userId}
                    </div>
                    {didSubmit ? (
                        <div className="col-1" style={{ color: 'green' }}>
                            {/* Submitted */}
                            <i className="bi bi-check-square" />
                        </div>
                    ) : (
                        <div className="col-1" style={{ color: 'red' }}>
                            {/* Didn't submit */}
                            <i className="bi bi-x-square" />
                        </div>
                    )}
                    {grade ? (
                        <div className="col-2">
                            grade: {grade}
                        </div>
                    ) : (
                        <div className="col-2">
                            no grade given
                        </div>
                    )}

                    <div className="col-4">
                        {didSubmit ? ('') : (
                            !expand ? (
                                <button className="btn btn-success" disabled={didSubmit}
                                    onClick={() => setExpand(true)}>Allow late submit</button>
                            ) : (
                                <>
                                    <div>
                                        <input ref={newDateBar} type="datetime-local" style={{ width: "65%", paddingLeft: '10%' }} />
                                        &nbsp;
                                        <i className="bi bi-x-lg" onClick={handleCancel}
                                            style={{ cursor: 'pointer', color: 'red' }} />
                                        &nbsp;
                                        <i className="bi bi-check-lg" onClick={() => allowLateSubmit(userId, taskName)}
                                            style={{ cursor: 'pointer', color: 'green' }} />
                                    </div>
                                    {error &&
                                        <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert"
                                            style={{ padding: '5px 10px', lineHeight: '1.2', fontSize: '14px' }}>
                                            {error}
                                        </span>}
                                </>
                            )
                        )}
                    </div>
                </div>
            </ul>
        </>
    );
}

export default StudentAssignment;