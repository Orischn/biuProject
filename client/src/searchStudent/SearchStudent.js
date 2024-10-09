function SearchStudent({ filter, setFilter }) {
    return (
        <div>
            <span id="searchBar" className="input-group m-2">
                <span className="input-group-text">
                    <button id="searchButton" type="submit"><i className="bi-search" /></button>
                </span>
                <input value={filter} onChange={(e) => {
                    setFilter(e.target.value);
                }} className="form-control inputText" placeholder="Search student by id or name"
                />
            </span>
            <i id="filter" className="bi-filter mt-2" />
        </div>
    );
}

export default SearchStudent;