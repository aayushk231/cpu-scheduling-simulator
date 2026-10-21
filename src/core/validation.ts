/**
 * Validates an array of process inputs for the CPU Scheduling Simulator.
 * Returns all validation errors, not just the first.
 */
export function validateProcesses(
  processes: Array<{
    pid: string;
    arrivalTime: string | number;
    burstTime: string | number;
    priority: string | number;
  }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check at least one process
  if (!processes || processes.length === 0) {
    errors.push('At least one process is required.');
    return { valid: false, errors };
  }

  // Check for duplicate PIDs
  const pids = new Set<string>();

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const label = `Process ${i + 1}`;

    // PID validation
    if (!p.pid || p.pid.trim() === '') {
      errors.push(`${label}: PID must be non-empty.`);
    } else {
      if (pids.has(p.pid.trim())) {
        errors.push(`${label}: PID "${p.pid.trim()}" is a duplicate.`);
      }
      pids.add(p.pid.trim());
    }

    // Arrival Time validation
    const at = Number(p.arrivalTime);
    if (p.arrivalTime === '' || isNaN(at) || !Number.isInteger(at) || at < 0) {
      errors.push(`${label}: Arrival Time must be a non-negative integer.`);
    }

    // Burst Time validation
    const bt = Number(p.burstTime);
    if (p.burstTime === '' || isNaN(bt) || !Number.isInteger(bt) || bt <= 0) {
      errors.push(`${label}: Burst Time must be a positive integer.`);
    }

    // Priority validation
    const pr = Number(p.priority);
    if (p.priority === '' || isNaN(pr) || !Number.isInteger(pr)) {
      errors.push(`${label}: Priority must be an integer.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
