import React, { Component } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

class PivotTableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pivotState: {
        data: [],
        aggregatorName: 'Count', // Default aggregator
        vals: [], // Values to aggregate
        rows: [], // Row labels
        cols: [], // Column labels
      },
      availableFields: [], // List of available fields
      selectedUseCase: '1', // Initial use case (can be toggled)
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl =
      this.state.selectedUseCase === '1'
        ? 'https://apidev.finari.com/pfReportBuilder/getRecord?Is_active=active&tnt_id=6&uc_id=2'
        : ' https://apidev.finari.com/pfReportBuilder/getRecord?is_active=active&tnnt_id=6&uc_id=1';

    fetch(apiUrl, {
      headers: {
        'X-Access-Token': 'babaji', // Replace with your actual access token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.map((item) => {
          if (this.state.selectedUseCase === '1') {
            return [item.student_id, item.student_name, item.english, item.maths, item.tamil];
          } else {
            return [item.id, item.student_name, item.ac_year, item.department, item.is_active, item.lc_status_id];
          }
        });

        transformedData.unshift(
          this.state.selectedUseCase === '1'
            ? ['student_id', 'student_name', 'english', 'maths', 'tamil']
            : ['id', 'student_name', 'ac_year', 'department', 'is_active', 'lc_status_id']
        );

        this.setState({
          pivotState: {
            ...this.state.pivotState,
            data: transformedData,
          },
          availableFields:
            this.state.selectedUseCase === '1'
              ? ['student_id', 'student_name', 'english', 'maths', 'tamil']
              : ['id', 'student_name', 'ac_year', 'department', 'is_active', 'lc_status_id'],
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
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        {/* Sidebar with Available Fields and Use Case Selector */}
        <div style={{ flex: '0 0 250px', backgroundColor: '#f0f0f0', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Pivot Table Configuration</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Available Fields</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {availableFields.map((field, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  {field}
                  <span style={{ marginLeft: '10px' }}>
                    <button className="btn-add" onClick={() => this.addRowLabel(field)}>+</button>
                    <button className="btn-remove" onClick={() => this.removeRowLabel(field)}>-</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: '10px' }}>Select Use Case</h3>
            <select
              value={selectedUseCase}
              onChange={this.handleUseCaseChange}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            >
              <option value="1">Use Case 1</option>
              <option value="2">Use Case 2</option>
            </select>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={this.handleRefreshButtonClick}>Submit</button>
          </div>
        </div>
        
        {/* Main Content Area with PivotTableUI */}
        <div style={{ flex: 1, padding: '20px' }}>
          <PivotTableUI {...pivotState} onChange={(s) => this.setState({ pivotState: s })} />
        </div>
      </div>
    );
  }
}

export default PivotTableExample;
