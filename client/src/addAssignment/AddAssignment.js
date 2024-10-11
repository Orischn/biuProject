import { useRef } from "react";


function AddAssignment({ token }) {

    const nameBar = useRef(null);
    const startDateBar = useRef(null);
    const endDateBar = useRef(null);
    const durationBar = useRef(null);

    const add = async function () {
        // console.log(startDateBar.current.value.trim(), typeof(startDateBar.current.value.trim()))

    }

    return (
        <>
            {/* Button trigger modal */}
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#addAssignment">
                <i className="bi bi-plus-circle" />
                &nbsp; Add new assignment
            </button>
            {/* Modal */}
            <div className="modal fade" id="addAssignment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addAssignmentLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addAssignmentLabel">CREATE ASSIGNMENT</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={add}>
                            <div className="modal-body">
                                <input type="text" ref={nameBar} className="form-control" placeholder="Assignment's name" />
                                <input type="datetime-local" ref={startDateBar} className="form-control" placeholder="Date of start" />
                                <input type="datetime-local" ref={endDateBar} className="form-control" placeholder="Date of submission" />
                                <input type="text" ref={durationBar} className="form-control" placeholder="How much time? (should be calculated)" />

                            </div>
                            <div className="modal-footer">
                                {/* {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        {error}
                                    </span>} */}
                                <button type="button" onClick={() => {
                                    nameBar.current.value = '';
                                    startDateBar.current.value = '';
                                    endDateBar.current.value = '';
                                    durationBar.current.value = '';
                                    // setError('');
                                }}
                                    className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Create Assignemnt</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );

}

export default AddAssignment