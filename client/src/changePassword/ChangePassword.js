

function ChangePassword() {

    const change = async function () {
        console.log('');
    }

    return (
        <>

            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#changePassModal">
                <i id="openChangePassword" className="bi bi-shield-lock" />
            </button>


            {/* Confirmation Modal */}
            <div className="modal fade" id="changePassModal" tabIndex="-1" aria-labelledby="changePassModalLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="changePassModalLabel">Change your Password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            bla bla bla
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={() => change()}>
                                Save new Password
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );

}

export default ChangePassword;