import React, { useCallback, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import produce from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });
  const [genCount, setGenCount] = useState(0);
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        setGenCount(prevCount => prevCount + .5);
        for (let i = 0; i < numRows; i++) {
          
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;

            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <>
    
      <div style={{
        margin: "40px",
        fontWeight: "bold",
        gridTemplateColumns: `repeat(${numCols}, 20px`
      }}>
        Conway's Game Of Life
      </div>

      <div style={{
        margin: "40px"
      }}>
        1. Any live cell with two or three live neighbours survives.<br></br><br></br>
          2. Any dead cell with three live neighbours becomes a live cell.<br></br><br></br>
          3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      </div>

      <div style={{
        margin: "20px 20px 20px 40px",
        width: "140px",
        padding: "20px",
        border: "1px solid black"
      }}>
        genCount = {genCount}
      </div>

      <button
        style={{
          margin: "20px 20px 20px 40px",
          color: "white",
          background: "black"
        }}
        onClick={() => {
          
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>

      <button
        style={{
          margin: "20px",
          color: "white",
          background: "black"
        }}
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0));
          }

          setGrid(rows);
        }}
      >
        Random
      </button>

      <button
        style={{
          margin: "20px",
          color: "white",
          background: "black"
        }}
        onClick={() => {
          setGenCount(0)
          setGrid(generateEmptyGrid());
        }}>
        Clear
      </button>

      <button
        style={{
          margin: "20px",
          color: "white",
          background: "black"
        }}
        onClick={() => {
          setTimeout(runSimulation, 0)
        }}>
        Fast
      </button>

      <button
        style={{
          margin: "20px",
          color: "white",
          background: "black"
        }}
        onClick={() => {
          setTimeout(runSimulation, 1000)
        }}>
        Faster
      </button>

      <button
        style={{
          margin: "20px",
          color: "white",
          background: "black"

        }}
        onClick={() => {
          setTimeout(runSimulation, 5000)
        }}>
        Fastest
      </button>

      <div style={{
        display: 'grid',
        margin: "0px 40px 40px 40px",
        gridTemplateColumns: `repeat(${numCols}, 20px`
      }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'green' : "black",
                border: "solid .5px white"
              }}
            />
          ))
        )}
      </div>
      
    </>
  );
};

export default App;
