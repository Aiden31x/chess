"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        //instantiate the game with the two players and the board
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startDate = new Date();
        //send the initial game state to the players
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    //checks if the player is making a valid move
    isPlayerTurn(socket) {
        const isWhitesTurn = this.moveCount % 2 === 0;
        const isPlayer1Turn = isWhitesTurn && socket === this.player1;
        const isPlayer2Turn = !isWhitesTurn && socket === this.player2;
        console.log(`Move count: ${this.moveCount}, isWhitesTurn: ${isWhitesTurn}`);
        console.log(`Player1 socket: ${this.player1}, Player2 socket: ${this.player2}`);
        console.log(`Current socket: ${socket}`);
        console.log(`Is player1 turn: ${isPlayer1Turn}, Is player2 turn: ${isPlayer2Turn}`);
        return isPlayer1Turn || isPlayer2Turn;
    }
    // Get valid moves for a given square
    getValidMoves(square) {
        try {
            const moves = this.board.moves({ square: square });
            console.log(`Raw moves for ${square}:`, moves);
            // Convert chess notation to destination squares
            return moves.map(move => {
                // Handle different move formats:
                // 'Na3' -> 'a3' (knight move)
                // 'O-O' -> 'g1' or 'g8' (castling)
                // 'e4' -> 'e4' (pawn move)
                // 'exd5' -> 'd5' (capture)
                if (move === 'O-O') {
                    // Kingside castling
                    return square[1] === '1' ? 'g1' : 'g8';
                }
                else if (move === 'O-O-O') {
                    // Queenside castling
                    return square[1] === '1' ? 'c1' : 'c8';
                }
                else if (move.includes('=')) {
                    // Pawn promotion, extract destination
                    return move.split('=')[0].slice(-2);
                }
                else if (move.includes('x')) {
                    // Capture, extract destination
                    return move.split('x')[1].slice(0, 2);
                }
                else {
                    // Regular move, extract destination
                    return move.slice(-2);
                }
            });
        }
        catch (error) {
            console.log(`Error getting valid moves for square ${square}:`, error);
            return [];
        }
    }
    makeMove(socket, move) {
        console.log(`\n=== MOVE ATTEMPT ===`);
        console.log(`Move: ${move.from} to ${move.to}`);
        console.log(`Current move count: ${this.moveCount}`);
        //checking whose turn it is
        if (!this.isPlayerTurn(socket)) {
            console.log("Invalid move: Not your turn");
            // Send error message to the player who tried to move out of turn
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "It's not your turn! Please wait for your opponent to move."
                }
            }));
            return;
        }
        console.log("Valid turn, attempting move");
        //UPDATE BOARD
        //chess.js library makes sure the move is valid 
        try {
            const result = this.board.move(move);
            if (!result) {
                console.log("Invalid move: chess.js rejected the move");
                // Send error message for invalid move
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Invalid move! This move is not allowed in chess."
                    }
                }));
                return;
            }
        }
        catch (e) {
            console.log("Move failed:", e);
            // Send error message for move failure
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Move failed! Please try a different move."
                }
            }));
            return;
        }
        console.log("Move is made successfully");
        // INCREMENT MOVE COUNT AFTER SUCCESSFUL MOVE
        this.moveCount++;
        console.log(`Move count incremented to: ${this.moveCount}`);
        // SEND UPDATED BOARD STATE TO BOTH PLAYERS
        const boardState = this.board.board();
        this.player1.send(JSON.stringify({
            type: messages_1.BOARD_UPDATE,
            payload: {
                board: boardState,
                turn: this.board.turn()
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.BOARD_UPDATE,
            payload: {
                board: boardState,
                turn: this.board.turn()
            }
        }));
        //CHECKS IF GAME  IS OVER 
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        // SEND MOVE TO THE OTHER PLAYER
        if (socket === this.player1) {
            // If player1 (white) made the move, send to player2 (black)
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            // If player2 (black) made the move, send to player1 (white)
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
    }
}
exports.Game = Game;
