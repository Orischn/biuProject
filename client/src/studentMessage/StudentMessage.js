

function StudentMessage({ message }) {
    return (
        <div key={message._id} dir="rtl">
            <div className="studentMessage">
                {message.content}
                <br />
                {/* <span id="textTime" className="badge text-opacity-50"></span> */}
            </div>
        </div>
    );
}

export default StudentMessage;