import game from '../src/game';
import './main.css'
const socket = io('http://localhost:3000');

// socket.on("connection",(socket) => {
	game.start(socket)
// })
 


