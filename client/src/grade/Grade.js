import { useEffect, useRef, useState } from "react";

function Grade({ selectedGradeId, setSelectedGradeId, token, selectedStudent, chatId, grade, setNewGrade }) {

    var input = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (input.current) {
            input.current.value = grade;
        }
    }, [grade]);

    const changeGrade = async () => {

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
                        <span className="grade-display">{grade}</span>
                        <i className="bi bi-pencil" aria-hidden="true" onClick={handleEditClick}></i>
                    </>
                ) : (
                    <>
                        <input
                            className="grade-input"
                            type="number"
                            min="0"
                            max="100"
                            ref={input} />
                        <button className="save-btn" onClick={changeGrade}>
                            Save
                        </button>
                    </>
                )}
            </div>
        </>

    )
}

export default Grade;