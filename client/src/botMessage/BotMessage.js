function BotMessage({ message }) {
    return (
        <div dir="ltr" key={message._id}>
            <div className="botMessage">
                {message.content}
            </div>
        </div>
    );
}

export default BotMessage;