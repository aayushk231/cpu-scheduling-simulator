import type { Process, GanttBlock, SchedulingResult } from '../core/types';
import { buildSchedulingResult } from '../core/metrics';

/**
 * First Come, First Served (FCFS) scheduling algorithm.
 * Non-preemptive: processes run to completion in arrival order.
 */
export function fcfs(processes: Process[]): SchedulingResult {
  const procs = processes.map((p) => ({ ...p }));
  const ganttChart: GanttBlock[] = [];

  if (procs.length === 0) {
    return buildSchedulingResult(processes, ganttChart);
  }

  // Sort by arrival time, then input order for ties
  procs.sort((a, b) => a.arrivalTime - b.arrivalTime || a.inputOrder - b.inputOrder);

  let currentTime = 0;

  for (const proc of procs) {
    // Insert idle block if there's a gap
    if (currentTime < proc.arrivalTime) {
      ganttChart.push({
        pid: null,
        startTime: currentTime,
        endTime: proc.arrivalTime,
      });
      currentTime = proc.arrivalTime;
    }

    // Run process to completion
    ganttChart.push({
      pid: proc.pid,
      startTime: currentTime,
      endTime: currentTime + proc.burstTime,
    });
    currentTime += proc.burstTime;
  }

  return buildSchedulingResult(processes, ganttChart);
}
