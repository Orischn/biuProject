import { useState } from "react"
import BotSettingsPage from "../botSettingsPage/BotSettingsPage"
import StudentSettingsPage from "../studentSettingsPage/StudentSettingsPage"
import GeneralSettingsPage from "../generalSettingsPage/GeneralSettingsPage";

function SettingsPage({ token }) {
    const [selectedSettings, setSelectedSettings] = useState(0)
    const settingsOptions = [<GeneralSettingsPage token={token} />,
    <BotSettingsPage token={token} />,
    <StudentSettingsPage token={token} />];

    return (
        <div className="modal fade custom-modal" id="settingsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="settingsModalLabel">SETTINGS</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            onClick={() => setSelectedSettings(0)}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-3">
                                {/* trying something */}
                                <ul className="list-group mt-3">
                                    <li className={`list-group-item settingType ${selectedSettings === 0 ? 'active' : ''}`}
                                        onClick={() => setSelectedSettings(0)}>
                                        <i className="bi bi-gear"></i> &nbsp; General
                                    </li>
                                    <li className={`list-group-item settingType ${selectedSettings === 1 ? 'active' : ''}`}
                                        onClick={() => setSelectedSettings(1)}>
                                        <i className="bi bi-robot"></i> &nbsp; Bot
                                    </li>
                                    <li className={`list-group-item settingType ${selectedSettings === 2 ? 'active' : ''}`}
                                        onClick={() => setSelectedSettings(2)}>
                                        <i className="bi bi-people"></i> &nbsp; Students
                                    </li>
                                </ul>
                            </div>
                            <div className="col-9">
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