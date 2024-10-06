function GeneralSettingsPage({ token }) {

    const save = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            <form noValidate onSubmit={save} >
                <input type="submit" className="btn btn-primary submit" value="Save" />
            </form>
        </>
    )
}

export default GeneralSettingsPage