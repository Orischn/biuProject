

function StudentAssignment({ fullname, didSubmit, canSubmitLate }) {

    return (
        <ul>
            <div className="row">
                <div className="col-2">
                    {fullname}
                </div>
                <div className="col-3">
                    Submitted? {String(didSubmit)}
                </div>
                <div className="col-5">
                    Can submit late? {String(canSubmitLate)}
                </div>

                {/* <div className="col-2">
                    grade: {grade}
                </div> */}

            </div>
        </ul>
    );
}

export default StudentAssignment;