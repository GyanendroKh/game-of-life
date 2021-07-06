import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

let gameState = false;

const App: FC = () => {
  const [playing, setPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const DIMS = useMemo(
    () => ({
      WIDTH: 25,
      HEIGHT: 20,
    }),
    []
  );
  const [board, setBoard] = useState<number[][]>(() => {
    return new Array(DIMS.HEIGHT).fill(new Array(DIMS.WIDTH).fill(0));
  });

  const generate = useCallback(() => {
    const randomPoints = new Map<number, number>();

    for (let i = 0; i < 100; i++) {
      const h = Math.floor(Math.random() * DIMS.HEIGHT);
      const w = Math.floor(Math.random() * DIMS.WIDTH);

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

    setGeneration((g) => g + 1);
  }, [DIMS]);

  useEffect(() => {
    let previousTime = 0.0;
    const loop = (time: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deltaTime = time - previousTime;
      previousTime = time;

      generate();

      if (gameState) {
        requestAnimationFrame(loop);
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
      {board.map((r, idx) => {
        return (
          <div className="row" key={idx}>
            {r.map((n, idxx) => {
              return (
                <div
                  key={`${idx}-${idxx}`}
                  className={`cell ${n === 1 ? "black" : "white"}`}
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
    </>
  );
};

export default App;
