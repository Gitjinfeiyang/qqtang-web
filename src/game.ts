// import * as PIXI from '../static/pixi-4.8.1.js';
import Howler from '../static/howler.min.js'
const PIXI=(<any>window).PIXI;
// const Sound=(<any>window).sounds;
const Howl=Howler.Howl;
export default{
    start
}

let pid=0,pname='';

const res={
    male_red_1:"./static/res/走图/Done_body11001_walk.png",
    female_red_1:"./static/res/走图/Done_body13001_walk.png",
    male_blue:"./static/res/走图/Done_body55001_walk.png",
    male_black:"./static/res/走图/Done_body65001_walk.png",
    maptile:"./static/res/地图/maptile.png",
    maptile2:"./static/res/地图/maptile2.png",
    maptile3:"./static/res/地图/paotile1.png",
    maptile4:"./static/res/地图/paotile.png",
    maptile5:"./static/res/地图/Q版树林精灵类动画游戏素材-丛林qq堂-Map 元素_6(M_爱给网_aigei_com.png",
    bubble_normal:"./static/res/泡泡/bubble_normal.png",
    // bubble_orange:"./static/res/泡泡/香橙.png",
    bubble_yellow_boom:"./static/res/泡泡/bubbleboom.png",
    medicine:"./static/res/物品/强力药.png",
    start_page:"./static/res/窗口/开始画面.png",
    start_button:"./static/res/窗口/start.png",
    restart_button:"./static/res/窗口/restart.png",
    home_button:"./static/res/窗口/《放开那三国》全套美术素材资源-背景-主页 n(mainpa_爱给网_aigei_com.png",
    playerfall1:"./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-0_爱给网_aigei_com.png",
    playerfall2:"./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-1_爱给网_aigei_com.png",
    playerfall3:"./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-2_爱给网_aigei_com.png",
    playerfall4:"./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-3_爱给网_aigei_com.png",
    playerfall5:"./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-5_爱给网_aigei_com.png",
}

const sounds={
    path:"./static/res/music/",
    manifest: [
            {id: "home", src: {ogg:"das.ogg"}},
            {id: "water", src: {ogg:"water.ogg"}},
            {id: "readygo", src: {ogg:"ReadyGo.wav"}},
            {id: "uinormal", src: {ogg:"uiNormal.wav"}},
            {id: "eat", src: {ogg:"X08_01.wav"}},
            {id: "bubbleboom", src: {ogg:"X10_01.wav"}},
            {id: "playerboom", src: {ogg:"X12_01.wav"}},
            {id: "femalethanks", src: {ogg:"X39_01.wav"}},
            {id: "malethanks", src: {ogg:"x40_01.wav"}},
    ]
};


//m type
const a=1,b=2,c=3,d=4,e=5,f=6,z=-1,x=-2;


const map=[
// 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
   z, b, a, b, 0, a, 0, 0, e, e, 0, 0, a, 0, b, a, b, z, //1
   z, d, c, 0, 0, 0, 0, c, d, d, c, 0, 0, 0, 0, c, d, z, //2
   z, b, b, 0, d, 0, a, a, a, a, a, a, a, 0, d, b, b, z, //3
   z, d, 0, z, z, 0, a, 0, 0, 0, 0, 0, a, 0, z, 0, d, z, //4
   x, e, 0, e, d, 0, a, 0, x, x, x, 0, a, 0, e, 0, e, x, //5
   x, e, 0, e, d, 0, a, 0, 0, 0, 0, 0, a, 0, e, 0, e, x, //6
   z, d, 0, z, z, 0, a, a, a, a, a, a, a, 0, z, 0, d, z, //7
   z, b, b, 0, 0, x, b, b, b, x, b, b, b, x, 0, b, b, z, //8
   z, d, c, 0, 0, 0, 0, x, d, x, d, x, 0, 0, 0, c, d, z, //9
   z, b, a, b, c, c, c, d, c, x, c, d, c, c, b, a, b, z, //10

]




enum Direction {
    UP='up',
    DOWN='down',
    LEFT='left',
    RIGHT='right'
}
enum PlayerState {
    TRANSPARENT=1, //透明状态
    NORMAL=2, //正常状态 
    FALL=3, //倒地状态 
    DIE=4 //死亡状态
}


const defaultProps=calcWindowSize()


function calcWindowSize(){
    // toggleFullScreen(document.body)
    let width=window.innerWidth;
    let height=window.innerHeight;
    let col=18;
    let row=10;
    let xsize=width/col;
    let ysize=height/row;
    let size=xsize;
    //宽高比 大
    if(xsize>ysize){
        size=ysize;
    }

    return {
        col,row,
        height:row*size,
        width:col*size,
        size
    }

}



const mapTile={
    xStart:0,
    yStart:0,
    step:56
}


//sound.js 兼容性有问题
var soundInstance={};
class GameSound {
    static load(callback:Function){
        let soundList=sounds.manifest.map((item) => {
            return sounds.path+(item.src.ogg);
        })
        soundList.forEach((item) => {
            soundInstance[item]=new Howl({
                src:[item]
            })
        })
        callback()

    }

    static play(id:string,config:any={}){
        let src=sounds.manifest.find((item) => {
            return item.id==id;
        })

        if(src){
            soundInstance[sounds.path+src.src.ogg].play();
            if(config.loop){
                soundInstance[sounds.path+src.src.ogg].loop(true) 
            }
        }
    }

    static pause(id:string){
        let src=sounds.manifest.find((item) => {
            return item.id==id;
        })

        if(src){
            soundInstance[sounds.path+src.src.ogg].pause();
        }
    }
}



class GameControler{
    platform:string;
    directionEle:any; //pixi;
    actionEle:any; //pixi;
    onDirectionChange:Function;
    onAction:Function;

    constructor(props){
        this.platform=props.platform;
        this.onDirectionChange=null;
        this.onAction=null;
        this.directionEle=null;
        this.actionEle=null;
        if(this.platform == 'pc'){
            this.initPC()
        }else{
            this.initMobile()
        }
    }

