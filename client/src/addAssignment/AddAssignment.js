import { useRef, useState } from "react";


function AddAssignment({ token, refreshData, yearOption }) {

    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const nameBar = useRef(null);
    const startDateBar = useRef(null);
    const endDateBar = useRef(null);
    const durationHoursBar = useRef(null);
    const durationMinutesBar = useRef(null);

    const handleClick = () => {
        setShowModal(true)
        // if (!isCreated) {
        //     setShowModal(true);
        // } else {
        //     setSelectedTask(task);
        //     add();
        // }
    };

    const handleSubmit = (e) => {
        add(e);
        nameBar.current.value = '';
        startDateBar.current.value = '';
        endDateBar.current.value = '';
        durationHoursBar.current.value= '';
        durationMinutesBar.current.value= '';

        // setShowModal(false);
    };

    const handleCancel = () => {
        nameBar.current.value = '';
        startDateBar.current.value = '';
        endDateBar.current.value = '';
        durationHoursBar.current.value= '';
        durationMinutesBar.current.value= '';
        setShowModal(false);
        // setError('');

    };



    // const year = yearOption.current.value;

    const add = async function (e) {
        e.preventDefault();
        setError('');
        const name = nameBar.current.value.trim();
        const startDate = startDateBar.current.value.trim();
        const endDate = endDateBar.current.value.trim();
        const durationHours = durationHoursBar.current.value.trim();
        const durationMinutes = durationMinutesBar.current.value.trim();

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
                "durationHours": durationHours,
                "durationMinutes": durationMinutes,
                "year": parseInt(yearOption.current.value)
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
            durationHoursBar.current.value = "";
            durationMinutesBar.current.value = "";
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
            {/* Button to trigger modal */}
            <button type="button" className="btn" onClick={handleClick}>
                <i className="bi bi-plus-circle" style={{ color: "black" }} />
                &nbsp; Add new assignment
            </button>

            {/* Modal */}
            {showModal && (
                // check first line for backdrop
                <div className="modal show d-block modal-overlay"   tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{margin: '0 auto'}}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">CREATE ASSIGNMENT</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input type="text" ref={nameBar} className="form-control" placeholder="Assignment's name" style={{width: '70%', margin: '0 auto'}}/>
                                    <input type="datetime-local" ref={startDateBar} className="form-control" placeholder="Date of start" style={{width: '70%', margin: '0 auto'}}/>
                                    <input type="datetime-local" ref={endDateBar} className="form-control" placeholder="Date of submission" style={{width: '70%', margin: '0 auto'}}/>
                                    <center>Assignemnt's duration: </center>
                                    <input type="text" ref={durationHoursBar} className="form-control" placeholder="hours" style={{width: '70%', margin: '0 auto'}}/>
                                    <input type="text" ref={durationMinutesBar} className="form-control" placeholder="minutes" style={{width: '70%', margin: '0 auto'}}/>
                                </div>
                                <div className="modal-footer">
                                    {/* {error &&
                                    <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                        {error}
                                    </span>} */}
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Close</button>
                                    <button type="submit" className="btn btn-primary">Create Assignemnt</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default AddAssignment