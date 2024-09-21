

function Practice({ practice, selectedPractice, setSelectedPractice }) {
    return (
        <li key={practice.id}
            className={`list-group-item practice container ${selectedPractice && selectedPractice.numOfPractice === numOfPractice ? 'active' : ''}`}
            onClick={() => setSelectedPractice({ practice })}>
            <div className="row">
                <div>
                    <b className="text-white w-100">Practice #{practice.id}</b>
                    <span className="badge date">{!practice.finished ? 'In Progress...' : 'Finished'}</span>
                    <br />
                </div>
            </div>
        </li>


    );
}

export default Practice;