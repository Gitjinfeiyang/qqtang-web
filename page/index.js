import io from '../static/socket.io.min.js'
import game from '../src/game';
import './main.css'
const socket = io('http://localhost:3003');
// const socket = io('http://10.10.71.238:3003');
// var ws = new WebSocket("wss://jinfeiyang.top:3003");
// ws.onopen=function(){
//     console.log("open")
// }
game.start(socket)
 


