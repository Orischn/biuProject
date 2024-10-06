import { useState } from "react"
import BotSettingsPage from "../botSettingsPage/BotSettingsPage"
import StudentSettingsPage from "../studentSettingsPage/StudentSettingsPage"

function SettingsPage({ token, closeModal }) {
    const [selectedSettings, setSelectedSettings] = useState(0)
    const settingsOptions = [<GeneralSettings token={token} />, <BotSettingsPage token={token} />, <StudentSettingsPage token={token} />];
    return (
        <>
            <div
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered custom-modal-width" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Settings</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={closeModal}
                            ></button>
                        </div>

                        {/* end of title, now need rows and cols */}
                        <div className="row">
                            <div className="col-6">
                                {/* trying something */}
                                <ul className="list-group mt-3">
                                    <li className="list-group-item settingType">
                                        <button className="bi bi-file-earmark-arrow-up" onClick={setSelectedSettings(0)}></button> General
                                    </li>
                                    <li className="list-group-item settingType">
                                        <button className="bi bi-file-earmark-arrow-up" onClick={setSelectedSettings(1)}></button> Manage Bot
                                    </li>
                                    <li className="list-group-item settingType">
                                        <button className="bi bi-people" onClick={setSelectedSettings(2)}></button> Manage Students
                                    </li>
                                </ul>
                            </div>
                            <div className="col-6">
                                {settingsOptions[selectedSettings]}
                            </div>

                        </div>
                        {/* <form noValidate className="container-fluid modal-body" onSubmit={save} >
                            <InputFile title={'Decision Tree: '} setFileName={setFileName} setFileContent={setFileContent} error={error} />
                            <input type="submit" className="btn btn-primary submit" value="Save" />
                        </form> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage