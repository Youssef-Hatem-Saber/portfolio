import React, { useState, useEffect, useRef } from 'react';

interface PuzzlePiece {
  id: number;
  correctCol: number;
  correctRow: number;
  // Current coordinates (relative to the board / container)
  x: number;
  y: number;
  isSnapped: boolean;
}

interface PuzzleBoardProps {
  imageUrl: string;
  onSolved: () => void;
}

const COLS = 7;
const ROWS = 5;
const TOTAL_PIECES = COLS * ROWS;

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ imageUrl, onSolved }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [activePieceId, setActivePieceId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle board resizing responsively
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Limit width on desktop to be readable
        const containerWidth = Math.min(containerRef.current.clientWidth, 560);
        setBoardWidth(containerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and shuffle pieces once board width is calculated
  useEffect(() => {
    if (boardWidth === 0) return;

    const cellW = boardWidth / COLS;

    const initialPieces: PuzzlePiece[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const id = r * COLS + c;
        initialPieces.push({
          id,
          correctCol: c,
          correctRow: r,
          // Scatter randomly in a tray area below the board
          // The board height is boardWidth * (5 / 7). We put pieces below that.
          x: Math.random() * (boardWidth - cellW),
          y: boardWidth * (ROWS / COLS) + 20 + Math.random() * 120,
          isSnapped: false,
        });
      }
    }

    // Shuffle array
    setPieces(initialPieces.sort(() => Math.random() - 0.5));
  }, [boardWidth]);

  const cellW = boardWidth / COLS;
  const cellH = boardWidth / COLS; // Since COLS=7, ROWS=5, 7:5 ratio means cell is square!
  const boardHeight = cellH * ROWS;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, piece: PuzzlePiece) => {
    if (piece.isSnapped) return;
    e.preventDefault();
    setActivePieceId(piece.id);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, piece: PuzzlePiece) => {
    if (activePieceId !== piece.id) return;
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // Constrain within the container bounds
    const maxW = boardWidth - cellW;
    const maxH = boardHeight + 180 - cellH; // board + tray height
    const x = Math.max(0, Math.min(newX, maxW));
    const y = Math.max(0, Math.min(newY, maxH));

    setPieces((prev) =>
      prev.map((p) => (p.id === piece.id ? { ...p, x, y } : p))
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, piece: PuzzlePiece) => {
    if (activePieceId !== piece.id) return;
    setActivePieceId(null);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Check if the piece is dropped near its correct target cell on the board
    const targetX = piece.correctCol * cellW;
    const targetY = piece.correctRow * cellH;

    const distance = Math.sqrt(Math.pow(piece.x - targetX, 2) + Math.pow(piece.y - targetY, 2));

    // If within 25 pixels, snap it!
    if (distance < 28) {
      setPieces((prev) => {
        const updated = prev.map((p) =>
          p.id === piece.id ? { ...p, x: targetX, y: targetY, isSnapped: true } : p
        );

        // Check if all are snapped
        const allSnapped = updated.every((p) => p.isSnapped);
        if (allSnapped) {
          setTimeout(() => {
            onSolved();
          }, 600);
        }

        return updated;
      });
    }
  };



  if (boardWidth === 0) {
    return (
      <div ref={containerRef} className="w-full h-64 flex items-center justify-center text-gray-400">
        جاري تحميل لوحة البازل...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-slate-950/40 border border-white/5"
        style={{ height: `${boardHeight + 180}px`, maxWidth: '560px' }}
      >
        {/* Ghost background target image */}
        <div
          className="absolute border border-dashed border-blue-500/20 rounded-xl overflow-hidden opacity-10 pointer-events-none transition-opacity duration-300"
          style={{
            width: `${boardWidth}px`,
            height: `${boardHeight}px`,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${boardWidth}px ${boardHeight}px`,
          }}
        ></div>

        {/* Board grid lines for helper */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            width: `${boardWidth}px`,
            height: `${boardHeight}px`,
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {Array.from({ length: TOTAL_PIECES }).map((_, i) => (
            <div key={i} className="border border-white/5"></div>
          ))}
        </div>

        {/* Tray divider label */}
        <div
          className="absolute left-4 right-4 text-center border-t border-white/10 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-widest pointer-events-none"
          style={{ top: `${boardHeight + 10}px` }}
        >
          اسحب القطع من هنا ورتبها بالأعلى 👇
        </div>

        {/* Render Puzzle Pieces */}
        {pieces.map((piece) => {
          const isDragging = activePieceId === piece.id;
          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePointerDown(e, piece)}
              onPointerMove={(e) => handlePointerMove(e, piece)}
              onPointerUp={(e) => handlePointerUp(e, piece)}
              style={{
                position: 'absolute',
                width: `${cellW}px`,
                height: `${cellH}px`,
                left: `${piece.x}px`,
                top: `${piece.y}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${boardWidth}px ${boardHeight}px`,
                backgroundPosition: `-${piece.correctCol * cellW}px -${piece.correctRow * cellH}px`,
                zIndex: piece.isSnapped ? 1 : isDragging ? 50 : 10,
                cursor: piece.isSnapped ? 'default' : isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              className={`rounded-[2px] transition-all duration-75 ${
                piece.isSnapped
                  ? 'border border-transparent shadow-none brightness-100'
                  : isDragging
                  ? 'scale-110 shadow-2xl brightness-110 border border-blue-400 z-50'
                  : 'border border-white/20 hover:border-white/40 shadow-md hover:brightness-105'
              }`}
            ></div>
          );
        })}
      </div>


    </div>
  );
};

export default PuzzleBoard;
