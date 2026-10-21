import type { Process, SchedulingResult, AlgorithmType } from '../core/types';
import { fcfs } from './fcfs';
import { sjf } from './sjf';
import { srtf } from './srtf';
import { roundRobin } from './roundRobin';
import { priorityNonPreemptive, priorityPreemptive } from './priority';

/**
 * Run a specific scheduling algorithm on the given processes.
 * Deep copies processes to avoid mutation of the caller's data.
 */
export function runAlgorithm(
  algorithm: AlgorithmType,
  processes: Process[],
  quantum?: number
): SchedulingResult {
  // Deep copy processes to avoid mutation
  const procs = processes.map((p) => ({ ...p }));
  switch (algorithm) {
    case 'fcfs':
      return fcfs(procs);
    case 'sjf':
      return sjf(procs);
    case 'srtf':
      return srtf(procs);
    case 'roundRobin':
      return roundRobin(procs, quantum ?? 2);
    case 'priorityNonPreemptive':
      return priorityNonPreemptive(procs);
    case 'priorityPreemptive':
      return priorityPreemptive(procs);
  }
}

export { fcfs, sjf, srtf, roundRobin, priorityNonPreemptive, priorityPreemptive };
