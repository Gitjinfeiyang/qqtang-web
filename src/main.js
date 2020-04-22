const socket = io('http://localhost:3003');

socket.on("connect",function(socket){
    //connect success
    game.start()
})