    initMobile(){
        const r=50,r1=50;
        this.directionEle=new PIXI.Container();
        this.directionEle.width=r*3;
        this.directionEle.height=r*3;
        const left=new PIXI.Graphics();
        const right=new PIXI.Graphics();
        const up=new PIXI.Graphics();
        const down=new PIXI.Graphics();
        left.interactive=right.interactive=up.interactive=down.interactive=true;
        this.directionEle.addChild(left)
        this.directionEle.addChild(right)
        this.directionEle.addChild(up)
        this.directionEle.addChild(down)
        left.beginFill(0xffffff,0.3);
        left.drawCircle(0,0,r/2,r/2);
        left.endFill()
        right.beginFill(0xffffff,0.3);
        right.drawCircle(0,0,r/2,r/2);
        right.endFill()
        up.beginFill(0xffffff,0.3);
        up.drawCircle(0,0,r/2,r/2);
        up.endFill()
        down.beginFill(0xffffff,0.3);
        down.drawCircle(0,0,r/2,r/2);
        down.endFill()
        left.x=0;left.y=r;
        right.x=r*2;right.y=r;
        up.x=r; up.y=0;
        down.x=r;down.y=r*2;
        left.on("touchstart",(e) => {
            left.alpha=0.5;
            this.emitDirectionChange({direction:"ArrowLeft"})
        })
        right.on("touchstart",(e) => {
            right.alpha=0.5;
            this.emitDirectionChange({direction:"ArrowRight"})
        })
        up.on("touchstart",(e) => {
            up.alpha=0.5;

            this.emitDirectionChange({direction:"ArrowUp"})
        })
        down.on("touchstart",(e) => {
            down.alpha=0.5;

            this.emitDirectionChange({direction:"ArrowDown"})
        })
        left.on("touchendoutside",(e) => {
            left.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        right.on("touchendoutside",(e) => {
            right.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        up.on("touchendoutside",(e) => {
            up.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        down.on("touchendoutside",(e) => {
            down.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        left.on("touchend",(e) => {
            left.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        right.on("touchend",(e) => {
            right.alpha=1;

            this.emitDirectionChange({direction:"Center"})
        })
        up.on("touchend",(e) => {
            up.alpha=1;
            this.emitDirectionChange({direction:"Center"})
        })
        down.on("touchend",(e) => {
            down.alpha=1;
            this.emitDirectionChange({direction:"Center"})
        })
        //滑动控制，体验不佳
        // const outside=new PIXI.Graphics();
        // this.directionEle.addChild(outside)
        // outside.beginFill(0xffffff,0.3)
        // outside.drawCircle(0,0,r)
        // outside.endFill();
        // outside.x=r;
        // outside.y=r;
        // outside.interactive=true;
        // let allowControl=false;
        // let last='';
        // outside.on("pointermove",(e) => {
        //     if(!allowControl) return;
        //     let x=e.data.global.x;
        //     let y=e.data.global.y;
        //     if(x-this.directionEle.x <=0){
        //         if(last === 'ArrowLeft') return;
        //         this.emitDirectionChange({direction:"ArrowLeft"})
        //     }else if(x-this.directionEle.x-r*2 >=0){
        //         if(last === 'ArrowLeft') return;
        //         this.emitDirectionChange({direction:"ArrowRight"})
        //     }else if(y-this.directionEle.y <=0){
        //         if(last === 'ArrowUp') return;
        //         this.emitDirectionChange({direction:"ArrowUp"})
        //     }else if(y-this.directionEle.y-r*2>=0){
        //         if(last === 'ArrowDown') return;
        //         this.emitDirectionChange({direction:"ArrowDown"})
        //     }else{
        //         if(last === 'Center') return;
        //         this.emitDirectionChange({direction:"Center"})
        //     }
        // })
        // outside.on("pointerdown",(e) => {
        //     allowControl=true;
        // })
        // outside.on("pointerup",(e) => {
        //     allowControl=false;
        //     this.emitDirectionChange({direction:"Center"})
        // })
        // outside.on("touchendoutside",(e) => {
        //     allowControl=false;
        //     this.emitDirectionChange({direction:"Center"})
        // })

        this.actionEle=new PIXI.Container();
        const createBubble=new PIXI.Graphics();
        this.actionEle.addChild(createBubble);
        createBubble.beginFill(0xffffff,0.3)
        createBubble.drawCircle(0,0,r1)
        createBubble.endFill();
        createBubble.x=r1;
        createBubble.y=r1;
        createBubble.interactive=true;
        createBubble.on("tap",(e) => {
            this.emitAction({action:"CreateBubble"})
        })
    }

    attachDirectionControler(pixi:any,x?:number,y?:number):void{
        pixi.addChild(this.directionEle)
        if(x){
            this.directionEle.x=x;
        }
        if(y){
            this.directionEle.y=y;
        }
    }

    attachActionControler(pixi:any,x?:number,y?:number):void{
        pixi.addChild(this.actionEle)
        if(x){
            this.actionEle.x=x;
        }
        if(y){
            this.actionEle.y=y;
        }
    }

    initPC(){
        const keydownArr=[];
        window.addEventListener("keydown",(e) => {
            if(e.repeat) return;
            let keycode=e.code;
            if(keycode == 'Space'){
                this.emitAction({action:"CreateBubble"})
                return;
            }
            if(keydownArr.indexOf(keycode)>=0) return
            keydownArr.push(keycode);
            this.emitDirectionChange({direction:keycode})
        })

        window.addEventListener("keyup",(e) => {
            let keycode=e.code;
            let keycodeIndex=keydownArr.indexOf(keycode);
            let isCurrentDirection=keycodeIndex === keydownArr.length-1
            keydownArr.splice(keycodeIndex,1);
            if(!isCurrentDirection) return;
            if(keydownArr.length>0){
                this.emitDirectionChange({direction:keydownArr[keydownArr.length-1]})
            }else{
                this.emitDirectionChange({direction:"Center"})
            }
        })
    }

    emitDirectionChange(e){
        this.onDirectionChange&&this.onDirectionChange(e)
    }

    emitAction(e){
        this.onAction&&this.onAction(e)
    }
}


class Grid {
    self:Player;   //本机玩家
    players:Array<Player>;  //玩家列表
    materials:Array<Material>; //台上所有物体
    bubbles:Array<Bubble>;   //台上所有泡泡
    col:number;  //列总数
    row:number;  //行总数
    size:number; //每格size
    app:any;     //pixi
    map:any;     //地图
    ticker:any;  //PIXI.Ticker
    w:number; 
    h:number;
    startPage:any;
    restartPage:any;
    homeButton:any;
    platform:string; //平台 pc ios android

    constructor(props){
        const options=Object.assign(defaultProps,props)
        this.self=null;
        this.players=[
            //Player
        ]
        this.materials=[
            //Material
        ]
        this.bubbles=[
            //Bubble
        ]
        this.col=options.col;
        this.row=options.row;
        this.size=options.size;
        this.w=window.innerWidth;
        this.h=window.innerHeight;
        this.app=new PIXI.Application({
            width: this.w,         // default: 800
            height: this.h,        // default: 600
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
          }
        );
        document.body.appendChild(this.app.view) 
        if(IsPC()){
            this.platform='pc'
        }else{
            this.platform='ios'
        }

        
        
        this.initMap(options)
        this.initStartPage(options)
        this.initController()


        // //draw the grid for debug
        // let grid=new PIXI.Graphics();
        // grid.lineStyle(1,0x333333,1);
        // for(let i=0; i<this.col; i++){
        //     grid.moveTo(i*this.size,0);
        //     grid.lineTo(i*this.size,window.innerHeight);
        // }
        // for(let i=0; i<this.row; i++){
        //     grid.moveTo(0,i*this.size);
        //     grid.lineTo(window.innerWidth,i*this.size);
        // }
        // this.map.addChild(grid)
        // //end

    }

    initStartPage(options:any):void{
        let event={
            click:'click'
        }
        if(this.platform!=='pc'){
            event={
                click:"tap"
            }
        }
        //开始
        this.startPage=new PIXI.Container();
        let g=new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.start_page],new PIXI.Rectangle(0,40,800,520)))
        g.width=window.innerWidth;
        g.height=window.innerHeight;
        let startButton=new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.start_button]))
        startButton.x=100;
        startButton.y=window.innerHeight-300;
        this.startPage.addChild(g)
        this.startPage.addChild(startButton)
        this.app.stage.addChild(this.startPage)
        startButton.interactive = true;
        startButton.on(event.click,(event) => {
            startButton.visible=false;
            notice("搜索房间中...")
            Server.emit("search_room",{id:pid,name:pname});
        })
        

        //重新开始 
        this.restartPage=new PIXI.Container();
        let restart=new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.restart_button]))
        this.restartPage.addChild(restart);
        restart.interactive=true;
        restart.x = (this.w - restart.width)/2
        restart.y = (this.h - restart.height)/2
        restart.on(event.click,(event) => {
            this.restartPage.visible=false;
            // this.self.restart()
            Server.emit("game_restart",{id:pid,name:pname})
        })
        this.restartPage.visible=false;
        this.app.stage.addChild(this.restartPage)


       //回到开始
       this.homeButton = new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.home_button]))
       this.homeButton.width = this.homeButton.height = 60;
       this.homeButton.x = this.w - 70; this.homeButton.y = 10
       this.app.stage.addChild(this.homeButton)
       this.homeButton.interactive=true;
       this.homeButton.on(event.click,(e) => {
           if(this.startPage.visible) return;
         Server.emit("leave_room",{});
         this.clear()
         this.startPage.visible=true;
         startButton.visible=true;
         this.restartPage.visible=false;
       })
        
    }

    initMap(options):void{

        this.map=new PIXI.Container()

        this.map.width=this.w=options.width;
        this.map.height=this.h=options.height;
        this.map.x=(window.innerWidth-options.width)/2
        this.map.y=(window.innerHeight-options.height)/2

        this.app.stage.addChild(this.map)

        //add tile
        this.map.addChild(
            new PIXI.extras.TilingSprite(
                new PIXI.Texture(PIXI.utils.TextureCache[res.maptile],
                    new PIXI.Rectangle(mapTile.xStart, mapTile.yStart+mapTile.step*0, mapTile.step,mapTile.step)),
                this.size*this.col,
                this.size*this.row
            ))
    }


    addSelf(data:any={id:Math.random,isSelf:true,col:1,row:1}):void{
        let player;
        player=new Player(data)
        player.addTo(this)
        this.self=player;

        player.onKillPlayer=(player:Player) => {
            Server.emit("kill_player",{id:this.self.id,playerId:player.id})
        }

        player.onRealKillPlayer=(player:Player) => {
            Server.emit("real_kill_player",{id:this.self.id,playerId:player.id})
        }

        player.onEatMedicine=(medicine:Medicine) => {
            Server.emit("eat_medicine",{medicineId:medicine.id,id:player.id})
        }

    }



    add(m:Material):void{
        let pixi=m.ele;
        this.map.addChild(pixi)
        if(m instanceof Player){
            this.players.push(m)
        }else if(m instanceof Bubble){
            this.bubbles.push(m)
        }else{
            this.materials.push(m)
        }
    }

    remove(m:Material):void{
        let pixi=m.ele;
        this.map.removeChild(pixi)
        if(m instanceof Player){
            this.players.splice(this.players.indexOf(m),1)
        }else if(m instanceof Bubble){
            this.bubbles.splice(this.bubbles.indexOf(m),1)
        }else{
            this.materials.splice(this.materials.indexOf(m),1)
        }
    }

    clear():void{
        this.players=[]
        this.materials=[]
        this.bubbles=[];
        this.map.removeChildren(1,this.map.children.length)
    }

    initController():void{
        let move=null,currentDirection=Direction.DOWN;
        let ticker=this.ticker=new PIXI.ticker.Ticker();
        let playerMoving={}
        let playerKeys=[];
        let roomId=-1;
        const stop=() => {
            move=null;
            this.self.stopWalk()
            Server.emit("stop_walk",{
                ...this.normalizePos(this.self.x,this.self.y),
                direction:this.self.direction
            })
        }

        const start=() => {
            this.self.faceTo(currentDirection)
            Server.emit("walk",{
                ...this.normalizePos(this.self.x,this.self.y),
                direction:this.self.direction
            })
        }

        ticker.add((delta) => {
            move&&move()
            playerKeys.forEach(function(key){
                playerMoving[key]&&playerMoving[key]()
            })
        })

        ticker.start();

        const controler=new GameControler({platform:this.platform});

        controler.onDirectionChange=(e) => {
            if(this.self.state !== PlayerState.NORMAL) return;
            switch(e.direction){
                case 'ArrowLeft':
                    move=this.self.moveLeft;
                    currentDirection=Direction.LEFT
                    start()
                    break;
                case 'ArrowRight':
                    move=this.self.moveRight;
                    currentDirection=Direction.RIGHT
                    start()
                    break;
                case 'ArrowUp':
                    move=this.self.moveUp;
                    currentDirection=Direction.UP
                    start()
                    break;
                case 'ArrowDown':
                    move=this.self.moveDown;
                    currentDirection=Direction.DOWN
                    start()
                    break;
                case 'Center':
                    stop()
                    break;
            }
        }

        controler.onAction=(e) => {
            switch(e.action){
                case "CreateBubble":
                    let bubble=this.self.createBubble()
                    if(!bubble) return;
                    Server.emit("create_bubble",{id:this.self.id,col:bubble.col,row:bubble.row,bubbleId:bubble.id})
                    bubble.onDestroy=() =>{
                        Server.emit("bubble_boom",{id:this.self.id,bubbleId:bubble.id})
                    }
                    break;
            }
        }

        

        Server.emit("join",{id:pid,name:pname});

        Server.on("player_walk",(data) => {
            let player=this.players.find((item) => {
                return item.id === data.id;
            })
            playerKeys=Object.keys(playerMoving)
            if(!player) return;

            player.faceTo(data.direction);
            player.update(g.unNormalizePos(data.x,data.y));

                    switch(player.direction){
                        case Direction.DOWN:
                            playerMoving[player.id]=player.moveDown
                            break;
                        case Direction.LEFT:
                            playerMoving[player.id]=player.moveLeft
                            break;
                        case Direction.RIGHT:
                            playerMoving[player.id]=player.moveRight
                            break;
                        case Direction.UP:
                            playerMoving[player.id]=player.moveUp
                            break;
                        default :
                            playerMoving[player.id]=null;
                    }

        })

        Server.on("player_stop_walk",(data) => {
            let player=g.players.find((item) => {
                return item.id === data.id;
            })
            if(!player) return;

            player.faceTo(data.direction);
            player.update(this.unNormalizePos(data.x,data.y))
            player.stopWalk()

            playerMoving[player.id]=null;

        })

        Server.on("player_create_bubble",(data) => {
            let player=this.players.find((item) => {
                 return item.id == data.id;
            })
            if(!player) return;
            player.createBubble(data.bubbleId,data.col,data.row);
        })

        Server.on("player_bubble_boom",(data) => {
            let player=this.players.find((item) => {
                 return item.id == data.id;
            })
            if(!player) return;
            let bubble=player.bubbles.find((item) => {
                return item.id == data.bubbleId;
            })
            if(!bubble) return;
            bubble.boomNow()
        })

        Server.on("player_kill_player",(data) => {
            let player1=this.players.find((item) => {
                return item.id == data.id;
            })
            let player2=this.players.find((item) => {
                return item.id == data.playerId;
            })
            if(player1&&player2){
                player1.kill(player2)

            }
        })

        Server.on("player_real_kill_player",(data) => {
            let player1=this.players.find((item) => {
                return item.id == data.id;
            })
            let player2=this.players.find((item) => {
                return item.id == data.playerId;
            })
            if(player1&&player2){
                player1.realKill(player2)
                if(player2 == this.self){
                    // this.restartPage.visible=true;
                    notice(player1.name+" kill you!")
                }
            }
        })

        Server.on("game_start",(data) => {
            this.startPage.visible=false;
            GameSound.play("readygo")
            GameSound.play("water",{loop:true})
            GameSound.pause("home")
        })

        Server.on("game_restart",() => {
            this.clear()
            Server.emit("join_room",{id:roomId})
        })

           
        Server.on("join_success",(data) => {
            notice("本机成功加入,等待玩家中...")
            loadMap(this,map,data.medicines)
            this.addSelf({col:data.col,row:data.row,id:data.id,name:data.name,isSelf:true,team:data.team})
            if(this.platform !== 'pc'){
                controler.attachDirectionControler(this.map,40,this.map.height-260)
                controler.attachActionControler(this.map,this.map.width-220,this.map.height-260)
            }
            stop()
            roomId=data.roomId;
            //初始化 获取用户列表
            data.players.forEach((item) => {
                if(this.self.id != item.id){
                    new Player({id:item.id,...g.unNormalizePos(item.x,item.y),name:item.name,team:item.team}).addTo(g)
                }
            })


                    Server.on("player_join",(data) => {
                        notice(data.name+" 加入房间")
                        new Player({id:data.id,row:data.row,col:data.col,name:data.name,team:data.team}).addTo(this)
                    })
        })

        Server.on("s_gameover",({winner}) => {
            if(winner[0].team == this.self.team){
                notice("胜利")
            }else{
                notice("失败")
            }
            this.restartPage.visible=true;
        })



        Server.on("player_restart",(data) => {
            notice(data.name + "复活")
            let player1=this.players.find((item) => {
                return item.id == data.id;
            })
            if(player1){
                player1.restart()
            }
        })


        Server.on("player_leave",({id}) => {
            let player=this.players.find((item) => {
                return item.id == id;
            })
            if(player){
                notice(player.name+"离开房间")
            }
        })

        Server.on("player_eat_medicine",({id,medicineId}) => {
            for(let i=0, j=this.materials.length; i<j; i++){
                if(this.materials[i]&&this.materials[i].id == medicineId){
                    let player=this.players.find((item) => {
                        return item.id == id;
                    })
                    if(player){
                        (<any>this.materials[i]).eatByPlayer(player)
                    }
                    break;
                }
            }
        })

    }

    getMaterialByColRow(col:any,row:any):Array<Material>{
        let materials=[]
        for(let i=0,l=this.materials.length; i<l; i++){
            if(betweenRange(this.materials[i].col,col) && betweenRange(this.materials[i].row, row)){
                materials.push(this.materials[i])
            }
        }

        for(let i=0,l=this.bubbles.length; i<l; i++){
            if(betweenRange(this.bubbles[i].col,col) && betweenRange(this.bubbles[i].row, row)){
                materials.push(this.bubbles[i])
            }
        }

        for(let i=0,l=this.players.length; i<l; i++){
            if(betweenRange(this.players[i].col,col) && betweenRange(this.players[i].row, row) && !this.players[i].isSelf){
                materials.push(this.players[i])
            }
        }

        return materials;
    }


    debug(m:Material){
        let d=new PIXI.Graphics();
        d.lineStyle(1,0xf1f100,1);
        d.drawRect(m.x,m.y,m.w,m.h);
        this.map.addChild(d)
    }

    normalizePos(x,y){
        return {
            x:x/this.w,
            y:y/this.h
        }
    }

    unNormalizePos(x,y){
        return {
            x:x*this.w,
            y:y*this.h
        }
    }

}




