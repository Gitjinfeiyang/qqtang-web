const socket = io('http://localhost:3000');

socket.on("connect",function(socket){
    //connect success
    game.start()
})