import { useEffect, useRef, useState } from "react";
import Feedback from "../feedback/Feedback";

function Grade({ selectedGradeId, setSelectedGradeId, token, selectedStudent, chatId, grade, feedback, setNewGrade, isActive, refreshData }) {

    var input = useRef(null);

    const [inputGrade, setInputGrade] = useState(null);

    const handleChange = (e) => {
        const value = e.target.value;

        // Allow only numeric input and enforce range between 0 and 100
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setInputGrade(value);
        }

        // maybe she would like to cancel the grade???
        else if (value === "") {
            // Allow clearing the input field
            setInputGrade("");
        }
    };

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (input.current) {
            input.current.value = grade;
        }
    }, [grade]);

    const changeGrade = async () => {

        // if (input.current.value.trim() === '') {
        //     alert('must enter a valid grade');
        //     return;
        // }

        const gradeValue = Number(input.current.value.trim());

        if (isNaN(gradeValue) || gradeValue < 0 && gradeValue > 100) {
            alert('grade must be a number between 0 to 100')
            return;
        }

        const res = await fetch('https://localhost:5000/api/updateGrade/', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": selectedStudent.userId,
                "chatId": chatId,
                "newGrade": gradeValue
            })
        })
        if (res === 500) {
            await res.text().then((error) => alert(error));
            return;
        }
        setNewGrade(input.current.value)
        setIsEditing(false);
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };


    return (
        <>
            {/* <div className="grade-container">
                <button className="grade-title" onClick={() => setSelectedGradeId(chatId)}>
                    Practice #{chatId}
                </button>
                <input
                    type="number"
                    ref={input}
                    className="grade-input"
                    onChange={changeGrade}
                    placeholder="Enter grade"
                />
            </div> */}
            <div className="grade-container">
                {!isEditing ? (
                    <>
                        <div className="grade-title">{chatId}</div>
                        <div className="grade-content" onClick={() => setSelectedGradeId(chatId)}>
                            Click to check
                        </div>
                        <div className="grade-feedback">
                            <span className="grade-display">
                                {grade ?
                                    (
                                        <>
                                            Grade: {grade}
                                        </>
                                    ) :
                                    ('')}
                            </span>
                            <i className="bi bi-pencil" aria-hidden="true" onClick={handleEditClick}></i>
                            <Feedback token={token} chatId={chatId} feedback={feedback}
                                selectedStudent={selectedStudent} refreshData={refreshData} />
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
                                value={inputGrade}
                                onChange={handleChange} />
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