class Bound {
    
    x:number
    y:number
    w:number
    h:number

    constructor(props){
        this.x=props.x;
        this.y=props.y;
        this.w=props.w;
        this.h=props.h;
    }
}


//网格中的物体
class Material extends Bound{
    id:number;
    col:number;    //列
    row:number;    //行
    destructible:boolean;  //是否可破坏 用于被泡泡炸到检测
    passable:boolean;      //是否可穿过
    z:number;      //zIndex
    ele:any; //PIXI.DisplayObject
    grid:Grid;  //grid
    basicTexture:any; //纹理
    destroyed:boolean; //是否已destroyed
    scalex:number; //相对于网格缩放
    scaley:number; //相对于网格缩放
    offsetw:number; //相对位置偏移
    offseth:number; //相对位置偏移
    onDestroy:Function;//

    constructor(props){
        super(props);
        this.col=props.col;
        this.row=props.row;
        this.destructible=props.destructible;
        this.passable=props.passable;
        this.z=props.z||10;
        this.ele;
        this.grid;
        this.basicTexture=props.texture;
        this.destroyed=false;
        this.scalex=this.scaley=0.9;
        this.offseth=6;
        this.offsetw=0;
        this.id=props.id||Math.random();
        this.onDestroy=null;
    }

    addTo(grid:Grid){
        this.grid=grid;
        let {x,y,w,h}=this.calcSize()
        //如果指定了x，y
        if(!this.x) this.x=x;
        if(!this.y) this.y=y;
        this.w=w;
        this.h=h;
        this.ele=this.render();
        grid.add(this)
        this.afterRender()
    }

