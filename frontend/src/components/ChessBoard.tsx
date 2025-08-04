import { type Color, type PieceSymbol, type Square, Chess } from "chess.js";
import { useState } from "react";

const unicodePieceMap: Record<string, string> = {
  pb: "♙", pw: "♟",
  rb: "♖", rw: "♜",
  nb: "♘", nw: "♞",
  bb: "♗", bw: "♝",
  qb: "♕", qw: "♛",
  kb: "♔", kw: "♚"
};

export const ChessBoard = ({ chess, board, socket, setBoard, validMoves, setValidMoves, onRequestValidMoves, onError }: {

  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  validMoves: string[];
  setValidMoves: (moves: string[]) => void;
  onRequestValidMoves: (square: string) => void;
  onError?: (message: string) => void;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = (String.fromCharCode(97 + j) + (8 - i)) as Square;

            return (
              <div key={j} onClick={() => {
                if (!from) {
                  // Check if the square has a piece before selecting
                  if (square) {
                    setFrom(squareRepresentation);
                    // Clear previous valid moves and request new ones
                    setValidMoves([]);
                    onRequestValidMoves(squareRepresentation);
                  } else if (onError) {
                    onError("Please select a piece to move first!");
                  }
                } else {
                  // Check if trying to move to the same square
                  if (from === squareRepresentation) {
                    setFrom(null);
                    return;
                  }

                  // Send move to server for validation
                  console.log(`Sending move to server: ${from} to ${squareRepresentation}`);
                  socket.send(JSON.stringify({
                    type: "move",
                    payload: {
                      from: from,
                      to: squareRepresentation
                    }
                  }));
                  setFrom(null);
                  // Clear valid moves after making a move
                  setValidMoves([]);
                }
              }}
                className={`w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 ${validMoves.includes(squareRepresentation)
                  ? "bg-gray-300 bg-opacity-50"
                  : (i + j) % 2 === 0 ? "bg-[#8f5f36]" : "bg-[#dcae83]"
                  } ${from === squareRepresentation ? "ring-4 ring-yellow-400 ring-opacity-75 shadow-lg" : ""
                  } ${square && from === squareRepresentation ? "scale-110" : ""
                  } ${validMoves.includes(squareRepresentation) ? "ring-4 ring-neutral-500 ring-opacity-100 shadow-xl" : ""
                  }`}
                // Debug logging
                onMouseEnter={() => {
                  if (validMoves.length > 0) {
                    console.log(`Square: ${squareRepresentation}, Valid moves: ${validMoves}, Includes: ${validMoves.includes(squareRepresentation)}`);
                  }
                }}
                style={{ fontFamily: "'Segoe UI Symbol', 'Arial Unicode MS', Arial, sans-serif" }}
              >
                {square ? unicodePieceMap[square.type + square.color] : ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
