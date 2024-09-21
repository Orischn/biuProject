

function Practice({ practice, selectedPractice, setSelectedPractice }) {
    return (
        <li key={practice.chatId}
            className={`list-group-item practice container ${selectedPractice && selectedPractice.chatId === practice.chatId ? 'active' : ''}`}
            onClick={() => setSelectedPractice({ practice })}>
            <div className="row">
                <div>
                    <b className="text-white w-100">Practice #{practice.chatId}</b>
                    <span className="badge date">{!practice.finished ? 'In Progress...' : 'Finished'}</span>
                    <br />
                </div>
            </div>
        </li>


    );
}

export default Practice;