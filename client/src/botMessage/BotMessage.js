

function BotMessage({content}) {
    return (
        <div dir="ltr">
            <div className="botMessage">
                {content}
                <br />
                {/* <span id="textTime" className="badge text-opacity-50"></span> */}
            </div>
        </div>
    );
}

export default BotMessage;