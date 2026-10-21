# CPU Scheduling Simulator

An interactive browser-based CPU scheduling simulator built for an undergraduate Operating Systems course. Visualize and compare six fundamental CPU scheduling algorithms with Gantt charts, per-process metrics, and side-by-side algorithm comparison.

## Features

- **Six Scheduling Algorithms**: FCFS, SJF, SRTF, Round Robin, Priority (Non-preemptive), Priority (Preemptive)
- **Interactive Process Input**: Add, edit, and remove processes via an editable table
- **Sample Workload**: One-click loading of a predefined 4-process workload
- **Gantt Chart Visualization**: Color-coded, proportional timeline with idle-time representation
- **Scheduling Metrics**: Per-process CT, TAT, WT, RT with averages displayed to two decimal places
- **Algorithm Comparison Table**: All six algorithms compared on the same workload simultaneously
- **Algorithm Information**: Description, pros, cons, and preemptive/non-preemptive classification
- **Input Validation**: Clear error messages for invalid inputs
- **Configurable Round Robin Quantum**: User-adjustable time quantum (default: 2)

## Technology Stack

- **Vite** — Fast build tool and dev server
- **React 19** — UI framework
- **TypeScript** — Type-safe development
- **CSS** — Custom styling (no external UI library)

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone or navigate to the project directory
cd project

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Usage

1. **Add processes** using the "Add Process" button, or click **"Load Sample Data"** for a quick start.
2. **Fill in** PID, Arrival Time, Burst Time, and Priority for each process.
3. **Select a scheduling algorithm** from the dropdown.
4. If using Round Robin, **adjust the time quantum** as needed (default: 2).
5. Click **"Run Simulation"**.
6. View the **Gantt chart**, **per-process metrics**, and **average metrics**.
7. Scroll down to see the **algorithm comparison table** with all six algorithms.

## Supported Scheduling Algorithms

| Algorithm | Type | Description |
|---|---|---|
| FCFS | Non-preemptive | Executes processes in arrival order |
| SJF | Non-preemptive | Selects the process with shortest burst time |
| SRTF | Preemptive | Always runs the process with shortest remaining time |
| Round Robin | Preemptive | Fixed time quantum with FIFO ready queue |
| Priority (NP) | Non-preemptive | Runs highest-priority (lowest number) process to completion |
| Priority (P) | Preemptive | Always runs highest-priority process; preempts on strictly higher |

## Project Structure

```
src/
  algorithms/          # Pure-function scheduling algorithm implementations
    fcfs.ts            # First Come First Serve
    sjf.ts             # Shortest Job First
    srtf.ts            # Shortest Remaining Time First
    roundRobin.ts      # Round Robin
    priority.ts        # Priority (both variants)
    index.ts           # Algorithm runner and re-exports

  components/          # React UI components
    ProcessInputTable.tsx   # Editable process input table
    AlgorithmSelector.tsx   # Algorithm dropdown and quantum input
    AlgorithmInfo.tsx       # Algorithm description, pros/cons
    GanttChart.tsx          # Visual Gantt chart timeline
    MetricsTable.tsx        # Per-process metrics table
    SummaryMetrics.tsx      # Average metric cards
    ComparisonTable.tsx     # Six-algorithm comparison table

  core/                # Shared types, utilities, and metric calculations
    types.ts           # TypeScript type definitions
    metrics.ts         # Metric calculation functions
    scheduler.ts       # Run-all-algorithms comparison helper
    validation.ts      # Input validation

  data/
    sampleProcesses.ts # Predefined sample workload

  App.tsx              # Main application component
  main.tsx             # Application entry point
  index.css            # Global styles
```

## License

This project was developed for educational purposes as part of an Operating Systems course.