    //render后ele已初始化
    afterRender(){

    }

    calcSize(){
        let tileSize=this.grid.size;
        let xsize=tileSize*this.scalex;
        let ysize=tileSize*this.scaley;
        if(this.col==undefined||this.row==undefined){
            let {col,row}=this.getColRow();
            this.col=col;
            this.row=row;
        }
        return {
            x:this.col*tileSize+(tileSize-xsize)/2,
            y:this.row*tileSize+(tileSize-ysize)/2,
            w:xsize,
            h:ysize,
        }
    }


    //模仿3d效果 绘图上移
    render(){
        let g=new PIXI.Sprite(this.basicTexture);
        g.x=this.x-this.offsetw;
        g.y=this.y-this.offseth;
        g.width=this.w+this.offsetw;
        g.height=this.h+this.offseth;
        return g;
    }

    destroy(){
           this.destroyed=true;
           this.destroyEle()
    }

    destroyEle(){
        this.grid.remove(this);
        this.ele.destroy()
        this.onDestroy&&this.onDestroy()
    }

    getColRow(){
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        return {col,row}
    }


}


//for Player's Sprite
const x_start=29,x_step=100,y_start=40,y_step=100,w=42,h=60;

class Player extends Material{
    speed:number; //速度
    direction:Direction; //方向
    maxBubbleCount:number; //最多同时多少个泡泡
    bubbleRadius:number;   //泡泡的爆炸范围
    bubbles:Array<Bubble>; //放出的泡泡
    state:PlayerState;     //角色状态
    isSelf:boolean;        //是否本机
    basicTexture:any;      //纹理
    medicines:Array<Medicine> //获取药品列表
    onKillPlayer:Function;
    onRealKillPlayer:Function;
    onEatMedicine:Function;   
    name:string; //用户名
    animateSprite:any;
    team:string;

