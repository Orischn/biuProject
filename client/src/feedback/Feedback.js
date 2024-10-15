import { useRef } from "react";


function Feedback({ token, selectedGradeId, selectedStudent }) {

    const feedbackBar = useRef(null);




    const createFeedback = async function (e) {
        e.preventDefault();

        const feedback = feedbackBar.current.value.trim();
        const res = await fetch('http://localhost:5000/api/createFeedback', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "userId": selectedStudent.userId,
                "chatId": selectedGradeId,
                "feedback": feedback
            })
        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                alert(errorMessage);
            })
            return;
        }

        else {
            feedbackBar.current.value = '';
        }

    }



    return (
        <>
            <h5>Feedback</h5>
            <form onSubmit={createFeedback}>
                <textarea
                    ref={feedbackBar}
                    placeholder="Enter feedback"
                    className="form-control feedback-textarea"
                    rows={3} // You can adjust this for height
                />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default Feedback;