import React from 'react';
import type { GanttBlock } from '../core/types';

interface GanttChartProps {
  ganttChart: GanttBlock[];
}

const COLORS = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
  '#af7aa1',
  '#86bcb6',
  '#d4a6c8',
  '#d37295',
  '#8cd17d',
];

const IDLE_COLOR = '#d3d3d3';
const SCALE = 60; // pixels per time unit
const MIN_WIDTH = 40; // minimum block width in pixels

const GanttChart: React.FC<GanttChartProps> = ({ ganttChart }) => {
  if (ganttChart.length === 0) {
    return <div className="gantt-chart-empty">No scheduling data to display.</div>;
  }

  // Build a stable color map by unique PID
  const uniquePids = Array.from(
    new Set(ganttChart.filter((b) => b.pid !== null).map((b) => b.pid as string))
  );
  const colorMap: Record<string, string> = {};
  uniquePids.forEach((pid, i) => {
    colorMap[pid] = COLORS[i % COLORS.length];
  });

  return (
    <div className="gantt-chart">
      <h3 className="gantt-chart-title">Gantt Chart</h3>
      <div className="gantt-chart-scroll">
        <div className="gantt-chart-bars">
          {ganttChart.map((block, index) => {
            const duration = block.endTime - block.startTime;
            const width = Math.max(duration * SCALE, MIN_WIDTH);
            const isIdle = block.pid === null;
            const bgColor = isIdle ? IDLE_COLOR : colorMap[block.pid as string];

            return (
              <div
                key={index}
                className={`gantt-block ${isIdle ? 'gantt-block-idle' : ''}`}
                style={{
                  width: `${width}px`,
                  backgroundColor: bgColor,
                }}
              >
                <span className="gantt-block-label">
                  {isIdle ? 'IDLE' : block.pid}
                </span>
                <div className="gantt-block-times">
                  <span className="gantt-time gantt-time-start">{block.startTime}</span>
                  <span className="gantt-time gantt-time-end">{block.endTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