    constructor(props){
        const options=Object.assign({
            //Player
            speed:defaultProps.size/10,
            direction:null,
            maxBubbleCount:1,
            bubbleRadius:1,
            state:PlayerState.NORMAL,
            passable:true,
        },props)
        super(options)
        this.speed=options.speed;
        this.direction=options.direction;
        this.maxBubbleCount=options.maxBubbleCount;
        this.bubbleRadius=options.bubbleRadius;
        this.team=options.team;
        this.bubbles=[
            //Bubble
        ];
        this.medicines=[];
        this.state=options.state;
        this.isSelf=props.isSelf||false;
        this.name=props.name;

        //绑定对象
        this.moveLeft=this.moveLeft.bind(this)
        this.moveRight=this.moveRight.bind(this)
        this.moveUp=this.moveUp.bind(this)
        this.moveDown=this.moveDown.bind(this)
        let src='';
        switch(options.team){
            case 'red':
                src=res.male_red_1;break;
            case 'blue':
                src=res.male_blue;break;
            case 'black':
                src=res.male_black;break;
            default :
                src=res.male_red_1;
        }
        this.basicTexture=PIXI.utils.TextureCache[src];
        this.scalex=0.6;
        this.scaley=0.7;
        this.onKillPlayer=null;
        this.onRealKillPlayer=null;
        this.onEatMedicine=null;
    }

    render():object{

        let g=new PIXI.extras.AnimatedSprite([this.getFrame(x_start,y_start,w,h)]);
        g.x=0;
        g.y=0;
        g.width=this.w+this.offsetw;
        g.height=this.h+this.offseth;
        g.animationSpeed=0.2
        g.loop=true;

        let container=new PIXI.Container();
        container.x=this.x-this.offsetw;
        container.y=this.y-this.offseth;

        let text = new PIXI.Text(this.name,{fontFamily : 'Arial', fontSize: 12, fill : 0xf5f500, align : 'center'});

        text.x=0;
        text.y=-14;
        container.addChild(g)
        container.addChild(text)
        this.animateSprite=g;

        return container;
    }
    
    createBubble(id?:number,icol?:number,irow?:number):Bubble{
        GameSound.play("uinormal")
        if(this.bubbles.length>= this.maxBubbleCount) return null;
        let colandrow=null;
        if(icol!=undefined||irow!=undefined){
            colandrow={col:icol,row:irow}
        }else{
            let {col,row}=getColRow(this.x+this.w/2,this.y+this.w/2,this.grid.size)
            colandrow={col,row}
        }
        let b=new Bubble({col:colandrow.col,row:colandrow.row,player:this,id})
        this.bubbles.push(b);
        b.addTo(this.grid)
        return b;
    }

    deleteBubble(bubble:Bubble):void{
        this.bubbles.splice(this.bubbles.indexOf(bubble),1);
        this.grid.remove(bubble);
    }

    getFrame(x:number,y:number,w:number,h:number):any{
        var rectangle = new PIXI.Rectangle(x, y, w, h);
        var frame = new PIXI.Texture(this.basicTexture, rectangle);
        return frame;
    }

    stopWalk():void{
        this.animateSprite.stop()
    }

    faceTo(direction:Direction):void{
        if(this.direction===direction){
            this.animateSprite.play()
            return;
        }
        let yStart=y_start;
       
        this.direction=direction;
        switch(direction){
            case Direction.DOWN:

                break;
            case Direction.LEFT:
                yStart=y_start+1*y_step;
                break;
            case Direction.RIGHT:
                yStart=y_start+2*y_step;
                break;
            case Direction.UP:
                yStart=y_start+3*y_step;
                break;
        }

        var frameArray = [];
        for(var i = 0; i < 4; i++) {
            var frame = this.getFrame(x_start+i * x_step, yStart, w, h);
            frameArray.push(frame);
        }

        this.animateSprite.textures=frameArray;
        this.animateSprite.play()
    }

