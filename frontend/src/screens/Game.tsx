
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { Warning } from "../components/Warning"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useRef, useState } from "react"
import { Chess } from "chess.js"
import { UserTurn } from "../components/UserTurn"

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const BOARD_UPDATE = "BOARD_UPDATE";
export const GET_VALID_MOVES = "GET_VALID_MOVES";
export const VALID_MOVES_RESPONSE = "VALID_MOVES_RESPONSE";
export const ERROR = "ERROR";

export const Game = () => {


    const chesss = useRef(new Chess());
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [warning, setWarning] = useState({ message: "", isVisible: false });
    const [validMoves, setValidMoves] = useState<string[]>([]);
    const [turn, setTurn] = useState<'w' | 'b'>('w');

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized");
                    break;

                case BOARD_UPDATE:
                    {
                        const { board: newBoard, turn } = message.payload;
                        const newTurn = message.payload.turn;
                        setBoard(newBoard);
                        console.log("Board updated, current turn:", turn);
                        setTurn(newTurn);
                    }
                    break;

                case MOVE:
                    {
                        const move = message.payload;
                        chess.move(move);
                        setBoard(chess.board())
                    }
                    console.log("Move made");
                    break;

                case GAME_OVER:
                    console.log("GAME IS OVERR");
                    break;

                case ERROR:
                    {
                        const { message: errorMessage } = message.payload;
                        setWarning({ message: errorMessage, isVisible: true });
                        console.log("Error received:", errorMessage);
                    }
                    break;

                case VALID_MOVES_RESPONSE:
                    {
                        const { moves } = message.payload;
                        setValidMoves(moves);
                        console.log("Valid moves received:", moves);
                    }
                    break;
            }
        }
    })


    const closeWarning = () => {
        setWarning({ message: "", isVisible: false });
    };

    const requestValidMoves = (square: string) => {
        if (socket) {
            socket.send(JSON.stringify({
                type: GET_VALID_MOVES,
                payload: { square }
            }));
        }
    };

    if (!socket) {
        return <div>
            Loadinggg........
        </div>
    }

    return (
        <div className="flex justify-center">
            <Warning
                message={warning.message}
                isVisible={warning.isVisible}
                onClose={closeWarning}
            />
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full ">
                    <div className="col-span-4  w-full flex justify-center">
                        <ChessBoard
                            chess={chesss.current}
                            board={board}
                            socket={socket}
                            setBoard={setBoard}
                            validMoves={validMoves}
                            setValidMoves={setValidMoves}
                            onRequestValidMoves={requestValidMoves}
                            onError={(message) => setWarning({ message, isVisible: true })}
                        />
                    </div>
                    <div className="col-span-2  w-full flex justify-center">
                        <div className="pt-8">
                            <Button onClick={() => {
                                socket.send(JSON.stringify({
                                    type: INIT_GAME
                                }))
                            }}>Play

                            </Button>
                            <UserTurn user={turn} />
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}