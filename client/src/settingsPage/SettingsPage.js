import { useState } from "react"
import BotSettingsPage from "../botSettingsPage/BotSettingsPage"
import StudentSettingsPage from "../studentSettingsPage/StudentSettingsPage"
import GeneralSettingsPage from "../generalSettingsPage/GeneralSettingsPage";

function SettingsPage({ token }) {
    const [selectedSettings, setSelectedSettings] = useState(0)
    const settingsOptions = [<GeneralSettingsPage token={token} />, <BotSettingsPage token={token} />, <StudentSettingsPage token={token} />];

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">SETTINGS</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-3">
                                {/* trying something */}
                                <ul className="list-group mt-3">
                                    <li className="list-group-item settingType" onClick={() => setSelectedSettings(0)}>
                                        <i className="bi bi-gear"></i> General
                                    </li>
                                    <li className="list-group-item settingType" onClick={() => setSelectedSettings(1)}>
                                        <i className="bi bi-robot"></i> Manage Bot
                                    </li>
                                    <li className="list-group-item settingType" onClick={() => setSelectedSettings(2)}>
                                        <i className="bi bi-people"></i> Manage Students
                                    </li>
                                </ul>
                            </div>
                            <div className="col-9">
                                {settingsOptions[selectedSettings]}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        close / save / whatever
                    </div> 
                </div>
            </div>
        </div >
    )
}

export default SettingsPage