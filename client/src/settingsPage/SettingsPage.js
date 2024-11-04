import { useState } from "react"
import StudentSettingsPage from "../studentSettingsPage/StudentSettingsPage"
import AssignmentsSettingsPage from "../assignmentsSettingsPage/AssignmentsSettingsPage";

function SettingsPage({ token, yearOption, refreshDataInFeed, isYearChanged }) {
    const [selectedSettings, setSelectedSettings] = useState(0)
    const [expand, setExpand] = useState(false);

    const settingsOptions = [
        <AssignmentsSettingsPage token={token} yearOption={yearOption}
            expand={expand} setExpand={setExpand} refreshDataInFeed={refreshDataInFeed}
            isYearChanged={isYearChanged} />,
        <StudentSettingsPage token={token} yearOption={yearOption}
            refreshDataInFeed={refreshDataInFeed} expand={expand} setExpand={setExpand}
            isYearChanged={isYearChanged} />];

    return (
        <div className="modal fade custom-modal" id="settingsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
            <div className="modal-dialog" >
                <div className="modal-content" >
                    <div className="modal-header text-white" >
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">SETTINGS</h1>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"
                            onClick={() => {
                                setSelectedSettings(0)
                                setExpand(false)
                            }}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-2">
                                <ul className="list-group mt-3">
                                    <li className={`list-group-item settingType ${selectedSettings === 0 ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedSettings(0)
                                            setExpand(false)
                                        }}>
                                        <i className="bi bi-ui-checks"></i> &nbsp; Assignments
                                    </li>
                                    <li className={`list-group-item settingType ${selectedSettings === 1 ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedSettings(1)
                                            setExpand(false)
                                        }}>
                                        <i className="bi bi-people"></i> &nbsp; Students
                                    </li>
                                </ul>
                            </div>
                            <div className="col-10">
                                {settingsOptions[selectedSettings]}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer" dir="rtl">
                        <b>
                            Think carefully before making any changes.
                            Remember, with great power comes great responsibility
                        </b>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default SettingsPage