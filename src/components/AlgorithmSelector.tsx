import React from 'react';
import type { AlgorithmType, AlgorithmInfo as AlgorithmInfoType } from '../core/types';
import AlgorithmInfo from './AlgorithmInfo';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  quantum: number;
  onQuantumChange: (quantum: number) => void;
}

const ALGORITHM_INFO_MAP: Record<AlgorithmType, AlgorithmInfoType> = {
  fcfs: {
    name: 'First Come First Serve (FCFS)',
    shortName: 'FCFS',
    description:
      'Processes are executed in the order of their arrival.',
    pros: [
      'Simple and easy to implement',
      'Fair in order of arrival',
    ],
    cons: [
      'Convoy effect',
      'High average waiting time with long processes',
      'Not optimal for interactive systems',
    ],
    preemptive: false,
  },
  sjf: {
    name: 'Shortest Job First (SJF)',
    shortName: 'SJF',
    description:
      'Selects the process with the shortest burst time.',
    pros: [
      'Optimal average waiting time for non-preemptive',
      'Reduces average wait time',
    ],
    cons: [
      'May cause starvation of longer processes',
      'Requires knowledge of burst times',
      'Not practical for interactive systems',
    ],
    preemptive: false,
  },
  srtf: {
    name: 'Shortest Remaining Time First (SRTF)',
    shortName: 'SRTF',
    description:
      'Preemptive version of SJF. Always runs the process with the shortest remaining burst time.',
    pros: [
      'Optimal average waiting time',
      'More responsive than SJF',
    ],
    cons: [
      'Higher overhead due to frequent context switches',
      'Starvation of longer processes',
      'Requires continuous tracking of remaining times',
    ],
    preemptive: true,
  },
  roundRobin: {
    name: 'Round Robin (RR)',
    shortName: 'RR',
    description:
      'Each process gets a fixed time quantum. If not finished, it is placed at the back of the queue.',
    pros: [
      'Fair allocation of CPU time',
      'Good response time for short processes',
      'No starvation',
    ],
    cons: [
      'Performance depends heavily on quantum size',
      'Higher average waiting time than SJF',
      'Context switch overhead',
    ],
    preemptive: true,
  },
  priorityNonPreemptive: {
    name: 'Priority Scheduling (Non-preemptive)',
    shortName: 'Priority (NP)',
    description:
      'Selects the process with the highest priority (lowest number). Runs to completion.',
    pros: [
      'Supports prioritization of important tasks',
      'Flexible scheduling',
    ],
    cons: [
      'May cause starvation of low-priority processes',
      'Priority inversion problems',
      'No aging mechanism',
    ],
    preemptive: false,
  },
  priorityPreemptive: {
    name: 'Priority Scheduling (Preemptive)',
    shortName: 'Priority (P)',
    description:
      'Always runs the highest-priority eligible process. Preempts if a higher-priority process arrives.',
    pros: [
      'Most important tasks always execute first',
      'Very responsive for high-priority processes',
    ],
    cons: [
      'May cause starvation',
      'Frequent context switches for highly varied priorities',
      'Priority inversion',
    ],
    preemptive: true,
  },
};

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
}) => {
  const info = ALGORITHM_INFO_MAP[selectedAlgorithm];

  return (
    <div className="algorithm-selector">
      <div className="algorithm-selector-controls">
        <div className="select-group">
          <label htmlFor="algorithm-select" className="select-label">
            Scheduling Algorithm
          </label>
          <select
            id="algorithm-select"
            className="select-input"
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
          >
            <option value="fcfs">First Come First Serve (FCFS)</option>
            <option value="sjf">Shortest Job First (SJF)</option>
            <option value="srtf">Shortest Remaining Time First (SRTF)</option>
            <option value="roundRobin">Round Robin (RR)</option>
            <option value="priorityNonPreemptive">Priority (Non-preemptive)</option>
            <option value="priorityPreemptive">Priority (Preemptive)</option>
          </select>
        </div>

        {selectedAlgorithm === 'roundRobin' && (
          <div className="select-group">
            <label htmlFor="quantum-input" className="select-label">
              Time Quantum
            </label>
            <input
              id="quantum-input"
              className="quantum-input"
              type="number"
              min={1}
              value={quantum}
              onChange={(e) => onQuantumChange(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <AlgorithmInfo info={info} />
    </div>
  );
};

export default AlgorithmSelector;
