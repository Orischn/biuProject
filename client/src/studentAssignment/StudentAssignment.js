import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";


function StudentAssignment({ token, fullname, userId, didSubmit, canSubmitLate,
    taskName, refreshData, grade }) {
        const navigate = useNavigate();
        
        const [expand, setExpand] = useState(false);
        const [error, setError] = useState('');
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
                "newDate": new Date(newDate).getTime()
            })
            
            if (res.status !== 200) { //error
                alert(res.data)
            } else if (res.status === 403) {
                navigate('/');
                return
            } else {
                refreshData();
            }
        }
        
        const handleCancel = () => {
            setError('');
            setExpand(false);
        }
        
        const cancelLateSubmit = async function (userId, taskName) {
            const res = await api.post('/api/cancelLateSubmit', {
                "taskName": taskName,
                "userId": userId
            })
            
            if (res.status !== 200) {
                setError(res.data)
            } else if (res.status === 403) {
                navigate('/');
                return
            } else {
                setError('')
                refreshData();
            }
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
                    // !canSubmitLate ? (
                    //     <button className="btn btn-success" disabled={didSubmit}
                    //         onClick={() => setExpand(true)}>Allow late submit</button>
                    // ) : (
                    //     <button className="btn btn-danger" disabled={didSubmit}
                    //         onClick={() => cancelLateSubmit(userId, taskName)}>cancel late submit</button>
                    // )
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
                        <span className="alert alert-danger w-50" role="alert"
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