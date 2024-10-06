

function Practice({ practice, selectedPractice, setSelectedPractice }) {
    return (
        <li key={practice.chatId}
            className={`list-group-item practice container
                ${selectedPractice && selectedPractice.chatId === practice.chatId ? 'active' : ''}
                ${practice.finished ? 'muted' : ''}`}
            onClick={() => {
                if (!practice.finished) {
                    setSelectedPractice(practice);
                }
            }}>
            <div className="row">
                <div>
                    <b className="text-black w-100">Practice #{practice.chatId}</b>
                    <span className="text-black badge date">{!practice.finished ? 'In Progress...' : 'Finished'}</span>
                    <br />
                </div>
            </div>
        </li>
    );
}

export default Practice;