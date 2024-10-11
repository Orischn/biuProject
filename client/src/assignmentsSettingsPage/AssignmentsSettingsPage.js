import { useState } from "react";

function AssignmentsSettingsPage({ token }) {
    const [error, setError] = useState('')

    return (
        <>
            <h2 className="settings-title">Manage Assignments</h2>
            <div className="settings-container">
            <span><i className="bi bi-plus-circle"></i>create new assignment</span>
                <ul className="setting-item">
                    {/* <SearchStudent filter={filter} setFilter={setFilter} /> */}
                </ul>

                {/* {studentList} */}

            </div>
        </>
    )
}

export default AssignmentsSettingsPage