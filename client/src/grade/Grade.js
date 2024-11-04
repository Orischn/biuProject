import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Feedback from "../feedback/Feedback";
import api from "../handleTokenRefresh/HandleTokenRefresh";

function Grade({ setSelectedGradeId, selectedStudent, chatId, grade, feedback,
    setNewGrade, isActive, refreshData, year }) {
    const navigate = useNavigate();
    var input = useRef(null);

    const [inputGrade, setInputGrade] = useState(grade);

    const handleChange = (e) => {
        const value = e.target.value;

        // Allow only numeric input and enforce range between 0 and 100
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setInputGrade(value);
        }

        // maybe she would like to cancel the grade???
        else if (value === "") {
            setInputGrade("");
        }
    };

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsEditing(false);
    }, [selectedStudent]);

    const handleCancel = () => {
        setIsEditing(false);
    }

    const changeGrade = async () => {

        let gradeValue;
        if (input.current.value.trim() !== '') {
            gradeValue = Number(input.current.value.trim());

            if (isNaN(gradeValue) || gradeValue < 0 && gradeValue > 100) {
                alert('grade must be a number between 0 to 100')
                return;
            }
        } else {
            gradeValue = null;
        }

        const res = await api.post('/api/updateGrade/', {
            "userId": selectedStudent.userId,
            "chatId": chatId,
            "newGrade": gradeValue,
        })
        if (res === 500) {
            alert(res.data);
            return;
        } else if (res.status === 403) {
            navigate('/');
            return
        }
        setNewGrade(input.current.value)
        setIsEditing(false);
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div className="grade-container">
                {!isEditing ? (
                    <>
                        <div className="grade-title">{chatId}</div>
                        {!isActive ? (
                            <>
                                <span style={{ color: 'green' }}>Submitted!&nbsp;</span>
                                <span className="grade-content" onClick={() => setSelectedGradeId(chatId)}>
                                    Click to check
                                </span>
                            </>
                        ) : (
                            <>
                                <div style={{ color: 'red' }}>
                                    Hasn't been sumbitted yet
                                </div>
                            </>
                        )}
                        <div className="grade-feedback">
                            <span className="grade-display">
                                {grade !== null ?
                                    (
                                        <>
                                            Grade: {grade}
                                        </>
                                    ) :
                                    ('')}
                            </span>
                            <i className="bi bi-pencil" aria-hidden="true" onClick={handleEditClick} style={{ cursor: 'pointer' }}></i>
                            <Feedback chatId={chatId} feedback={feedback}
                                selectedStudent={selectedStudent} refreshData={refreshData}
                                year={year} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grade-title">{chatId}</div>
                        <div>
                            Give the desired grade
                        </div>
                        <div className="grade-feedback">
                            <input
                                className="grade-input"
                                type="text"
                                min="0"
                                max="100"
                                ref={input}
                                onChange={handleChange} />
                            <i className="bi bi-x-lg" style={{ cursor: 'pointer' }} onClick={handleCancel} />
                            <button className="save-btn" onClick={changeGrade}>
                                Save
                            </button>
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default Grade;