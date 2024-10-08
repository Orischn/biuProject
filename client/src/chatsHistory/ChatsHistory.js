

function ChatsHistory() {


    return (
        <div id="chatHistory" className="w-100 mt-3">
            <h5>Chat History</h5>
            <div dir="ltr">
                <div className="teacherMessage">
                    Please submit your assignment on time.
                </div>
            </div>
            <div dir="rtl">
                <div className="studentMessage">
                    Sorry, I had some issues but I will submit soon.
                </div>
            </div>
        </div>
    )
}

export default ChatsHistory;