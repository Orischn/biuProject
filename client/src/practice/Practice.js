

function Practice({ numOfPractice, active, messages, selectedPractice, setSelectedPractice }) {
    return (
        <li key={numOfPractice}
            className={`list-group-item practice container ${selectedPractice && selectedPractice.numOfPractice === numOfPractice ? 'active' : ''}`}
            onClick={() => setSelectedPractice({ numOfPractice, messages })}>
            <div className="row">
                <div>
                    <b className="text-white w-100">bott</b>
                    <span className="badge date">{active ? 'In Progress...' : 'Finished'}</span> {/* maybe in progress?*/}
                    <br />
                </div>
            </div>
        </li>


    );
}

export default Practice;