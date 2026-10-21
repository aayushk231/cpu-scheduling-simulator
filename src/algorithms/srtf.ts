import type { Process, GanttBlock, SchedulingResult } from '../core/types';
import { buildSchedulingResult } from '../core/metrics';

/**
 * Shortest Remaining Time First (SRTF) scheduling algorithm.
 * Preemptive variant of SJF: at each event, the process with the shortest
 * remaining burst time is selected. Preemption only occurs when a new process
 * has STRICTLY less remaining time than the current process.
 */
export function srtf(processes: Process[]): SchedulingResult {
  const procs = processes.map((p) => ({ ...p }));
  const ganttChart: GanttBlock[] = [];

  if (procs.length === 0) {
    return buildSchedulingResult(processes, ganttChart);
  }

  const remaining = new Map<string, number>();
  for (const p of procs) {
    remaining.set(p.pid, p.burstTime);
  }

  const completed = new Set<string>();
  const totalProcesses = procs.length;
  let currentTime = 0;
  let currentPid: string | null = null;
  let blockStart = 0;

  // Collect all event times: arrivals
  // We use an event-driven approach advancing to the next significant event
  while (completed.size < totalProcesses) {
    // Find available (arrived, not completed) processes
    const available = procs.filter(
      (p) => p.arrivalTime <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      // No process available — jump to next arrival
      const nextArrival = procs
        .filter((p) => !completed.has(p.pid))
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

      // Flush current block if any
      if (currentPid !== null) {
        pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
        currentPid = null;
      }

      // Insert idle block
      pushOrMerge(ganttChart, null, currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    // Select process with shortest remaining time
    // Tie-breaking: shorter remaining > earlier arrival > earlier input order
    available.sort(
      (a, b) =>
        (remaining.get(a.pid)! - remaining.get(b.pid)!) ||
        (a.arrivalTime - b.arrivalTime) ||
        (a.inputOrder - b.inputOrder)
    );

    const selected = available[0];

    // If the selected process is different from current, flush the current block
    if (currentPid !== null && currentPid !== selected.pid) {
      pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
    }

    // Start a new block if process changed
    if (currentPid !== selected.pid) {
      currentPid = selected.pid;
      blockStart = currentTime;
    }

    // Determine how long this process runs until the next event
    // Events: next arrival of a not-yet-completed process, or completion of current
    const remainTime = remaining.get(selected.pid)!;
    const completionTime = currentTime + remainTime;

    // Find next arrival after currentTime of a non-completed process
    const futureArrivals = procs
      .filter((p) => p.arrivalTime > currentTime && !completed.has(p.pid))
      .map((p) => p.arrivalTime);

    const nextEventTime =
      futureArrivals.length > 0
        ? Math.min(completionTime, Math.min(...futureArrivals))
        : completionTime;

    const executionDuration = nextEventTime - currentTime;
    remaining.set(selected.pid, remainTime - executionDuration);
    currentTime = nextEventTime;

    // Check if the process completed
    if (remaining.get(selected.pid)! === 0) {
      completed.add(selected.pid);
      pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
      currentPid = null;
    }
  }

  // Flush any remaining block
  if (currentPid !== null) {
    pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
  }

  return buildSchedulingResult(processes, ganttChart);
}

/**
 * Push a new gantt block or merge with the last one if same pid.
 */
function pushOrMerge(
  ganttChart: GanttBlock[],
  pid: string | null,
  startTime: number,
  endTime: number
): void {
  if (startTime === endTime) return;

  const last = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
  if (last && last.pid === pid && last.endTime === startTime) {
    last.endTime = endTime;
  } else {
    ganttChart.push({ pid, startTime, endTime });
  }
}
