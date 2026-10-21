import type { Process, GanttBlock, SchedulingResult } from '../core/types';
import { buildSchedulingResult } from '../core/metrics';

/**
 * Priority scheduling — Non-preemptive variant.
 * Lower numeric priority value = higher scheduling priority.
 * Once a process starts, it runs to completion.
 *
 * Tie-breaking: lower priority number > earlier arrival > earlier input order.
 */
export function priorityNonPreemptive(processes: Process[]): SchedulingResult {
  const procs = processes.map((p) => ({ ...p }));
  const ganttChart: GanttBlock[] = [];

  if (procs.length === 0) {
    return buildSchedulingResult(processes, ganttChart);
  }

  const completed = new Set<string>();
  let currentTime = 0;

  while (completed.size < procs.length) {
    // Find available (arrived, not completed) processes
    const available = procs.filter(
      (p) => p.arrivalTime <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      // Jump to next arrival
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

    // Select process: lower priority number > earlier arrival > earlier input order
    available.sort(
      (a, b) =>
        a.priority - b.priority ||
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

/**
 * Priority scheduling — Preemptive variant.
 * Lower numeric priority value = higher scheduling priority.
 * A running process is preempted only when a newly arrived process has
 * STRICTLY higher priority (strictly lower priority number). Equal priority
 * does NOT preempt.
 *
 * Tie-breaking: lower priority number > earlier arrival > earlier input order.
 */
export function priorityPreemptive(processes: Process[]): SchedulingResult {
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
  let currentTime = 0;
  let currentPid: string | null = null;
  let blockStart = 0;

  while (completed.size < procs.length) {
    // Find available (arrived, not completed) processes
    const available = procs.filter(
      (p) => p.arrivalTime <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      // Jump to next arrival
      const nextArrival = procs
        .filter((p) => !completed.has(p.pid))
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

      if (currentPid !== null) {
        pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
        currentPid = null;
      }

      pushOrMerge(ganttChart, null, currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    // Select process: lower priority > earlier arrival > earlier input order
    available.sort(
      (a, b) =>
        a.priority - b.priority ||
        a.arrivalTime - b.arrivalTime ||
        a.inputOrder - b.inputOrder
    );

    const selected = available[0];

    // If process changed, flush the current block
    if (currentPid !== null && currentPid !== selected.pid) {
      pushOrMerge(ganttChart, currentPid, blockStart, currentTime);
    }

    if (currentPid !== selected.pid) {
      currentPid = selected.pid;
      blockStart = currentTime;
    }

    // Determine how long this process runs until next event
    const remainTime = remaining.get(selected.pid)!;
    const completionTime = currentTime + remainTime;

    // Next arrival of a non-completed process after currentTime
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

    // Check if process completed
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
