import { useNavigate } from "react-router";
import api from "../handleTokenRefresh/HandleTokenRefresh";

function AddPractice({token, selectedTask, setSelectedTask}) {
    const navigate = useNavigate();
    const add = async function (e) {

        const res = await api.get('api/addPractice/', {
            "chatId": selectedTask.taskName
        });

        if (res.status === 201) {
            setSelectedTask(res.data);
        } else if (res.status === 403) {
            navigate('/');
            return
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