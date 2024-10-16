import { useRef, useState } from "react";


function AddAssignment({ token, refreshData }) {

    const [error, setError] = useState('');
    
    const nameBar = useRef(null);
    const startDateBar = useRef(null);
    const endDateBar = useRef(null);
    const durationBar = useRef(null)
    // const durationBar = useRef(null);

    const add = async function (e) {
        // console.log(startDateBar.current.value.trim(), typeof (startDateBar.current.value.trim()))

        e.preventDefault();
        setError('');
        const name = nameBar.current.value.trim();
        const startDate = startDateBar.current.value.trim();
        const endDate = endDateBar.current.value.trim();
        const duration = durationBar.current.value.trim();

        const res = await fetch('http://localhost:5000/api/createTask', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": name,
                "startDate": convertTimestampToDate(new Date(startDate).getTime()),
                "endDate": convertTimestampToDate(new Date(endDate).getTime()),
                "duration": duration
            })

        })

        if (res.status !== 200) { //error
            await res.text().then((errorMessage) => {
                setError(errorMessage);
            })
            return;
        } else {
            setError("Added Successfully");
            nameBar.current.value = "";
            startDateBar.current.value = "";
            endDateBar.current.value = "";
            durationBar.current.value = "";
            refreshData()
        }

    }

    const convertTimestampToDate = (timestamp) => {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);
      
        // Extract and format the parts of the date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        // Return the formatted date string
        return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
      };


    return (
        <>
            {/* Button trigger modal */}
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#addAssignment">
                <i className="bi bi-plus-circle" style={{color: "black"}}/>
                &nbsp; Add new assignment
            </button>
            {/* Modal */}
            <div className="modal fade" id="addAssignment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addAssignmentLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-white">
                            <h1 className="modal-title fs-5" id="addAssignmentLabel">CREATE ASSIGNMENT</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={add}>
                            <div className="modal-body">
                                <input type="text" ref={nameBar} className="form-control" placeholder="Assignment's name" />
                                <input type="datetime-local" ref={startDateBar} className="form-control" placeholder="Date of start" />
                                <input type="datetime-local" ref={endDateBar} className="form-control" placeholder="Date of submission" />
                                <input type="text" ref={durationBar} className="form-control" placeholder="Assignment's duration" />
                                {/* <input type="text" ref={durationBar} className="form-control" placeholder="How much time? (should be calculated)" /> */}

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
                                    // durationBar.current.value = '';
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