import { useRef, useState } from "react";

function AddPractice({addPractice, counter}) {
    const [addedPractices, setAddedPractices] = useState([]);

    const add = function (e) {

    };


    return (
        
        <form onSubmit={add}>
            <button type="submit">
                <i id="addPractice" class="bi bi-plus-circle-fill"></i>
            </button>
        </form>



    )
}