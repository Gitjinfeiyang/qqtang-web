import game from '../src/game';
import './main.css'
const socket = io('http://67.216.197.160:3003');
// const socket = io('http://10.10.71.238:3003');


game.start(socket)

 


