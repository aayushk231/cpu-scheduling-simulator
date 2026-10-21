import React from 'react';
import type { ComparisonRow } from '../core/scheduler';

interface ComparisonTableProps {
  data: ComparisonRow[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  const minWaiting = Math.min(...data.map((r) => r.avgWaitingTime));
  const minTurnaround = Math.min(...data.map((r) => r.avgTurnaroundTime));

  return (
    <div className="comparison-table">
      <h3 className="comparison-table-title">Algorithm Comparison</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Avg Waiting Time</th>
            <th>Avg Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.algorithm}>
              <td>{row.name}</td>
              <td
                className={row.avgWaitingTime === minWaiting ? 'best-value' : ''}
              >
                {row.avgWaitingTime.toFixed(2)}
              </td>
              <td
                className={row.avgTurnaroundTime === minTurnaround ? 'best-value' : ''}
              >
                {row.avgTurnaroundTime.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
