function SearchStudent({ filter, setFilter }) {
    return (
        <>

            <span id="searchBar" className="input-group m-2">
                <input value={filter} onChange={(e) => {
                    setFilter(e.target.value);
                }} className="form-control inputText" placeholder="Search student by id or name"
                />
            </span>
            <span className="input-group-text" style={{ border: 'none', background: 'none' }}>
                <i className="bi-search" />
            </span>
            {/* <i id="filter" className="bi-filter mt-2" /> */}
        </>
    );
}

export default SearchStudent;