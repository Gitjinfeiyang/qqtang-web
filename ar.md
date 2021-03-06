# 菜鸡前端划水时间，用js来实现 QQ堂 小游戏吧

# 介绍
QQ堂是我读初中时候玩的一款游戏，那个时候我记得还是很火的，陪伴了我相当长的一段时间。本着学习的精神，想着试试用js实现。
还有一些细节待优化，但是核心玩法已实现，废话不多说上截图和地址
#### [项目地址](https://github.com/Gitjinfeiyang/qqtang-web)
#### [在线Demo](http://47.240.9.34:3003/qqtang)
demo地址可能会换，打不开请移步项目地址

# 技术选型
绘图引擎方面看了很多引擎的对比，最终选择使用`pixi.js`，一方面性能比较好，另一方面这个是单纯的绘图引擎，没有其他复杂的功能，比较符合我的目的。声音引擎使用了`Howler`,联机使用的`socket.io`，另外代码量不算小，使用了`typescript`。
另外游戏中的图片以及声音资源都是搜索到的，有的清晰度不是很高。

# 思路
首先对游戏玩法进行分析，首先是一个大的地图，地图初始化时有障碍物，玩家分组，在地图里使用泡泡攻击对方，泡泡爆炸是十字型的，部分障碍物可以被泡泡摧毁，并且可能会掉落物品，玩家获得物品后会获得增益，如泡泡攻击范围增大，移动速度加快等，泡泡攻击到敌人，敌人则困在泡泡里，如果戳破泡泡，则敌人失败，困在泡泡里时可以被队友救活。
通过分析，新建了以下几个类
```javascript
// 地图类，为什么要叫网格呢，因为地图上的物品都是一格一格的，我们加载地图时会讲到
class Grid {}

// 物品 定义这个为地图上所有物品，具有坐标，第几行，第几列等属性
class Material{
   x:Number // x坐标 像方块这种物体只用指定行列就行了
   y:Number // y坐标
   row:Number 
   col:Number
   destructible:boolean;  //是否可破坏 用于被泡泡炸到检测
   passable:boolean;      //是否可穿过
   //...

   // 每个物体有对应的render方法，仅初始化调用，会拿到pixi的实例，后面更新了状态再调用实例方法更新绘图
   render():void{}
}

// 玩家
class Player extends Material{}

// 障碍物，玩家无法通过障碍物
class Stone extends Material{}

// 遮罩，玩家可以躲在遮罩下
class Mask extends Material{}

// 泡泡
class Bubble extends Material{}

// 药物
class Medicine extends Material{}

// 药物
class AddSpeed extends Medicine{}

// 由于手机和pc控制不太一样，所以控制器需要根据平台初始化
class GameController {}
```

首先需要绘制地图，这里地图其实是一个一个重复的方块图片，然后在上面添加各种小物体，这里地图我用了一个矩阵数组去控制
```javascript
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
```
首先根据数组绘制一个大的地图，这里所有的图片都是一样的，然后绘制物体，`0`代表空白可活动区域，再根据其他不同的数字去加载`Stone`等物体，所以这里地图是可以根据后端返回的不同数组去加载不同的地图的。

然后就要加上我们的玩家了，先实现单人版的，后面多人的其实就是地图上再增加`Player`，再通过websocket去控制行为。
玩家同其他物体一样，不同的是，需要监听控制器来实现不同的行为，方向键控制人物的朝向，行进的方向，并且在行进时播放人物走动的动画，同时进行碰撞检测，如果玩家碰到`Stone`，则不允许继续前进，如果碰到`Medicine`，比如增加速度，则将玩家的速度+1。（这里碰撞检测有一个小优化，每次碰撞检测会拿到玩家当前的行和列，然后再找相邻的物体，否则会需要遍历整个地图的物体。）
```javascript
init():void{
   gameControler.onDirectionChange=(e) => {
      this.self.faceTo(e.direction)
      switch(e.direction){
         case 'ArrowLeft':
            this.self.moveLeft()
            break;
         case 'ArrowRight':
            this.self.moveRight()
            break;
         case 'ArrowUp':
            this.self.moveUp()
            break;
         case 'ArrowDown':
            this.self.moveDown()
            break;
         case 'Center':
            this.self.stop()
            break;
      }
   }
}

move():void{
   const hitMd:Material = this.hitTest()
   if(hitMd){
      // 如果碰到了物体
      if(!hitMd.passable){
         // 不可穿过
         this.stopMove()
      }else if(hitMd.isMedicine){
         // 如果是药物，则吃下，增益在该药物里实现对该玩家进行属性修改
         this.eat(hitMd)
      }
   }
}


```

当玩家吐出`Bubble`时，`Bubble`会根据玩家的属性有不同的爆炸范围等属性，当其爆炸时计算其爆炸范围内的所有物体，如果碰到`Stone`,则被摧毁，并且后面的不被摧毁，如果碰到玩家，判断玩家是否为敌人，再更新玩家的状态是否被困住。

至此，我们可以添加我们的服务端支持了，websocket其实就像是一个一个的事件，所以我们将游戏里所有的变化都发送事件到服务器，服务器再通知地图上的玩家作出相应改变。
首先要有一个房间类`Room`，只有这个房间的玩家才会同步状态，玩家开始游戏则加入该房间，当房间数满时发送开始游戏事件，这时服务器会自动生成药物，玩家位置，然后客户端根据数据进行渲染和初始化。
当玩家移动时，会发送移动事件，房间再通知其他客户端更新该玩家的位置，攻击也是同理。
```javascript
Server.on("player_walk",(data) => {
   let player=this.players.find((item) => {
         return item.id === data.id;
   })

   player.faceTo(data.direction);
   player.move()
})
Server.on("player_walk",(data) => {
   // ...
})
Server.on("player_create_bubble",(data) => {
   // ...
})
Server.on("player_bubble_boom",(data) => {
   // ...
})
// ...
```


# 总结
写这个游戏时毕业一年，当时也是抱着学习的心态，所以有很多地方现在看来写的的确是不忍直视。。
游戏中有大量代码是pixi渲染的代码，不过主要的逻辑文中已经基本覆盖到了，有时间会继续优化这个游戏。

# 感谢阅读






