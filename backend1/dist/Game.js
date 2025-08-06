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
    // Check if a move requires pawn promotion
    requiresPromotion(from, to) {
        const piece = this.board.get(from);
        if (!piece || piece.type !== 'p')
            return false;
        const toRank = parseInt(to[1]);
        return (piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1);
    }
    // Handle pawn promotion
    promotePawn(socket, from, to, promotion) {
        console.log(`Promoting pawn from ${from} to ${to} as ${promotion}`);
        // Validate promotion piece
        if (!['q', 'r', 'b', 'n'].includes(promotion.toLowerCase())) {
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Invalid promotion piece! Choose Queen, Rook, Bishop, or Knight."
                }
            }));
            return;
        }
        try {
            const result = this.board.move({
                from: from,
                to: to,
                promotion: promotion.toLowerCase()
            });
            if (!result) {
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Invalid promotion move!"
                    }
                }));
                return;
            }
            console.log("Promotion successful");
            this.moveCount++;
            this.sendBoardUpdate();
            this.checkGameOver();
            this.sendMoveToOtherPlayer(socket, { from, to, promotion });
        }
        catch (error) {
            console.log("Promotion failed:", error);
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Promotion failed! Please try again."
                }
            }));
        }
    }
    // Extract board update logic to reusable method
    sendBoardUpdate() {
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
    }
    // Extract game over check to reusable method
    checkGameOver() {
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
        }
    }
    // Extract move sending logic
    sendMoveToOtherPlayer(socket, move) {
        if (socket === this.player1) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
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
        // Check if this move requires pawn promotion
        if (this.requiresPromotion(move.from, move.to)) {
            console.log("Pawn promotion required");
            socket.send(JSON.stringify({
                type: messages_1.PROMOTION_REQUIRED,
                payload: {
                    from: move.from,
                    to: move.to
                }
            }));
            return;
        }
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
        // Send updates using helper methods
        this.sendBoardUpdate();
        this.checkGameOver();
        this.sendMoveToOtherPlayer(socket, move);
    }
}
exports.Game = Game;
