import { useRef } from "react";

function Grade({token, selectedStudent, chatId, grade, setNewGrade}) {
    var input = useRef(null);

    const changeGrade = async () => {
        const res = fetch('http://localhost:5000/api/updateGrade', {
            method: 'post',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: {
                userId: selectedStudent.userId,
                chatId: chatId,
                newGrade: input.current.value
            }
        })
        if (res === 500) {
            console.log('Something Went To Shit');
            return;
        } 
        setNewGrade(input.current.value)
    }
    return (
        <>
            <b>Practice #{chatId}</b> <input ref={input} onClick={changeGrade}>{grade}</input>
        </>
    )
}

export default Grade;