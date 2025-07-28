import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss= new WebSocketServer({port: 8080});
const gameManager= new GameManager();

wss.on('connection', function connection(ws){
    gameManager.addUser(ws);  //on connection adds user


    ws.on('disconnect',()=> gameManager.removeUser(ws)) //when user disconnets it removes user
});