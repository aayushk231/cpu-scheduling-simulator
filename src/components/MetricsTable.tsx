import React from 'react';
import type { ProcessMetrics } from '../core/types';

interface MetricsTableProps {
  metrics: ProcessMetrics[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  const sorted = [...metrics].sort((a, b) => a.inputOrder - b.inputOrder);

  return (
    <div className="metrics-table">
      <h3 className="metrics-table-title">Process Metrics</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>AT</th>
            <th>BT</th>
            <th>Priority</th>
            <th>CT</th>
            <th>TAT</th>
            <th>WT</th>
            <th>RT</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.pid}>
              <td>{m.pid}</td>
              <td>{m.arrivalTime}</td>
              <td>{m.burstTime}</td>
              <td>{m.priority}</td>
              <td>{m.completionTime}</td>
              <td>{m.turnaroundTime}</td>
              <td>{m.waitingTime}</td>
              <td>{m.responseTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsTable;
