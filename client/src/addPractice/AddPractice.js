
function AddPractice({token, selectedTask, setSelectedTask}) {

    const add = async function (e) {

        const res = await fetch(`http://localhost:5000/api/addPractice/`, {
            'method': 'post',
            'headers': {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            'body': JSON.stringify({
                "chatId": selectedTask.taskName
            })
        });

        if (res.status === 201) {
            await res.text().then((practice) => {
                setSelectedTask(JSON.parse(practice));
            });
        }
    };


    return (
        <>
            {/* <button type="button" onClick={add}
            style={{ border: 'none', backgroundColor: '#e6e6e6'}}>
                <i id="addPractice" className="bi bi-plus-circle"></i>
            </button> */}
            {/* <div onLoad={add}></div> */}
        </>
    )
}

export default AddPractice;