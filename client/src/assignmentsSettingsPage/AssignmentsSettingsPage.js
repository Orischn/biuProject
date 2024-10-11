import { useState } from "react";
import AssignmentDetails from "../assignment/AssignmentDetails";
import AddAssignment from "../addAssignment/AddAssignment";

function AssignmentsSettingsPage({ token }) {
    const [error, setError] = useState('')

    return (
        <>
            <h2 className="settings-title">Manage Assignments</h2>
            <div className="settings-container">
                <AddAssignment token={token} />
                <AssignmentDetails name={"ass1"} numOfSubmits={15} numOfAssigned={30} timeTillEnd={5} />
                <AssignmentDetails name={"ass2"} numOfSubmits={6} numOfAssigned={30} timeTillEnd={10} />
                <AssignmentDetails name={"ass3"} numOfSubmits={7} numOfAssigned={30} timeTillEnd={15} />
                <AssignmentDetails name={"ass4"} numOfSubmits={1} numOfAssigned={30} timeTillEnd={20} />


            </div>
        </>
    )
}

export default AssignmentsSettingsPage