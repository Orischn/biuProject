function SendMessage() {
    return (
        <>
            <div class="d-flex">
                <span id="messageBar" class="input-group">
                    <input class="form-control inputText" placeholder="Type a message" />
                    <button type="submit" class="btn"><i class="bi bi-send"></i></button>
                </span>
            </div>
        </>
    )
}