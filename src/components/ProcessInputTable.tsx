import React from 'react';

interface ProcessInputTableProps {
  processes: Array<{ pid: string; arrivalTime: string; burstTime: string; priority: string }>;
  setProcesses: (processes: Array<{ pid: string; arrivalTime: string; burstTime: string; priority: string }>) => void;
  onLoadSample: () => void;
  onReset: () => void;
}

const ProcessInputTable: React.FC<ProcessInputTableProps> = ({
  processes,
  setProcesses,
  onLoadSample,
  onReset,
}) => {
  const handleChange = (
    index: number,
    field: 'pid' | 'arrivalTime' | 'burstTime' | 'priority',
    value: string
  ) => {
    const updated = processes.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setProcesses(updated);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { pid: `P${processes.length + 1}`, arrivalTime: '', burstTime: '', priority: '' },
    ]);
  };

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  return (
    <div className="process-input-table">
      <div className="table-actions">
        <button className="btn btn-primary" onClick={addProcess}>
          Add Process
        </button>
        <button className="btn btn-secondary" onClick={onLoadSample}>
          Load Sample Data
        </button>
        <button className="btn btn-danger" onClick={onReset}>
          Reset
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index}>
              <td>
                <input
                  className="table-input"
                  type="text"
                  value={process.pid}
                  onChange={(e) => handleChange(index, 'pid', e.target.value)}
                />
              </td>
              <td>
                <input
                  className="table-input"
                  type="text"
                  value={process.arrivalTime}
                  onChange={(e) => handleChange(index, 'arrivalTime', e.target.value)}
                />
              </td>
              <td>
                <input
                  className="table-input"
                  type="text"
                  value={process.burstTime}
                  onChange={(e) => handleChange(index, 'burstTime', e.target.value)}
                />
              </td>
              <td>
                <input
                  className="table-input"
                  type="text"
                  value={process.priority}
                  onChange={(e) => handleChange(index, 'priority', e.target.value)}
                />
              </td>
              <td>
                <button
                  className="btn btn-remove"
                  onClick={() => removeProcess(index)}
                  title="Remove process"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {processes.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-message">
                No processes added. Click "Add Process" or "Load Sample Data" to begin.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessInputTable;
