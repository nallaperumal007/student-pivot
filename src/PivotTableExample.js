import React, { Component } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import './PivotTableExample.css'; // Import CSS file for styling

class PivotTableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pivotState: {
        data: [],
        aggregatorName: 'Count',
        vals: [],
        rows: [],
        cols: [],
      },
      availableFields: [],
      selectedUseCase: '1',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl =
      this.state.selectedUseCase === '1'
        ? 'https://apidev.finari.com/pfReportBuilder/getRecord?Is_active=active&tnt_id=6&uc_id=2'
        : 'https://apidev.finari.com/pfReportBuilder/getRecord?is_active=active&tnnt_id=6&uc_id=1';

    fetch(apiUrl, {
      headers: {
        'X-Access-Token': 'Hello',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          return; // Handle empty data scenario
        }

        // Extract fields dynamically from the first item in data
        const fields = Object.keys(data[0]);

        // Transform data for PivotTable
        const transformedData = data.map((item) => fields.map((field) => item[field]));

        transformedData.unshift(fields); // Add fields as the first row

        // Update state with dynamic fields and data
        this.setState({
          pivotState: {
            ...this.state.pivotState,
            data: transformedData,
            vals: fields.slice(2), // Assuming first two fields are identifiers (e.g., id, student_name)
            rows: [fields[0]], // Default to the first field as rows
            cols: [], // Initialize columns as empty
          },
          availableFields: fields,
        });
      });
  }

  handleUseCaseChange = (event) => {
    const selectedUseCase = event.target.value;
    this.setState({ selectedUseCase }, () => {
      this.fetchData();
    });
  };

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

  handleRefreshButtonClick = () => {
    // Reload the page
    window.location.reload();
  };

  render() {
    const { pivotState, availableFields, selectedUseCase } = this.state;

    return (
      <div className="pivot-table-container">
        {/* Sidebar with Available Fields and Use Case Selector */}
        <div className="sidebar">
          <h2>Pivot Table Configuration</h2>
          <div>
            <h3>Available Fields</h3>
            <ul>
              {availableFields.map((field, index) => (
                <li key={index}>
                  {field}
                  <span>
                    <button className="btn-add" onClick={() => this.addRowLabel(field)}>+</button>
                    <button className="btn-remove" onClick={() => this.removeRowLabel(field)}>-</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Select Use Case</h3>
            <select value={selectedUseCase} onChange={this.handleUseCaseChange}>
              <option value="1">Use Case 1</option>
              <option value="2">Use Case 2</option>
            </select>
          </div>
          <div>
            <button onClick={this.handleRefreshButtonClick}>Submit</button>
          </div>
        </div>

        {/* Main Content Area with PivotTableUI */}
        <div className="main-content">
          <PivotTableUI {...pivotState} onChange={(s) => this.setState({ pivotState: s })} />
        </div>
      </div>
    );
  }
}

export default PivotTableExample;
