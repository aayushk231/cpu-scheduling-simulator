import type { Process, GanttBlock, SchedulingResult } from '../core/types';
import { buildSchedulingResult } from '../core/metrics';

/**
 * Round Robin scheduling algorithm.
 * Preemptive with a FIFO ready queue and configurable time quantum.
 *
 * At a quantum boundary, new arrivals (at the current time) are enqueued
 * BEFORE the current unfinished process is requeued.
 */
export function roundRobin(
  processes: Process[],
  quantum: number = 2
): SchedulingResult {
  const procs = processes.map((p) => ({ ...p }));
  const ganttChart: GanttBlock[] = [];

  if (procs.length === 0) {
    return buildSchedulingResult(processes, ganttChart);
  }

  const remaining = new Map<string, number>();
  for (const p of procs) {
    remaining.set(p.pid, p.burstTime);
  }

  // Sort by arrival time then input order for initial ordering
  const sortedProcs = [...procs].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.inputOrder - b.inputOrder
  );

  const completed = new Set<string>();
  const inQueue = new Set<string>();
  const readyQueue: Process[] = [];
  let currentTime = 0;

  // Enqueue all processes arriving at time 0
  for (const p of sortedProcs) {
    if (p.arrivalTime <= currentTime) {
      readyQueue.push(p);
      inQueue.add(p.pid);
    }
  }

  while (completed.size < procs.length) {
    if (readyQueue.length === 0) {
      // No process in queue — jump to next arrival
      const nextArrival = sortedProcs
        .filter((p) => !completed.has(p.pid) && !inQueue.has(p.pid))
        .reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);

      // Insert idle block
      ganttChart.push({
        pid: null,
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;

      // Enqueue newly arrived processes
      enqueueArrivals(sortedProcs, readyQueue, inQueue, completed, currentTime);
      continue;
    }

    // Dequeue the next process
    const current = readyQueue.shift()!;
    const remainTime = remaining.get(current.pid)!;
    const executionTime = Math.min(remainTime, quantum);
    const startTime = currentTime;
    const endTime = currentTime + executionTime;

    ganttChart.push({
      pid: current.pid,
      startTime,
      endTime,
    });

    remaining.set(current.pid, remainTime - executionTime);
    currentTime = endTime;

    // Enqueue new arrivals that arrived during this execution (up to and including currentTime)
    // These go BEFORE the current process is requeued
    enqueueArrivals(sortedProcs, readyQueue, inQueue, completed, currentTime);

    // Check if process completed
    if (remaining.get(current.pid)! === 0) {
      completed.add(current.pid);
    } else {
      // Requeue the current process AFTER new arrivals
      readyQueue.push(current);
    }
  }

  return buildSchedulingResult(processes, ganttChart);
}

/**
 * Enqueue all processes that have arrived by the given time and are not yet
 * in the queue or completed. Maintains input order.
 */
function enqueueArrivals(
  sortedProcs: Process[],
  readyQueue: Process[],
  inQueue: Set<string>,
  completed: Set<string>,
  currentTime: number
): void {
  for (const p of sortedProcs) {
    if (
      p.arrivalTime <= currentTime &&
      !inQueue.has(p.pid) &&
      !completed.has(p.pid)
    ) {
      readyQueue.push(p);
      inQueue.add(p.pid);
    }
  }
}
