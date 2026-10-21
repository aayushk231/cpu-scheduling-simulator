import type { Process, GanttBlock, SchedulingResult } from '../core/types';
import { buildSchedulingResult } from '../core/metrics';

/**
 * Shortest Job First (SJF) scheduling algorithm.
 * Non-preemptive: at each decision point, selects the arrived process with the
 * shortest burst time. Runs it to completion before selecting the next.
 */
export function sjf(processes: Process[]): SchedulingResult {
  const procs = processes.map((p) => ({ ...p }));
  const ganttChart: GanttBlock[] = [];

  if (procs.length === 0) {
    return buildSchedulingResult(processes, ganttChart);
  }

  const completed = new Set<string>();
  let currentTime = 0;
  const totalProcesses = procs.length;

  while (completed.size < totalProcesses) {
    // Find all arrived, uncompleted processes
    const available = procs.filter(
      (p) => p.arrivalTime <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      // No process available — find the next arrival and insert idle block
      const nextArrival = procs
        .filter((p) => !completed.has(p.pid))
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

      ganttChart.push({
        pid: null,
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    // Select process: shortest burst > earlier arrival > earlier input order
    available.sort(
      (a, b) =>
        a.burstTime - b.burstTime ||
        a.arrivalTime - b.arrivalTime ||
        a.inputOrder - b.inputOrder
    );

    const selected = available[0];

    ganttChart.push({
      pid: selected.pid,
      startTime: currentTime,
      endTime: currentTime + selected.burstTime,
    });

    currentTime += selected.burstTime;
    completed.add(selected.pid);
  }

  return buildSchedulingResult(processes, ganttChart);
}
