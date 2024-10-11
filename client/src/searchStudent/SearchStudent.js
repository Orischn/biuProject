function SearchStudent({ filter, setFilter }) {
    return (
        <>

            <span id="searchBar" className="input-group m-2">
                <input value={filter} onChange={(e) => {
                    setFilter(e.target.value);
                }} className="form-control inputText" placeholder="Search student by id or name"
                />
                {/* <i className="input-group-text bi bi-search" /> */}

            </span>
            <span className="input-group-text" style={{ border: 'none', background: 'none' }}>
            </span>
        </>
    );
}

export default SearchStudent;