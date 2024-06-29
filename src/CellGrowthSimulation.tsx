import React, { useState, useEffect, useRef } from 'react';
import { getNextGeneration } from './CellGrowth';

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

  return (
    <div className="App">
      <h1>Cell Growth Simulation</h1>
      <div className="controls">
        <div>
          <button onClick={handleStartPause}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div>
          <label>
            Growth Interval (ms):
            <input
              type="number"
              value={growthRate}
              onChange={handleGrowthRateChange}
              min="100"
              step="100"
            />
          </label>
          <label>
            Grid Size:
            <input
              type="number"
              value={gridSize}
              onChange={handleGridSizeChange}
              min="10"
              max="50"
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
                key={cellKey}
                onClick={() => toggleCell(row, col)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleCell(row, col)}
                className={`cell ${cells.has(cellKey) ? 'occupied' : ''}`}
                aria-label={`Cell ${row + 1}, ${col + 1} ${cells.has(cellKey) ? 'occupied' : 'empty'}`}
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
