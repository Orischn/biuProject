import { useEffect, useRef, useState } from "react";
import Feedback from "../feedback/Feedback";

function Grade({ selectedGradeId, setSelectedGradeId, token, selectedStudent, chatId, grade, setNewGrade, isActive }) {

    var input = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (input.current) {
            input.current.value = grade;
        }
    }, [grade]);

    const changeGrade = async () => {

        if (!input.current.value.trim()) {
            alert('grade must be a number')
            return;
        }

        const res = await fetch('http://localhost:5000/api/updateGrade/', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": selectedStudent.userId,
                "chatId": chatId,
                "newGrade": input.current.value
            })
        })
        if (res === 500) {
            res.text().then((error) => alert(error));
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
                            {/* <span id="feedback" className="w-100 mt-3"> */}
                            <Feedback token={token} selectedGradeId={selectedGradeId} selectedStudent={selectedStudent} />
                            {/* </span> */}
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
                                placeholder={`${grade}`} />
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