import { type Color, type PieceSymbol, type Square } from "chess.js";
import { useState } from "react";

const unicodePieceMap: Record<string, string> = {
  pw: "♙", pb: "♟",
  rw: "♖", rb: "♜",
  nw: "♘", nb: "♞",
  bw: "♗", bb: "♝",
  qw: "♕", qb: "♛",
  kw: "♔", kb: "♚"
};

export const ChessBoard = ({ chess, board, socket, setBoard }: {

  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
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
                  setFrom(squareRepresentation);
                } else {
                  socket.send(JSON.stringify({
                    type: "move",
                    payload: {
                      from: from,
                      to: squareRepresentation
                    }
                  })
                  );
                  setFrom(null);
                  chess.move({
                    from,
                    to: squareRepresentation
                  });

                  setBoard(chess.board());
                  console.log("Move sent:", from, "to", squareRepresentation);
                }
              }}
                className={`w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 ${(i + j) % 2 === 0 ? "bg-[#8f5f36]" : "bg-[#dcae83]"
                  } ${from === squareRepresentation ? "ring-4 ring-yellow-400 ring-opacity-75 shadow-lg" : ""
                  } ${square && from === squareRepresentation ? "scale-110" : ""
                  }`}
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
