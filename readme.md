# 一个类似QQ堂的小游戏
* 目前支持两人联机对战

# Demo
[Demo](http:47.240.9.34:3003/qqtang)

# Docker部署
```
docker pull jinfeiyang/qqtang
docker run -d -p 3003:3003 --name qqtang jinfeiyang/qqtang
```

# 代码部署
需要部署服务端[qqtang-server](https://github.com/Gitjinfeiyang/qqtang-server)
