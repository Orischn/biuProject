function SendMessage() {
    return (
        <>
            <div className="d-flex">
                <span id="messageBar" className="input-group">
                    <input className="form-control inputText" placeholder="Type a message" />
                    <button type="submit" className="btn"><i className="bi bi-send"></i></button>
                </span>
            </div>
        </>
    )
}