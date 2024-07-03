import React, { useState, useEffect, useRef } from 'react';
import { getNextGeneration } from '../utils/CellGrowth';

const initialGridSize = 20;
const initialGrowthRate = 1000;

const isGridFull = (cells: Set<string>, gridSize: number): boolean => {
  return cells.size === gridSize * gridSize;
};

const CellGrowthSimulation: React.FC = () => {
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [growthRate, setGrowthRate] = useState(initialGrowthRate);
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [growthHistory, setGrowthHistory] = useState<number[]>([]);
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      if (isGridFull(cells, gridSize)) {
        setIsRunning(false);
        setGrowthHistory((prevHistory) => [...prevHistory, cells.size]);
        return;
      }
      intervalRef.current = window.setInterval(() => {
        setCells((prevCells) => {
          const nextGeneration = getNextGeneration(prevCells, gridSize);
          setGrowthHistory((prevHistory) => [...prevHistory, nextGeneration.size]);
          if (isGridFull(nextGeneration, gridSize)) {
            setIsRunning(false);
          }
          return nextGeneration;
        });
      }, growthRate);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, growthRate, gridSize, cells]);

  const toggleCell = (x: number, y: number) => {
    const cellKey = `${x},${y}`;
    setCells((prevCells) => {
      const newCells = new Set(prevCells);
      if (newCells.has(cellKey)) {
        newCells.delete(cellKey);
      } else {
        newCells.add(cellKey);
      }
      return newCells;
    });
  };

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCells(new Set());
    setGrowthHistory([]);
  };

  const handleGrowthRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrowthRate(Number(event.target.value));
  };

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value);
    setGridSize(newSize);
    setCells(new Set());
    setGrowthHistory([]);
  };

  //Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, row: number, col: number) => { 
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleCell(row, col);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (row > 0) setFocusedCell([row - 1, col]);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (row < gridSize - 1) setFocusedCell([row + 1, col]);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (col > 0) setFocusedCell([row, col - 1]);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (col < gridSize - 1) setFocusedCell([row, col + 1]);
        break;
    }
  };

  useEffect(() => {
    if (focusedCell) {
      const [row, col] = focusedCell;
      const cellElement = document.getElementById(`cell-${row}-${col}`);
      cellElement?.focus();
    }
  }, [focusedCell]);

  return (
    <div className="App">
      <h1>Cell Growth Simulation</h1>
      <div className="controls">
        <div>
          <button
            onClick={handleStartPause}
            onKeyDown={(e) => e.key === 'Enter' && handleStartPause()}
            tabIndex={0}
            aria-pressed={isRunning}
            aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}  //aria-label for screen reader compatibility
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            tabIndex={0}
            aria-label="Reset simulation"
          >
            Reset
          </button>
        </div>
        <div>
          <label>
            Growth Interval (ms):
            <input
              type="number"
              value={growthRate}
              onChange={handleGrowthRateChange}
              onKeyDown={(e) => e.key === 'Enter' && handleGrowthRateChange(e as any)}
              min="100"
              step="100"
              tabIndex={0}
              aria-label="Set growth interval in milliseconds"
            />
          </label>
          <label>
            Grid Size:
            <input
              type="number"
              value={gridSize}
              onChange={handleGridSizeChange}
              onKeyDown={(e) => e.key === 'Enter' && handleGridSizeChange(e as any)}
              min="10"
              max="50"
              tabIndex={0}
              aria-label="Set grid size"
            />
          </label>
        </div>
      </div>
      <div
        role="grid"
        aria-label="Petri dish grid"
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gridTemplateRows: `repeat(${gridSize}, 20px)`,
        }}
      >
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => {
            const cellKey = `${row},${col}`;
            return (
              <div
                id={`cell-${row}-${col}`}
                key={cellKey}
                onClick={() => toggleCell(row, col)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, row, col)}
                className={`cell ${cells.has(cellKey) ? 'occupied' : ''}`}
                aria-label={`Cell ${row + 1}, ${col + 1} ${cells.has(cellKey) ? 'occupied' : 'empty'}`}
                aria-live="polite"
                aria-atomic="true"
              />
            );
          })
        )}
      </div>
      <h2>Growth History</h2>
      <div className="growth-history" aria-live="polite">
        {growthHistory.map((size, index) => (
          <div key={index}>Generation {index + 1}: {size} cells</div>
        ))}
      </div>
    </div>
  );
};

export default CellGrowthSimulation;
