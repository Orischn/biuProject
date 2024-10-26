import React, { useState } from 'react';

const JsonTableInput = ({ outputJson, setOutputJson }) => {
    const [rows, setRows] = useState([{ key: '', value: '', subsections: [] }]);

    const addRow = () => {
        setRows([...rows, { key: '', value: '', subsections: [] }]);
    };

    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const addSubsection = (rowIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].subsections.push({ key: '', value: '' });
        setRows(newRows);
    };

    const removeSubsection = (rowIndex, subIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].subsections.splice(subIndex, 1);
        setRows(newRows);
    };

    const handleSubsectionChange = (rowIndex, subIndex, field, value) => {
        const newRows = [...rows];
        newRows[rowIndex].subsections[subIndex][field] = value;
        setRows(newRows);
    };

    const generateJSON = () => {
        setOutputJson(JSON.stringify(rows, null, 2));
    };

    return (
        <div>
            <h2>JSON Table Input</h2>
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Subsection</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <input
                                    type="text"
                                    value={row.key}
                                    onChange={(e) => handleInputChange(rowIndex, 'key', e.target.value)}
                                    placeholder="Enter key"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.value}
                                    onChange={(e) => handleInputChange(rowIndex, 'value', e.target.value)}
                                    placeholder="Enter value"
                                />
                            </td>
                            <td>
                                <button onClick={() => addSubsection(rowIndex)}>Add Subsection</button>
                                {row.subsections.map((subsection, subIndex) => (
                                    <div key={subIndex} style={{ marginLeft: '20px' }}>
                                        <input
                                            type="text"
                                            value={subsection.key}
                                            onChange={(e) => handleSubsectionChange(rowIndex, subIndex, 'key', e.target.value)}
                                            placeholder="Subsection Key"
                                        />
                                        <input
                                            type="text"
                                            value={subsection.value}
                                            onChange={(e) => handleSubsectionChange(rowIndex, subIndex, 'value', e.target.value)}
                                            placeholder="Subsection Value"
                                        />
                                        <button onClick={() => removeSubsection(rowIndex, subIndex)}>Remove Subsection</button>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button onClick={() => removeRow(rowIndex)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow}>Add Row</button>
            <button onClick={generateJSON}>Generate JSON</button>

            <h3>Output JSON:</h3>
            <pre>{outputJson}</pre>
        </div>
    );
};

export default JsonTableInput;