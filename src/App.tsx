import { useState, useCallback } from 'react';
import type { Process, AlgorithmType, SchedulingResult } from './core/types';
import { validateProcesses } from './core/validation';
import { runAlgorithm } from './algorithms';
import type { ComparisonRow } from './core/scheduler';
import { runAllAlgorithms } from './core/scheduler';
import { sampleProcesses } from './data/sampleProcesses';
import ProcessInputTable from './components/ProcessInputTable';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsTable from './components/MetricsTable';
import SummaryMetrics from './components/SummaryMetrics';
import ComparisonTable from './components/ComparisonTable';

interface ProcessInput {
  pid: string;
  arrivalTime: string;
  burstTime: string;
  priority: string;
}

function App() {
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { pid: 'P1', arrivalTime: '', burstTime: '', priority: '' },
  ]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('fcfs');
  const [quantum, setQuantum] = useState<number>(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleLoadSample = useCallback(() => {
    setProcesses(
      sampleProcesses.map((p) => ({
        pid: p.pid,
        arrivalTime: String(p.arrivalTime),
        burstTime: String(p.burstTime),
        priority: String(p.priority),
      }))
    );
    setResult(null);
    setComparison(null);
    setErrors([]);
  }, []);

  const handleReset = useCallback(() => {
    setProcesses([{ pid: 'P1', arrivalTime: '', burstTime: '', priority: '' }]);
    setResult(null);
    setComparison(null);
    setErrors([]);
  }, []);

  const handleProcessesChange = useCallback(
    (newProcesses: ProcessInput[]) => {
      setProcesses(newProcesses);
      // Invalidate previous results when input changes
      setResult(null);
      setComparison(null);
      setErrors([]);
    },
    []
  );

  const handleAlgorithmChange = useCallback((algorithm: AlgorithmType) => {
    setSelectedAlgorithm(algorithm);
    setResult(null);
    setComparison(null);
  }, []);

  const handleQuantumChange = useCallback((q: number) => {
    setQuantum(q);
    setResult(null);
    setComparison(null);
  }, []);

  const handleRunSimulation = useCallback(() => {
    // Validate
    const validation = validateProcesses(processes);
    if (!validation.valid) {
      setErrors(validation.errors);
      setResult(null);
      setComparison(null);
      return;
    }

    // Validate quantum for RR
    if (selectedAlgorithm === 'roundRobin' && (!Number.isInteger(quantum) || quantum <= 0)) {
      setErrors(['Time quantum must be a positive integer.']);
      setResult(null);
      setComparison(null);
      return;
    }

    setErrors([]);

    // Convert input to Process objects
    const processData: Process[] = processes.map((p, index) => ({
      pid: p.pid.trim(),
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      priority: Number(p.priority),
      inputOrder: index,
    }));

    // Run selected algorithm
    const selectedResult = runAlgorithm(selectedAlgorithm, processData, quantum);
    setResult(selectedResult);

    // Run all algorithms for comparison
    const comparisonData = runAllAlgorithms(processData, quantum);
    setComparison(comparisonData);
  }, [processes, selectedAlgorithm, quantum]);

  return (
    <div className="app">
      {/* Section 1: Header */}
      <header className="app-header">
        <h1>CPU Scheduling Simulator</h1>
        <p className="subtitle">
          An interactive visualization and comparison of CPU scheduling algorithms.
        </p>
      </header>

      {/* Section 2: Process Input */}
      <section className="section">
        <h2 className="section-title">Process Input</h2>
        <ProcessInputTable
          processes={processes}
          setProcesses={handleProcessesChange}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
        />
      </section>

      {/* Section 3: Algorithm Selection */}
      <section className="section">
        <h2 className="section-title">Algorithm Selection</h2>
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={handleAlgorithmChange}
          quantum={quantum}
          onQuantumChange={handleQuantumChange}
        />
        <div className="run-section">
          <button className="btn btn-run" onClick={handleRunSimulation}>
            Run Simulation
          </button>
        </div>
      </section>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="error-box">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4: Gantt Chart */}
      {result && (
        <section className="section">
          <h2 className="section-title">Execution Timeline</h2>
          <GanttChart ganttChart={result.ganttChart} />
        </section>
      )}

      {/* Section 5: Scheduling Metrics */}
      {result && (
        <section className="section">
          <h2 className="section-title">Scheduling Metrics</h2>
          <MetricsTable metrics={result.processMetrics} />
          <SummaryMetrics averageMetrics={result.averageMetrics} />
        </section>
      )}

      {/* Section 6: Algorithm Comparison */}
      {comparison && (
        <section className="section">
          <h2 className="section-title">Algorithm Comparison</h2>
          <ComparisonTable data={comparison} />
        </section>
      )}
    </div>
  );
}

export default App;
