import { useRef, useState } from "react";

function AddPractice({addPractice, counter}) {
    const [addedPractices, setAddedPractices] = useState([]);

    const add = function (e) {


        //let say everything is okay, maybe present a warning or confiramtion

        // addPractice
    };


    return (
        <>
            <button type="button" onClick={add}>
                <i id="addPractice" class="bi bi-plus-circle-fill"></i>
            </button>
        </>
    )
}

export default AddPractice;