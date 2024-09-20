

function StudentMessage({content}) {
    return (
        <div dir="rtl">
            <div className="studentMessage">
                {content}
                <br />
                {/* <span id="textTime" className="badge text-opacity-50"></span> */}
            </div>
        </div>
    );
}

export default StudentMessage;