    leftTest():Array<Material>{
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        this.col=col;this.row=row;
        let m=this.grid.getMaterialByColRow(col-1,[row-1,row+1])
        return m.filter((item) => {
            return hitTestRectangle(item,this)
        })
    }
    rightTest():Array<Material>{
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        this.col=col;this.row=row;

        let m=this.grid.getMaterialByColRow(col+1,[row-1,row+1])
        return m.filter((item) => {
            return hitTestRectangle(item,this)
        })
    }
    upTest():Array<Material>{
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        this.col=col;this.row=row;

        let m=this.grid.getMaterialByColRow([col-1,col+1],row-1)
        return m.filter((item) => {
            return hitTestRectangle(item,this)
        })
    }
    downTest():Array<Material>{
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        this.col=col;this.row=row;

        let m=this.grid.getMaterialByColRow([col-1,col+1],row+1)
        return m.filter((item) => {
            return hitTestRectangle(item,this)
        })
    }

    moveLeft():void{
        this.x-=this.speed;
        let hit=this.leftTest();
        if(hit.some((item) => {
            this.checkHit(item)
            return !item.passable;
        })){
            this.x+=this.speed;
            return;
        }
        this.ele.x=this.x-this.offsetw;
    }

    moveRight():void{
        this.x+=this.speed;
        let hit=this.rightTest();
        if(hit.some((item) => {
            this.checkHit(item)

            return !item.passable
        })){
            this.x-=this.speed;
            return;
        }
        this.ele.x=this.x-this.offsetw;
    }

    moveUp():void{
        this.y-=this.speed;
        let hit=this.upTest();
        if(hit.some((item) => {
            this.checkHit(item)

            return !item.passable
        })){
            this.y+=this.speed;
            return;
        }
        this.ele.y=this.y-this.offseth;
    }

    moveDown():void{
        this.y+=this.speed;
        let hit=this.downTest();
        if(hit.some((item) => {
            this.checkHit(item)

            return !item.passable
        })){
            this.y-=this.speed;
            return;
        }
        this.ele.y=this.y-this.offseth;
    }

    changeState(state:PlayerState):void{
        this.state=state;
        switch(state){
            case PlayerState.FALL:
                this.ele.children[0].alpha=0.5;
                break;
            case PlayerState.DIE:
                let frames=[
                    new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall1]),
                    new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall2]),
                    new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall3]),
                    new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall4]),
                    new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall5]),
                ];
                let b=new PIXI.extras.AnimatedSprite(frames);
                b.animationSpeed=0.2;
                b.loop=true;
                b.width=this.w+this.offsetw;
                b.height=this.h+this.offseth;
                b.play()
                this.ele.addChild(b);
                setTimeout(() => {
                    this.ele.removeChildren()
                },500)
                break;
        }
    }


    //击倒
    kill(player:Player):void{
        player.changeState(PlayerState.FALL)
        this.onKillPlayer&&this.onKillPlayer(player)
    }

    //击杀
    realKill(player:Player):void{
        player.changeState(PlayerState.DIE)
        GameSound.play("playerboom")
        this.onRealKillPlayer&&this.onRealKillPlayer(player)
    }

    restart(){
        this.state=PlayerState.NORMAL;
        this.ele.scale=new PIXI.Point(1,1);
    }

    checkHit(material:Material):void{
        if(!this.isSelf) return;
        if(material instanceof Medicine){
            material.eatByPlayer(this);
            this.onEatMedicine&&this.onEatMedicine(material)
        }else if(material instanceof Player){
            if(material.state === PlayerState.FALL){
                this.realKill(material)
            }
        }
    }

    update(data){
        this.x=data.x;
        this.y=data.y;
        this.ele.x=this.x-this.offsetw;
        this.ele.y=this.y-this.offseth;
        let {col,row}=getColRow(this.x+this.w/2,this.y+this.h/2,this.grid.size);
        this.col=col;this.row=row;
    }

}



//阻碍
class Stone extends Material{
    constructor(props){
        const options=Object.assign({
            destructible:true, //可破坏
            passable:false,
        },props)
        super(options)
        this.basicTexture=props.texture
        this.scalex=this.scaley=1;
    }

    // //将绘制上移 模仿3d效果
    // render():any{
    //     let g=new PIXI.Sprite(this.basicTexture);
    //     g.x=this.x;
    //     g.y=this.y-6;
    //     g.width=this.w;
    //     g.height=this.h+6;

    //     return g;
    // }
}

//遮挡物
class Mask extends Material{
    constructor(props){
        const options=Object.assign({
            destructible:false,
            passable:true
        },props)
        super(options)
        this.basicTexture=new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2],new PIXI.Rectangle(61,0,62,70))
        
    }

    // render():any{
    //     let g=new PIXI.Graphics();
    //     g.beginFill(0xff0011);
    //     g.drawRect(0, 0,this.w,this.h);
    //     g.endFill();
    //     g.x=this.x;
    //     g.y=this.y;
    //     return g;
    // }
}

//泡
class Bubble extends Material{
    player:Player;  //属于哪个玩家
    duration:number; //多长时间爆炸
    timeout:any;     //
    boomed:boolean;  //是否已爆炸
    isSelfs:boolean; //是否是本机玩家的泡泡

    constructor(props){
        const options=Object.assign({
            destructible:true,
            passable:false,
            duration:3, //second
        },props)
        super(options)
        this.player=options.player;
        this.duration=options.duration;
        this.basicTexture=PIXI.utils.TextureCache[res.bubble_normal]
        this.isSelfs= this.player === this.player.grid.self;
        if(this.isSelfs){
            this.timeout=setTimeout(() => {
                this.boom()
            },this.duration*1000)
        }
        this.boomed=false;
        
    }

    //@overide 重写，被气球击中会触发boom
    destroyEle(){
        //击中其他玩家的气球不会触发
        if(!this.isSelfs) return;
        this.boomNow()
    }

    render(){
        let g=new PIXI.Container();
        let frames=[
            new PIXI.Texture(this.basicTexture,new PIXI.Rectangle(16,18,45,47)),
            new PIXI.Texture(this.basicTexture,new PIXI.Rectangle(85,18,45,47)),
            new PIXI.Texture(this.basicTexture,new PIXI.Rectangle(155,18,48,47)),
            new PIXI.Texture(this.basicTexture,new PIXI.Rectangle(85,18,45,47)),
        ]
        let s=new PIXI.extras.AnimatedSprite(frames);
        s.animationSpeed=0.06;
        s.loop=true;
        s.play()
        g.addChild(s)
        g.x=this.x-this.offsetw;
        g.y=this.y-this.offseth;
        g.width=s.width=this.w+this.offsetw;
        g.height=s.width=this.h+this.offseth;
        
        return g;
    }

    //boom without timeout
    boomNow(){
        if(this.boomed) return;
        clearTimeout(this.timeout);
        this.boom()
    }

    boom():void{
        this.onDestroy&&this.onDestroy()
        this.boomed=true; //boom必须提前与calcBoomBound 否则死循环
        GameSound.play("bubbleboom")
        this.drawBoom();
        setTimeout(() => {
            this.player.deleteBubble(this); 
        },500)
    }


