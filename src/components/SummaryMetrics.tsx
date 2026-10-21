import React from 'react';
import type { AverageMetrics } from '../core/types';

interface SummaryMetricsProps {
  averageMetrics: AverageMetrics;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ averageMetrics }) => {
  return (
    <div className="summary-metrics">
      <div className="metric-card">
        <h4 className="metric-card-title">Average Waiting Time</h4>
        <p className="metric-card-value">{averageMetrics.avgWaitingTime.toFixed(2)}</p>
      </div>
      <div className="metric-card">
        <h4 className="metric-card-title">Average Turnaround Time</h4>
        <p className="metric-card-value">{averageMetrics.avgTurnaroundTime.toFixed(2)}</p>
      </div>
      <div className="metric-card">
        <h4 className="metric-card-title">Average Response Time</h4>
        <p className="metric-card-value">{averageMetrics.avgResponseTime.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SummaryMetrics;
