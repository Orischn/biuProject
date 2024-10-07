

function Practice({ practice, selectedPractice, setSelectedPractice }) {
    return (
        <li key={practice.chatId}
            className={`list-group-item practice container
                ${selectedPractice && selectedPractice.chatId === practice.chatId ? 'active' : ''}
                ${!practice.active ? 'text-muted' : ''}`} //doesn't work
            onClick={() => {
                // if (practice.active) { // necessary checking? can be chosen even when not active
                    setSelectedPractice(practice);
                // }
            }}>
            <div className="row">
                <div>
                    <b className="text-black w-100">Practice #{practice.chatId}</b>
                    <span className="text-black badge date">{practice.active ? 'In Progress...' : 'Finished'}</span>
                    <br />
                </div>
            </div>
        </li>
    );
}

export default Practice;