# CPU Scheduling Simulator — Project Report

## 1. Project Title

**CPU Scheduling Simulator**
An Interactive Visualization and Comparison of CPU Scheduling Algorithms

## 2. Abstract

This project implements a browser-based CPU scheduling simulator that enables users to visualize and compare six fundamental CPU scheduling algorithms. The simulator accepts user-defined process workloads and produces Gantt chart timelines, per-process scheduling metrics (Completion Time, Turnaround Time, Waiting Time, Response Time), and a comparative analysis of all algorithms on the same input. Built with React and TypeScript, the application runs entirely in the browser with no backend dependencies.

## 3. Introduction

CPU scheduling is a fundamental function of operating systems that determines which process runs on the CPU at any given time. The choice of scheduling algorithm directly impacts system performance metrics such as throughput, response time, and fairness. Understanding these algorithms and their trade-offs is essential for operating systems education.

This simulator provides an interactive environment for students to experiment with different scheduling algorithms and immediately observe their effects on execution order and performance metrics. Rather than manually tracing algorithm execution on paper, students can modify process parameters and instantly see the resulting Gantt charts and calculated metrics.

## 4. Problem Statement

Understanding CPU scheduling algorithms through theoretical study alone can be challenging. Students often struggle to:

- Visualize how preemption affects execution order
- Understand the impact of tie-breaking rules on scheduling decisions
- Compare the performance characteristics of different algorithms on the same workload
- Manually compute scheduling metrics without errors

There is a need for an interactive tool that bridges the gap between theory and practice by providing immediate visual feedback for scheduling algorithm behavior.

## 5. Project Objectives

1. Implement six CPU scheduling algorithms: FCFS, SJF, SRTF, Round Robin, Priority (Non-preemptive), and Priority (Preemptive).
2. Provide an interactive interface for defining process workloads.
3. Visualize algorithm execution through Gantt charts.
4. Calculate and display per-process and average scheduling metrics.
5. Enable side-by-side comparison of all algorithms on the same workload.
6. Ensure correctness through deterministic tie-breaking and proper handling of edge cases (idle time, preemption, simultaneous arrivals).

## 6. Proposed System

The system is a single-page web application with the following modules:

- **Process Input Module**: An editable table for defining process workloads with validation.
- **Algorithm Selection Module**: A dropdown selector with algorithm descriptions and configuration options.
- **Scheduling Engine**: Pure-function implementations of all six algorithms, independent of the UI.
- **Visualization Module**: A Gantt chart renderer and metrics display tables.
- **Comparison Module**: Runs all algorithms independently and presents results side by side.

### System Workflow

1. User enters or loads process data.
2. User selects a scheduling algorithm and configures parameters (e.g., RR quantum).
3. User clicks "Run Simulation."
4. The system validates input and executes the selected algorithm.
5. The Gantt chart and per-process metrics are displayed.
6. All six algorithms are executed independently for comparison.
7. The comparison table is displayed.

## 7. Technology Stack

| Technology | Purpose |
|---|---|
| Vite | Build tool and development server |
| React 19 | User interface framework |
| TypeScript | Type-safe application development |
| CSS | Custom styling |
| HTML5 | Application structure |

No external backend, database, or third-party charting libraries are used. All computation occurs in the browser.

## 8. Implemented Scheduling Algorithms

### 8.1 First Come First Serve (FCFS)

- **Type**: Non-preemptive
- **Policy**: Processes execute in order of arrival time.
- **Tie-breaking**: Earlier input order.
- **Characteristics**: Simple but suffers from the convoy effect when long processes precede short ones.

### 8.2 Shortest Job First (SJF)

- **Type**: Non-preemptive
- **Policy**: Selects the arrived process with the shortest burst time.
- **Tie-breaking**: Shorter burst → earlier arrival → earlier input order.
- **Characteristics**: Optimal average waiting time among non-preemptive algorithms. May cause starvation of long processes.

### 8.3 Shortest Remaining Time First (SRTF)

- **Type**: Preemptive
- **Policy**: Always executes the process with the shortest remaining burst time. Preempts only when a newly arrived process has strictly less remaining time.
- **Tie-breaking**: Shorter remaining → earlier arrival → earlier input order.
- **Characteristics**: Optimal average waiting time overall. Higher context-switch overhead. May starve long processes.

### 8.4 Round Robin (RR)

