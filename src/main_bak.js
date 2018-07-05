	const socket = io('http://localhost:3000');

	let players={};

	socket.on("add",function(data){
		addPlayer(data)
	})

	socket.on("update",function(data){
		updatePlayers(data)
	})

	socket.on("playerlist",function(players){
		Object.keys(players).forEach((key) => {
			addPlayer(players[key])
		})
	})




	let app = new PIXI.Application({
	    width: window.innerWidth,         // default: 800
	    height: window.innerHeight,        // default: 600
	    antialias: true,    // default: false
	    transparent: false, // default: false
	    resolution: 1       // default: 1
	  }
	);

	const id=Math.random()

	let person=new PIXI.Graphics();
	person.beginFill(0x9966FF);
	person.drawCircle(0, 0, 10);
	person.endFill();
	person.x = 64;
	person.y = 130;

	let x=10,y=10;
	let speed=1;

	let move=function(){}

	window.addEventListener("keydown",function(e){
		let keycode=e.code;
		switch(keycode){
			case 'ArrowLeft':
				move=moveLeft;
				break;
			case 'ArrowRight':
				move=moveRight;
				break;
			case 'ArrowUp':
				move=moveUp;
				break;
			case 'ArrowDown':
				move=moveDown;
				break;
		}
	})
	window.addEventListener("keyup",function(e){
		stopMove()
	})

	app.stage.addChild(person)
	app.ticker.add(function (delta){
		move()
		person.x=x;person.y=y;
	})

	document.body.appendChild(app.view)

	socket.on("connect",() => {
		socket.emit("init",{id,x,y})
	})


	function moveUp(){
			y-=speed;
			emitUpdate()
	}
	function moveDown(){
			y+=speed;
			emitUpdate()
	}
	function moveLeft(){
			x-=speed;
			emitUpdate()
	}
	function moveRight(){
			x+=speed;
			emitUpdate()
	}
	function stopMove(){
		move=function(){}
		emitUpdate()
	}

	function emitUpdate(){
		socket.emit("update",{id,x,y})
	}

	function addPlayer(data){
		let person=new PIXI.Graphics();
		person.beginFill(0xffffff);
		person.drawCircle(0, 0, 10);
		person.endFill();
		person.x = data.x;
		person.y = data.y;
		players[data.id]=person;
		app.stage.addChild(person)
	}

	function updatePlayers(data){
		let keys=Object.keys(data);
		let player;
		keys.forEach((key) => {
			player=players[key]
			if(player){
				player.x=data[key].x;
				player.y=data[key].y;
			}
		})
	}


