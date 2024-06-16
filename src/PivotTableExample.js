import React, { Component } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

// Sample data
const data = [
  ['stud_id', 'stud_name', 'year', 'english', 'maths'],
  [1, 'aaa', 2023, 70, 50],
  [2, 'bbb', 2024, 60, 60],
  [3, 'ccc', 2023, 80, 70],
];

class PivotTableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pivotState: {
        data: data,
        aggregatorName: 'Count', // Default aggregator
        vals: [], // Values to aggregate
        rows: [], // Row labels
        cols: [], // Column labels
      },
      availableFields: ['stud_id', 'stud_name', 'year', 'english', 'maths'], // List of available fields
    };
  }

  // Function to handle adding a field as a row label
  addRowLabel = (fieldName) => {
    const { pivotState } = this.state;
    const newRows = [...pivotState.rows, fieldName];
    this.setState({
      pivotState: {
        ...pivotState,
        rows: newRows,
      },
    });
  };

  // Function to remove a row label
  removeRowLabel = (fieldName) => {
    const { pivotState } = this.state;
    const newRows = pivotState.rows.filter((row) => row !== fieldName);
    this.setState({
      pivotState: {
        ...pivotState,
        rows: newRows,
      },
    });
  };

  render() {
    const { pivotState, availableFields } = this.state;
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: '0 0 200px', padding: '20px', backgroundColor: '#f0f0f0', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '10px' }}>Available Fields</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {availableFields.map((field) => (
              <li key={field} style={{ marginBottom: '5px' }}>
                <button
                  style={{ width: '100%', textAlign: 'left', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}
                  onClick={() => {
                    if (pivotState.rows.includes(field)) {
                      this.removeRowLabel(field);
                    } else {
                      this.addRowLabel(field);
                    }
                  }}
                >
                  {field} {pivotState.rows.includes(field) ? '(Selected)' : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: '1', padding: '20px' }}>
          <PivotTableUI
            onChange={(s) => this.setState({ pivotState: s })}
            {...pivotState}
          />
        </div>
      </div>
    );
  }
}

export default PivotTableExample;
