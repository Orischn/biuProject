import { useRef, useState } from "react";
import Practice from "../practice/Practice";

function AddPractice({token, practiceList, setPracticeList, selectedPractice, setSelectedPractice}) {

    const add = async function (e) {
        const res = await fetch(`http://localhost:5000/api/addPractice/`, {
            'method': 'post',
            'headers': {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (res.status === 201) {
            setSelectedPractice(res);
            // setSelectedPractice(practiceList[length(practiceList) - 1])
        }
    };


    return (
        <>
            <button type="button" onClick={add}>
                <i id="addPractice" className="bi bi-plus-circle-fill"></i>
            </button>
        </>
    )
}

export default AddPractice;