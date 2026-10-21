import type { Process } from '../core/types';

export const sampleProcesses: Process[] = [
  { pid: 'P1', arrivalTime: 0, burstTime: 7, priority: 3, inputOrder: 0 },
  { pid: 'P2', arrivalTime: 2, burstTime: 4, priority: 1, inputOrder: 1 },
  { pid: 'P3', arrivalTime: 4, burstTime: 1, priority: 4, inputOrder: 2 },
  { pid: 'P4', arrivalTime: 5, burstTime: 4, priority: 2, inputOrder: 3 },
];
