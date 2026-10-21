import type { Process, AlgorithmType } from './types';
import { runAlgorithm } from '../algorithms';

export interface ComparisonRow {
  algorithm: AlgorithmType;
  name: string;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
}

/**
 * Run all 6 scheduling algorithms on the given processes and return
 * comparison data (average waiting time and turnaround time for each).
 */
export function runAllAlgorithms(
  processes: Process[],
  quantum: number = 2
): ComparisonRow[] {
  const algorithms: { type: AlgorithmType; name: string }[] = [
    { type: 'fcfs', name: 'FCFS' },
    { type: 'sjf', name: 'SJF' },
    { type: 'srtf', name: 'SRTF' },
    { type: 'roundRobin', name: 'Round Robin' },
    { type: 'priorityNonPreemptive', name: 'Priority (Non-preemptive)' },
    { type: 'priorityPreemptive', name: 'Priority (Preemptive)' },
  ];

  return algorithms.map(({ type, name }) => {
    const result = runAlgorithm(type, processes, quantum);
    return {
      algorithm: type,
      name,
      avgWaitingTime: result.averageMetrics.avgWaitingTime,
      avgTurnaroundTime: result.averageMetrics.avgTurnaroundTime,
    };
  });
}
