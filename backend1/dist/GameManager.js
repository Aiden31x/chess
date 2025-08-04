"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start game
                    const game = new Game_1.Game(this.pendingUser, socket); //create a new game with the two users
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket; //if no one is waiting,current user becomes waitingUser
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("move message received");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket); //find the game that the user is in(as socket is either player1 or player2)
                if (game) {
                    console.log("inside make move function");
                    game.makeMove(socket, message.payload);
                }
            }
            if (message.type === messages_1.GET_VALID_MOVES) {
                console.log("get valid moves message received");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    const { square } = message.payload;
                    const validMoves = game.getValidMoves(square);
                    socket.send(JSON.stringify({
                        type: "VALID_MOVES_RESPONSE",
                        payload: {
                            square: square,
                            moves: validMoves
                        }
                    }));
                }
            }
        });
    }
}
exports.GameManager = GameManager;
