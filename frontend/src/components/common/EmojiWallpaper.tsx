import { useMemo } from 'react';

const POOL = ['😊', '🌈', '☀️', '✨', '💛', '🎉', '🌹', '💖', '😎', '⚡', '🌊', '🦋', '💫', '🌟', '👑', '🎵', '💝', '🌸', '🕯️', '☁️', '🖤', '🦋'];

interface Cell {
  key: number;
  left: number;
  top: number;
  rotate: number;
  emoji: string;
  variant: 'dp-far' | 'dp-mid' | 'dp-near';
  dur: string;
  delay: string;
}

const VARIANTS: Cell['variant'][] = ['dp-far', 'dp-mid', 'dp-near'];
const COLS = 11;
const ROWS = 12;

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const cx = (c + 0.5 + Math.sin(i * 3.7 + r * 1.3) * 0.28) * (100 / COLS);
    const cy = (r + 0.5 + Math.cos(i * 2.1 + c * 1.9) * 0.28) * (100 / ROWS);
    const rotate = Math.round((i * 137.508) % 360);
    const dur = (4 + (i % 5) * 0.8).toFixed(1);
    const delay = (-(Math.sin(i * 2.399) * 0.5 + 0.5) * Number(dur)).toFixed(2);
    cells.push({
      key: i,
      left: Number(cx.toFixed(1)),
      top: Number(cy.toFixed(1)),
      rotate,
      emoji: POOL[i % POOL.length],
      variant: VARIANTS[i % 3],
      dur: `${dur}s`,
      delay: `${delay}s`,
    });
  }
  return cells;
}

export function EmojiWallpaper() {
  const cells = useMemo(buildCells, []);
  return (
    <div className="view-emoji-bg" aria-hidden="true">
      {cells.map((cell) => (
        <div
          key={cell.key}
          style={{
            position: 'absolute',
            left: `${cell.left}%`,
            top: `${cell.top}%`,
            transform: `translate(-50%, -50%) rotate(${cell.rotate}deg)`,
            lineHeight: 1,
          }}
        >
          <span
            className={cell.variant}
            style={{
              display: 'block',
              lineHeight: 1,
              animation: `nod ${cell.dur} ${cell.delay} ease-in-out infinite`,
            }}
          >
            {cell.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
