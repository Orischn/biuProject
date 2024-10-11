import { useState } from "react";


function AssignmentDetails({ token, name, numOfSubmits, numOfAssigned, timeTillEnd }) {


    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            {!isEditing ? (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            {name}
                        </div>
                        <div className="col-4">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-4">
                            {/* needs to be input so we could edit? like in grade? */}
                            Due to {timeTillEnd} more days
                        </div>

                        <div className="col-2">

                            <i className="bi bi-pencil" onClick={() => {setIsEditing(true)}}/>
                        </div>
                    </div>
                </ul>
            ) : (
                <ul>
                    <div className="row">
                        <div className="col-2">
                            <input type="text" placeholder="bla" style={{width: "70%"}}/>
                        </div>
                        <div className="col-4">
                            {numOfSubmits} / {numOfAssigned} submitted
                        </div>
                        <div className="col-4">
                            {/* needs to be input so we could edit? like in grade? */}
                            Due to <input type="text" placeholder="bla" style={{width: "50%"}}/> more days
                        </div>

                        <div className="col-2">

                            <button type="button" className="btn btn-danger" onClick={() => {setIsEditing(false)}}>ok</button>
                        </div>
                    </div>
                </ul>
            )}

        </>

    )
}

export default AssignmentDetails;