import { useEffect, useRef } from "react";

function Grade({ selectedGradeId, setSelectedGradeId, token, selectedStudent, chatId, grade, setNewGrade }) {
    var input = useRef(null);

    useEffect(() => {
        input.current.value = grade;
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
    }
    return (
        <>
            {/* <b onClick={() => setSelectedGradeId(chatId)}>Practice #{chatId}</b> <input type="number" ref={input} onChange={changeGrade} /> */}
            <div className="grade-container">
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
            </div>

        </>
    )
}

export default Grade;