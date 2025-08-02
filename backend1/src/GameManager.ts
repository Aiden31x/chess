import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = []
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket)

    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);

    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    //start game
                    const game = new Game(this.pendingUser, socket) //create a new game with the two users
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket; //if no one is waiting,current user becomes waitingUser
                }
            }

            if (message.type === MOVE) {
                console.log("move message received")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket); //find the game that the user is in(as socket is either player1 or player2)
                if (game) {
                    console.log("inside make move function")
                    game.makeMove(socket, message.payload)
                }

            }


        })
    }

}