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

        if (res.status === 200) {
            res.text().then((practice) => {
                setPracticeList(...practiceList, 
                <Practice practice={JSON.parse(practice)} selectedPractice={selectedPractice}
                setSelectedPractice={setSelectedPractice} />)
            });
            // setSelectedPractice(practiceList[length(practiceList) - 1])
            setSelectedPractice(practiceList[-1])
        }
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