    //绘制爆炸效果
    drawBoom():void{
        let g=this.ele;
        g.removeChildren()
        let bound:Array<Bound>=this.calcBoomBound();
        let tileSize=this.player.grid.size;
        let texture=PIXI.utils.TextureCache[res.bubble_yellow_boom];

        let txS=56;
        let tyS=64;
        let left=new PIXI.Sprite(new PIXI.Texture(texture,new PIXI.Rectangle(txS*2,0,txS+1,tyS))),
            right=new PIXI.Sprite(new PIXI.Texture(texture,new PIXI.Rectangle(txS*3,0,txS-1,tyS))),
            up=new PIXI.Sprite(new PIXI.Texture(texture,new PIXI.Rectangle(txS*0,0,txS,tyS-8))),
            down=new PIXI.Sprite(new PIXI.Texture(texture,new PIXI.Rectangle(txS*1+1,0,txS,tyS))),
            row=new PIXI.extras.TilingSprite(
                new PIXI.Texture(texture,new PIXI.Rectangle(txS*4,0,txS,tyS)),
                bound[0].w-2*tileSize,tyS
                ),
            col=new PIXI.extras.TilingSprite(
                new PIXI.Texture(texture,new PIXI.Rectangle(txS*6-1,0,txS,tyS-10)),
                txS,bound[1].h-2*tileSize
                );
            left.x=bound[0].x;
            left.y=bound[0].y;
            right.x=bound[0].x+bound[0].w-tileSize;
            right.y=bound[0].y;
            up.x=bound[1].x;
            up.y=bound[1].y;
            down.x=bound[1].x;
            down.y=bound[1].y+bound[1].h-tileSize;
            row.x=left.x+tileSize;
            row.y=left.y;
            col.x=up.x;
            col.y=up.y+tileSize;
            left.width=right.width=tileSize;
            up.height=down.height=tileSize;
            g.addChild.apply(g,[left,row,right,up,down,col])

            // //for debug
            //    let s=new PIXI.Graphics();
            //    s.lineStyle(1,0xf1f1f1);
            //    s.drawRect(up.x,up.y,up.width,up.height)
            //    s.drawRect(col.x,col.y,col.width,col.height)
            //    s.drawRect(down.x,down.y,down.width,down.height)
            //    s.drawRect(left.x,left.y,left.width,left.height)
            //    s.drawRect(row.x,row.y,row.width,row.height)
            //    s.drawRect(right.x,right.y,right.width,right.height)
            //    s.drawRect(bound[0].x,bound[1].y,bound[0].w,bound[1].h)
            //    g.addChild(s)

    }



    //计算爆炸区域
    calcBoomBound(){
        let bubbleRadius=this.player.bubbleRadius;
        let tileSize=this.player.grid.size;
        let rowMaterial=this.player.grid.getMaterialByColRow([this.col-bubbleRadius,this.col+bubbleRadius],this.row);
        let colMaterial=this.player.grid.getMaterialByColRow(this.col,[this.row-bubbleRadius,this.row+bubbleRadius]);
        let left={col:this.col-bubbleRadius-1,row:this.row},
            right={col:this.col+bubbleRadius+1,row:this.row},
            up={col:this.col,row:this.row-bubbleRadius-1},
            down={col:this.col,row:this.row+bubbleRadius+1};
        rowMaterial.forEach((item) => {
            if(item.passable) return;
            if(item.col<this.col){
                if((item.col>left.col)){
                    left=item;
                }
            }else if(item.col>this.col){
                if((item.col<right.col)){
                    right=item;
                }
            }
        })
        colMaterial.forEach((item) => {
            if(item.passable) return;
            if(item.row<this.row){
                if((item.row>up.row)){
                    up=item;
                }
            }else if(item.row>this.row){
                if((item.row<down.row)){
                    down=item;
                }
            }
        })

        let leftCol=left.col+1;
        let rightCol=right.col-1;
        let upRow=up.row+1;
        let downRow=down.row-1;

        //check if hit players or stones
        //should not test if it's player is not self
        if(this.isSelfs){
            let players=this.player.grid.players;
                players.forEach((player) => {
                    if(
                        (player.row === left.row && player.col>=leftCol && player.col<=rightCol) ||
                        (player.col === up.col && player.row >=upRow && player.row<=downRow)
                      ){
                        this.player.kill(player);
                    }
                })

        }

                let arr=[left,right,up,down];
                arr.forEach((m:any) => {
                    if(m.destructible){
                        m.destroy()
                        if(m == left){
                            leftCol-=1;
                        }else if(m == right){
                            rightCol+=1;
                        }else if(m == up){
                            upRow-=1;
                        }else{
                            downRow+=1;
                        }
                    }
                })
        
        //end


        return [
            new Bound({
                x:(leftCol-this.col)*tileSize,
                y:0,
                w:(rightCol-leftCol+1)*tileSize,
                h:tileSize
            }),
            new Bound({
                x:0,
                y:(upRow-this.row)*tileSize,
                w:tileSize,
                h:(downRow-upRow+1)*tileSize 
            })
        ]
    }
}


class Medicine extends Material{
    // container:Stone;

    constructor(props){
        super(Object.assign({
            destructible:false, // 默认初始不能破坏
            passable:true
        },props))
        // this.container=props.container;
        // this.row=props.row;
        // this.col=props.col;
        // this.z=this.container.z-1;
        this.scalex=0.6
        this.scaley=0.7
    }

    eatByPlayer(player:Player):void{
        GameSound.play("eat")
        this.destroy()
        this.changePlayerAttr(player)
    }

    changePlayerAttr(player:Player):void{

    }

}

class AddSpeed extends Medicine {

    constructor(props){
        super(props);
        this.basicTexture=new PIXI.Texture(PIXI.utils.TextureCache[res.medicine],new PIXI.Rectangle(0,0,32,64))
    }


    //overide   
    changePlayerAttr(player:Player){
        player.speed+=1;
        notice("移动速度增加")
    }

}

class AddBubble extends Medicine {

    constructor(props){
        super(props);
        this.basicTexture=new PIXI.Texture(PIXI.utils.TextureCache[res.medicine],new PIXI.Rectangle(0,0,32,64))
    }


    //overide   
    changePlayerAttr(player:Player){
        player.maxBubbleCount+=1;
        notice("泡泡数量增加")
    }

}

class AddBubbleRadius extends Medicine {

    constructor(props){
        super(props);
        this.basicTexture=new PIXI.Texture(PIXI.utils.TextureCache[res.medicine],new PIXI.Rectangle(0,0,32,64))
    }


    //overide   
    changePlayerAttr(player:Player){
        player.bubbleRadius+=1;
        notice("泡泡范围增加")
    }

}





