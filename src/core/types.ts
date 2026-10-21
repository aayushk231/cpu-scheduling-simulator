/**
 * Core type definitions for the CPU Scheduling Simulator.
 */

/** Represents a process as entered by the user. */
export interface Process {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  /** Preserves the original input order for tie-breaking. */
  inputOrder: number;
}

/** A single execution interval on the Gantt chart timeline. */
export interface GanttBlock {
  pid: string | null; // null represents CPU idle time
  startTime: number;
  endTime: number;
}

/** Per-process scheduling metrics. */
export interface ProcessMetrics {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
  inputOrder: number;
}

/** Average metrics across all processes. */
export interface AverageMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
}

/** Complete result of running a scheduling algorithm. */
export interface SchedulingResult {
  ganttChart: GanttBlock[];
  processMetrics: ProcessMetrics[];
  averageMetrics: AverageMetrics;
}

/** Supported scheduling algorithm identifiers. */
export type AlgorithmType =
  | 'fcfs'
  | 'sjf'
  | 'srtf'
  | 'roundRobin'
  | 'priorityNonPreemptive'
  | 'priorityPreemptive';

/** Display information for each algorithm. */
export interface AlgorithmInfo {
  name: string;
  shortName: string;
  description: string;
  pros: string[];
  cons: string[];
  preemptive: boolean;
}
