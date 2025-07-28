import WebSocket from "ws";
import {Chess} from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private moves: String[];
    private startDate: Date;
    private moveCount=0;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.moves=[];
        this.startDate=new Date();

        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload: {
                color: "white"
            }
        }))

        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move:{
        from: string,
        to: string
    }){
        //VALIDATION using zod for input types\
        if(this.moveCount %2 ===0 && socket !== this.player1){
            return
        }
        if(this.moveCount %2 ===1 && socket !== this.player2){
            return
        }

        console.log("Did not early return")

        



        //UPDATE BOARD
        //chess.js library makes sure the move is valid 
        try{
            this.board.move(move);
        }
        catch(e){
            console.log(e);
        }

        console.log("Move is made");
        
        // INCREMENT MOVE COUNT AFTER SUCCESSFUL MOVE
        this.moveCount++;




        //CHECKS IF GAME  IS OVER 

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn()=== "w" ? "black" : "white"
                }
            }))

            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload: {
                    winner: this.board.turn()==="w" ? "black" : "white"
                }
            }))
            return;
        }

         // SEND MOVE TO THE OTHER PLAYER
         if (socket === this.player1) {
            // If player1 (white) made the move, send to player2 (black)
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            // If player2 (black) made the move, send to player1 (white)
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))


    }
}
}