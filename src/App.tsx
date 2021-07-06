import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

let gameState = false;

const App: FC = () => {
  const [playing, setPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const DIMS = useMemo(
    () => ({
      X: 15,
      Y: 15,
    }),
    []
  );
  const initialState = useMemo(
    () => new Array(DIMS.X).fill(new Array(DIMS.Y).fill(0)),
    [DIMS]
  );
  const [board, setBoard] = useState<number[][]>(initialState);

  const getNeighbours = useCallback(
    (x: number, y: number) => {
      const neighbours: { x: number; y: number }[] = [];

      for (let xAdd = -1; xAdd < 2; xAdd++) {
        const newX = x + xAdd;

        if (newX >= 0 && newX <= DIMS.X - 1) {
          for (let yAdd = -1; yAdd < 2; yAdd++) {
            const newY = y + yAdd;

            if (newY >= 0 && newY <= DIMS.X - 1) {
              if (newY === y && newX === x) {
                continue;
              }
              neighbours.push({ x: newX, y: newY });
            }
          }
        }
      }

      return neighbours;
    },
    [DIMS]
  );

  const randomize = useCallback(() => {
    const randomPoints = new Map<number, number>();

    for (let i = 0; i < 30; i++) {
      const h = Math.floor(Math.random() * DIMS.X);
      const w = Math.floor(Math.random() * DIMS.Y);

      randomPoints.set(h, w);
    }

    setBoard((curr) => {
      return curr.map((r, idx) => {
        return r.map((_, idxx) => {
          if (randomPoints.has(idx)) {
            if (randomPoints.get(idx) === idxx) {
              return 1;
            }
          }

          return 0;
        });
      });
    });
  }, [DIMS]);

  const generate = useCallback(() => {
    setBoard((curr) => {
      return curr.map((r, x) => {
        return r.map((n, y) => {
          const isDead = n === 0;
          const neighbours = getNeighbours(x, y);

          const liveNeighbours = neighbours.filter((n) => {
            return curr[n.x][n.y] === 1;
          });

          if (
            !isDead &&
            (liveNeighbours.length === 2 || liveNeighbours.length === 3)
          ) {
            return 1;
          }

          if (isDead && liveNeighbours.length === 3) {
            return 1;
          }

          return 0;
        });
      });
    });

    setGeneration((g) => g + 1);
  }, [getNeighbours]);

  useEffect(() => {
    let previousTime = 0.0;
    const loop = (time: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deltaTime = time - previousTime;
      previousTime = time;

      generate();

      if (gameState) {
        setTimeout(() => {
          requestAnimationFrame(loop);
        }, 150);
      }
    };

    if (playing) {
      requestAnimationFrame(loop);
    }
  }, [generate, playing]);

  useEffect(() => {
    gameState = playing;
  }, [playing]);

  return (
    <>
      {board.map((r, x) => {
        return (
          <div className="row" key={x}>
            {r.map((n, y) => {
              return (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${n === 1 ? "black" : "white"}`}
                  onClick={() => {
                    setBoard((curr) => {
                      return curr.map((r, bx) => {
                        if (bx === x) {
                          return r.map((b, by) => {
                            if (by === y) {
                              return b === 1 ? 0 : 1;
                            }

                            return b;
                          });
                        }

                        return r;
                      });
                    });
                  }}
                />
              );
            })}
          </div>
        );
      })}
      <br />
      <div>Generation: {generation}</div>
      <br />
      <button onClick={() => setPlaying((curr) => !curr)}>
        {playing ? "Pause" : "Play"}
      </button>
      &nbsp;
      <button onClick={() => randomize()}>Randomize</button>
      &nbsp;
      <button
        onClick={() => {
          setBoard(initialState);
          setGeneration(0);
        }}
      >
        Clear
      </button>
    </>
  );
};

export default App;