- **Type**: Preemptive
- **Policy**: FIFO ready queue with a configurable time quantum (default: 2). Each process runs for at most one quantum before being requeued.
- **Queue ordering**: New arrivals at a quantum boundary are enqueued before the current process is requeued.
- **Characteristics**: Fair and starvation-free. Performance depends on quantum selection.

### 8.5 Priority Scheduling — Non-preemptive

- **Type**: Non-preemptive
- **Policy**: Selects the arrived process with the highest priority (lowest numeric value). Runs to completion.
- **Tie-breaking**: Lower priority number → earlier arrival → earlier input order.
- **Characteristics**: Flexible but may cause starvation of low-priority processes.

### 8.6 Priority Scheduling — Preemptive

- **Type**: Preemptive
- **Policy**: Always runs the highest-priority eligible process. Preempts only when a newly arrived process has strictly higher priority (strictly lower number). Equal priority does not preempt.
- **Tie-breaking**: Lower priority number → earlier arrival → earlier input order.
- **Characteristics**: Very responsive for high-priority tasks. May starve low-priority processes.

## 9. Scheduling Metric Formulas

For each process:

| Metric | Formula |
|---|---|
| Completion Time (CT) | Time when the process finishes its final execution |
| Turnaround Time (TAT) | CT − AT |
| Waiting Time (WT) | TAT − BT |
| Response Time (RT) | First CPU Start Time − AT |

Average metrics:

| Metric | Formula |
|---|---|
| Average WT | Σ WT / n |
| Average TAT | Σ TAT / n |
| Average RT | Σ RT / n |

Where n is the number of processes. Averages are displayed to two decimal places while retaining full internal precision.

## 10. System Architecture

The application follows a modular architecture with clear separation of concerns:

```
┌───────────────────────────────────────────────────┐
│                    App.tsx                        │
│              (State Management)                   │
├─────────┬──────────┬──────────┬───────────────────┤
│ Process │Algorithm │  Gantt   │   Comparison      │
│ Input   │Selector  │  Chart   │   Table           │
│ Table   │+ Info    │+ Metrics │                   │
├─────────┴──────────┴──────────┴───────────────────┤
│              Core Layer                           │
│  types.ts │ metrics.ts │ validation.ts │scheduler │
├───────────────────────────────────────────────────┤
│           Algorithm Layer                         │
│  fcfs │ sjf │ srtf │ roundRobin │ priority        │
└───────────────────────────────────────────────────┘
```

**Key design decisions:**

- Scheduling algorithms are implemented as pure functions, independent of React.
- All algorithms accept the same `Process` interface and return the same `SchedulingResult` structure.
- Metric calculation is centralized in `metrics.ts` to avoid code duplication.
- The comparison module runs each algorithm independently with deep-copied input data.

## 11. Current Implementation Status

| Feature | Status |
|---|---|
| FCFS algorithm | ✅ Implemented |
| SJF algorithm | ✅ Implemented |
| SRTF algorithm | ✅ Implemented |
| Round Robin algorithm | ✅ Implemented |
| Priority (Non-preemptive) algorithm | ✅ Implemented |
| Priority (Preemptive) algorithm | ✅ Implemented |
| Process input table (add/edit/remove) | ✅ Implemented |
| Sample workload loading | ✅ Implemented |
| Input validation | ✅ Implemented |
| Algorithm selection with info | ✅ Implemented |
| Configurable RR quantum | ✅ Implemented |
| Gantt chart visualization | ✅ Implemented |
| Per-process metrics table | ✅ Implemented |
| Average metrics display | ✅ Implemented |
| Algorithm comparison table | ✅ Implemented |
| Idle time handling | ✅ Implemented |
| Preemption handling | ✅ Implemented |
| Deterministic tie-breaking | ✅ Implemented |
| Production build | ✅ Passing |

## 12. Planned Future Enhancements

The following features are planned for subsequent project phases:

1. **Automated Testing**: Unit tests for all scheduling algorithms, integration tests for the UI, and end-to-end tests for the full workflow.
2. **Detailed Algorithm Analysis**: Comprehensive theoretical and empirical comparison of algorithm behavior across varied workloads.
3. **Step-by-Step Execution**: Animated or step-by-step playback of scheduling decisions.
4. **Extended Metrics**: Additional performance benchmarks and statistical analysis.
5. **Advanced Features**: Context-switch overhead simulation, process I/O bursts, priority aging.
6. **Export Functionality**: Process import/export capabilities.
