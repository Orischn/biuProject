import { useRef, useState } from "react";
import InputFile from "../inputFile/InputFile";


function AddAssignment({ token, refreshData, yearOption }) {

    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [questions, setQuestions] = useState({});
    const [image, setImage] = useState('');
    const [questionsDataType, setQuestionsDataType] = useState('')
    const [imageDataType, setImageDataType] = useState('');
    const [noTimeLimit, setNoTimeLimit] = useState(false);

    const nameBar = useRef(null);
    const startDateBar = useRef(null);
    const endDateBar = useRef(null);
    const durationHoursBar = useRef(null);
    const durationMinutesBar = useRef(null);
    const formatBar = useRef(null)

    const cleanInput = () => {
        nameBar.current.value = '';
        startDateBar.current.value = '';
        endDateBar.current.value = '';
        durationHoursBar.current.value = '';
        durationMinutesBar.current.value = '';
        setQuestions({})
        setImage("")
        setNoTimeLimit(false)
    }

    const handleClick = () => {
        setShowModal(true)
    };

    const handleCancel = () => {
        cleanInput();
        setError('');
        setShowModal(false);
    };



    // const year = yearOption.current.value;

    const add = async function (e) {
        e.preventDefault();
        setError('');
        const name = nameBar.current.value.trim();
        const startDate = startDateBar.current.value.trim();
        const endDate = endDateBar.current.value.trim();
        const durationHours = noTimeLimit ? null : durationHoursBar.current.value.trim();
        const durationMinutes = noTimeLimit ? null : durationMinutesBar.current.value.trim();
        // const format = formatBar.current.value.trim();


        if (name === '' || startDate === '' || endDate === '' || !questions || !image
            || (!noTimeLimit && durationHours === '') || (!noTimeLimit && durationMinutes === '')) {
            setError('Must fill all fields');
            return;
        }
        if (durationHours) {
            const durationRegex = new RegExp('^[0-9]+$')
            if (!durationRegex.test(durationHours) || !durationRegex.test(durationMinutes)) {
                setError('Duration must be a number!');
                return;
            }
        }

        if (durationMinutes) {
            if (parseInt(durationMinutes) >= 60) {
                setError('Minutes must be a less than 60!');
                return;
            }
        }


        if (questionsDataType !== 'text/csv') {
            setError('Please Upload a CSV File!')
            return;
        }

        if (imageDataType !== 'image/png' && imageDataType !== 'image/jpeg') {
            setError('Invalid Format for a Picture!')
            return;
        }

        const res = await fetch('http://localhost:5000/api/createTask', {
            'method': 'post',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "taskName": name,
                "startDate": new Date(startDate).getTime(),
                "endDate": new Date(endDate).getTime(),
                "durationHours": durationHours,
                "durationMinutes": durationMinutes,
                "year": parseInt(yearOption.current.value),
                "format": 'txt',
                "questions": JSON.stringify(questions),
                "botPic": image
            })

        })
        if (res.status !== 201) { //error
            await res.text().then((errorMessage) => {
                setError(errorMessage);
            })
            setIsSuccessful(false)
            return;
        } else {
            setError("Added Successfully");
            setIsSuccessful(true)
            cleanInput();
            refreshData();
            nameBar.current.value = '';
            startDateBar.current.value = '';
            endDateBar.current.value = '';
            durationHoursBar.current.value = '';
            durationMinutesBar.current.value = '';
            setQuestions({})
            setImage('')
            setNoTimeLimit(false)
        }

    }


    return (
        <>
            {/* Button to trigger modal */}
            <button type="button" className="btn" onClick={handleClick}>
                <i className="bi bi-plus-circle" style={{ color: "black" }} />
                &nbsp; Add new Assignment
            </button>

            {/* Modal */}
            {showModal && (
                // check first line for backdrop
                <div className="modal show d-block modal-overlay" tabIndex="-1" role="dialog">
                    <div className="modal-dialog-custom" role="document" style={{ margin: '0 auto' }}>
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: 'darkgreen' }}>
                                <h5 className="modal-title text-white">CREATE ASSIGNMENT</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
                            </div>

                            <form onSubmit={add}>
                                <div className="modal-body">
                                    <label htmlFor="assName">Assignment's Name:</label>
                                    <input id="assName" type="text" ref={nameBar} className="form-control" placeholder="Assignment's name" style={{ width: '70%', margin: '0 auto' }} />
                                    <label htmlFor="assStart">Date of Start:</label>
                                    <input id="assStart" type="datetime-local" ref={startDateBar} className="form-control" placeholder="Date of start" style={{ width: '70%', margin: '0 auto' }} />
                                    <label htmlFor="assEnd">Date of Submission:</label>
                                    <input id="assEnd" type="datetime-local" ref={endDateBar} className="form-control" placeholder="Date of submission" style={{ width: '70%', margin: '0 auto' }} />
                                    <label htmlFor="assDuration">Assignemnt's duration: </label>
                                    <input id="assDuration" type="text" ref={durationHoursBar} className="form-control" placeholder="hours" style={{ width: '70%', margin: '0 auto' }} disabled={noTimeLimit}/>
                                    <input type="text" ref={durationMinutesBar} className="form-control" placeholder="minutes" style={{ width: '70%', margin: '0 auto' }} disabled={noTimeLimit}/>
                                    {/* <center><label htmlFor="noDuration">No Time Limit</label></center> */}
                                    <center><span>No Time Limit: </span></center>
                                    <input type="checkbox" checked={noTimeLimit} onClick={() => setNoTimeLimit(!noTimeLimit)}/>

                                    <label htmlFor="DecisionTree">Upload CSV File:</label>
                                    <InputFile title={"DecisionTree"} setFileContent={setQuestions} isBase64={false} setDataType={setQuestionsDataType} />
                                    <label htmlFor="BotProfilePicture">Upload Bot Picture:</label>
                                    <InputFile title={"BotProfilePicture"} setFileContent={setImage} isBase64={true} setDataType={setImageDataType} />
                                </div>
                                <div className="modal-footer">
                                    {error &&
                                        <span className={`alert ${isSuccessful ? "alert-success" : "alert-danger"} w-50`} role="alert">
                                            <center>{error}</center>
                                        </span>}
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