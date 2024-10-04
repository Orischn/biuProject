import { useEffect, useRef } from "react";

function Grade({token, selectedStudent, chatId, grade, setNewGrade}) {
    var input = useRef(null);

    useEffect(() => {
        input.current.value = grade;
    }, grade);

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
            <b>Practice #{chatId}</b> <input type="number" ref={input} onChange={changeGrade} />
        </>
    )
}

export default Grade;