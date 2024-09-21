

function Practice({ practice, selectedPractice, setSelectedPractice }) {
    return (
        <li key={practice.chatID}
            className={`list-group-item practice container ${selectedPractice && selectedPractice.chatID === practice.chatID ? 'active' : ''}`}
            onClick={() => setSelectedPractice({ practice })}>
            <div className="row">
                <div>
                    <b className="text-white w-100">Practice #{practice.chatID}</b>
                    <span className="badge date">{!practice.finished ? 'In Progress...' : 'Finished'}</span>
                    <br />
                </div>
            </div>
        </li>


    );
}

export default Practice;