const Server={
    socket:null,
    init(callback){
        let socket=Server.socket;
    },

    emit(type,data){
        let socket=Server.socket;
        socket.emit(type,data)
    },

    on(type,callback){
        Server.socket.on(type,callback)
    }
}





//rectangle hit test
function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.w / 2;
    r1.centerY = r1.y + r1.h / 2;
    r2.centerX = r2.x + r2.w / 2;
    r2.centerY = r2.y + r2.h / 2;
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.w / 2;
    r1.halfHeight = r1.h / 2;
    r2.halfWidth = r2.w / 2;
    r2.halfHeight = r2.h / 2;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
  };


//get col and row by centerx,centery and tile's size
function getColRow(x:number,y:number,size:number):any{
    return {
        col:Math.floor(x/size),row:Math.floor(y/size)
    }
}

//check value between range
function betweenRange(value:number,range:any):boolean{
    if(Array.isArray(range)){
        if(value<=range[1]&&value>=range[0]){
            return true;
        }
    }else{
        if(value === range){
            return true;
        }
    }
    return false;
}

function toggleFullScreen(ele) {
    if (!(<any>document).mozFullScreen && !(<any>document).webkitIsFullScreen) {
      if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else {
        ele.webkitRequestFullScreen((<any>Element).ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if ((<any>document).mozCancelFullScreen) {
        (<any>document).mozCancelFullScreen();
      } else {
        (<any>document).webkitExitFullscreen();
      }
    }
  }



  function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}





//load image resource
function loadRes(callback):void{
    let resource=Object.keys(res).map((key:string) => {
        return res[key]
    })
    let length=0;
    GameSound.load(function(){
          PIXI.loader.add(resource)
            .load(callback)
    })
  
}




//start the game

let g=null;
let player=null;

//
let noticeEle=new PIXI.Container();
let text=new PIXI.Text();
let noticeTimeout=null;
text.style.padding = 20;
text.style.fontSize = 30
text.style.align = "center";
text.style.fill = 0xffffff;
text.style.stroke = 0x000000
text.style.strokeThickness = 4
text.position.x = 20
text.position.y = 20
noticeEle.addChild(text);

function start(socket){



    Server.socket=socket;
    loadRes(function(){
        // let stone=new Stone({row:5,col:5})

        // new Medicine1({container:stone}).addTo(g)
        // stone.addTo(g);


        GameSound.play("home",{loop:true})

        pid=parseInt(String(Math.random()*1000))
        pname=prompt("name:","Player "+pid);
        g=new Grid({})
        g.app.stage.addChild(noticeEle)
    })    
}



function loadMap(g:Grid,map:Array<number>,medicines:Array<any>):void{
    const base=41;
    const texture={
        box:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2],new PIXI.Rectangle(0,0,60,68)),
        box1:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2],new PIXI.Rectangle(61,0,60,68)),
        box2:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2],new PIXI.Rectangle(122,0,60,68)),
        box3:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2],new PIXI.Rectangle(183,0,60,68)),
        s1:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3],new PIXI.Rectangle(base*0,0,base,52)),
        s2:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3],new PIXI.Rectangle(base*1,0,base,52)),
        s3:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3],new PIXI.Rectangle(base*2,0,base,52)),
        s4:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(160,180,base,60)),
        s5:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(200,180,base,60)),
        s6:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(240,180,base,60)),
        s7:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(280,180,base,60)),
        s8:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(320,180,base,60)),
        s9:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4],new PIXI.Rectangle(340,180,base,60)),
        t1:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(0,0,85,82)),
            t2:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(85,0,85,66)),
            t3:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(170,0,75,73)),
            t4:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(245,0,59,78)),
            t5:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(364,0,62,75)),
            t6:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(425,0,63,80)),
            t7:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(198,84,63,58)),
            t8:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(69,341,67,64)),
            t9:new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5],new PIXI.Rectangle(0,245,64,75)),
    }
    
    // 填上4个角
    new Stone({col:-1,row:-1,texture:texture.box3,destructible:false}).addTo(g)
    new Stone({col:18,row:10,texture:texture.box3,destructible:false}).addTo(g)
    new Stone({col:18,row:-1,texture:texture.box3,destructible:false}).addTo(g)
    new Stone({col:-1,row:10,texture:texture.box3,destructible:false}).addTo(g)

    map.forEach((item,index) => {
        let {col,row}=getColRowByIndex(index,18)
        if(col==0){
                new Stone({col:col-1,row,texture:texture.box3,destructible:false}).addTo(g)
        }else if(col == 17){
                new Stone({col:col+1,row,texture:texture.box3,destructible:false}).addTo(g)
        }else if(row == 0){
                new Stone({col:col,row:row-1,texture:texture.box3,destructible:false}).addTo(g)
        }else if(row == 9){
                new Stone({col:col,row:row+1,texture:texture.box3,destructible:false}).addTo(g)
        }


        //add Medicine if have
        if(medicines[index]&&item){
            if(medicines[index].eat) return;
            switch(medicines[index].medicine){
                case 'add_speed':
                    new AddSpeed({id:medicines[index].id,col,row}).addTo(g)
                    break;
                case 'add_bubble':
                    new AddBubble({id:medicines[index].id,col,row}).addTo(g)
                    break;
                case 'add_bubble_radius':
                    new AddBubbleRadius({id:medicines[index].id,col,row}).addTo(g)
                    break;
            }
        }
        
        switch (item){
            case z:
                new Stone({col,row,texture:texture.s2,destructible:false}).addTo(g)
                break;

            case x:
                new Stone({col,row,texture:texture.t1,destructible:false}).addTo(g)
                break;

            case a:
                new Stone({col,row,texture:texture.box2}).addTo(g);
                break;

            case b:
                new Stone({col,row,texture:texture.s1}).addTo(g)
                break;

            case c:
                new Stone({col,row,texture:texture.box3}).addTo(g)
                break;

            case d:
                new Stone({col,row,texture:texture.t9}).addTo(g)
                break;

            case e:
                new Stone({col,row,texture:texture.t8}).addTo(g)
                break;
        }

    })
}
function getColRowByIndex(index:number,mCol:number){
    let col=0,row=0;
    if(index!=0){
            col=((index+1)%mCol || mCol) -1;
        }else{
            col=(index+1)%mCol -1;
        }
    row=((index+1)%mCol)==0?((index+1)/mCol)-1:Math.floor((index+1)/mCol);

    return {col,row}
}


function notice(str:string):void
{
    text.text=str;
    text.visible=true;
    clearTimeout(noticeTimeout);
    noticeTimeout=setTimeout(function(){
        text.visible=false;
    },3000)
}


