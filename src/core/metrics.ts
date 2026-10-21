import type { Process, GanttBlock, ProcessMetrics, AverageMetrics, SchedulingResult } from './types';

/**
 * Calculate scheduling metrics for a single process.
 */
export function calculateProcessMetrics(
  process: Process,
  completionTime: number,
  firstStartTime: number
): ProcessMetrics {
  const turnaroundTime = completionTime - process.arrivalTime;
  const waitingTime = turnaroundTime - process.burstTime;
  const responseTime = firstStartTime - process.arrivalTime;

  return {
    pid: process.pid,
    arrivalTime: process.arrivalTime,
    burstTime: process.burstTime,
    priority: process.priority,
    completionTime,
    turnaroundTime,
    waitingTime,
    responseTime,
    inputOrder: process.inputOrder,
  };
}

/**
 * Calculate average metrics across all processes.
 */
export function calculateAverageMetrics(metrics: ProcessMetrics[]): AverageMetrics {
  const count = metrics.length;
  if (count === 0) {
    return { avgWaitingTime: 0, avgTurnaroundTime: 0, avgResponseTime: 0 };
  }

  const totalWaiting = metrics.reduce((sum, m) => sum + m.waitingTime, 0);
  const totalTurnaround = metrics.reduce((sum, m) => sum + m.turnaroundTime, 0);
  const totalResponse = metrics.reduce((sum, m) => sum + m.responseTime, 0);

  return {
    avgWaitingTime: totalWaiting / count,
    avgTurnaroundTime: totalTurnaround / count,
    avgResponseTime: totalResponse / count,
  };
}

/**
 * Build a complete SchedulingResult from the original processes and a Gantt chart.
 * Extracts each process's completion time and first start time from the chart.
 */
export function buildSchedulingResult(
  processes: Process[],
  ganttChart: GanttBlock[]
): SchedulingResult {
  const processMetrics: ProcessMetrics[] = processes.map((process) => {
    // Find the last gantt block for this process (completion time)
    let completionTime = 0;
    let firstStartTime = Infinity;

    for (const block of ganttChart) {
      if (block.pid === process.pid) {
        if (block.startTime < firstStartTime) {
          firstStartTime = block.startTime;
        }
        if (block.endTime > completionTime) {
          completionTime = block.endTime;
        }
      }
    }

    return calculateProcessMetrics(process, completionTime, firstStartTime);
  });

  const averageMetrics = calculateAverageMetrics(processMetrics);

  return {
    ganttChart,
    processMetrics,
    averageMetrics,
  };
}
