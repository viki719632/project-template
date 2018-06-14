## 构建文档

> 安装依赖
* npm install
* npm install gulp -g


> 打包采用gulp跟webpack
需同时启动`两个`命令行

```
gulp reload 
npx webpack --watch
```

    实时刷新页面，并且所有终端同步刷新，监听事件
---
    开发js请遵循严格模式，即'use strict';