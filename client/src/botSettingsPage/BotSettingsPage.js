function BotSettingsPage({ token }) {
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('')

    const save = async (e) => {
        const updateCSV = async () => {
            const res = await fetch(`http://localhost:5000/api/uploadDecisionTree/`, {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                'body': JSON.stringify({
                    'fileName': fileName,
                    "CSVTree": fileContent,
                })
            })
            if (res === 500) {
                res.text().then((errorText) => alert(errorText))
            } else if (res === 400) {
                res.text.then((errorText) => setError(errorText))
            }
        }
        e.preventDefault();
        updateCSV()
    }

    return (
        <>
            <form noValidate onSubmit={save} >
                <InputFile title={'Decision Tree: '} setFileName={setFileName} setFileContent={setFileContent} error={error} />
                <input type="submit" className="btn btn-primary submit" value="Save" />
            </form>
        </>
    )
}

export default BotSettingsPage