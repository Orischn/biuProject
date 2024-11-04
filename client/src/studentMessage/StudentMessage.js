
function StudentMessage({ message }) {
    return (
        <div key={message._id} dir="rtl">
            <div className="studentMessage">
                {message.content}
                <br />
            </div>
        </div>
    );
}

export default StudentMessage;