#### AIS运行环境
|      | dev  | pro  |
|------|------|------|
| 控制中心 | localhost:8080/#!/     | http://192.168.5.5:8080 |
| 复苏室   | localhost:8080/#!/pacu | http://192.168.5.5:8080/pacu |
| 手术室   | localhost:8080/oprm#!/ | http://192.168.5.5:8081 |

* 运行和打包
1)npm run dev   开发环境
2)npm run build 生产环境打包
3)npm run clean 清除build文件

* 打包后注意(手动操作)：
1)在build打包文件下新建两个文件夹，仅供参考分别取名（app-控制中心和app-手术室）
2)将build文件下打包生成的文件分别复制到这两个新建文件夹内
3)这时需要同时删除（app-控制中心和app-手术室）js和css文件下多余的文件，并且修改index.html文件引用的js和css路径。

#### 第三方组件
> Angular oi.select
https://github.com/tamtakoe/oi.select

> Angular UI-Router
http://www.tuicool.com/articles/zeiy6ff

> Webpack知识
http://www.cnblogs.com/sloong/p/5570774.html
http://webpack.github.io/docs/multiple-entry-points.html

> bootstrap icon
http://glyphicons.bootstrapcheatsheets.com/
http://www.tutorialspoint.com/bootstrap/bootstrap_glyph_icons.htm

> angular-ui-grid
http://ui-grid.info/docs/#/tutorial

> angular-toastr
https://github.com/Foxandxss/angular-toastr

> flex
https://material.angularjs.org/latest/layout/introduction

> ngAnimate
http://augus.github.io/ngAnimate/
http://www.jb51.net/article/68107.htm
http://embed.plnkr.co/0r7GdM91jU2NWsqPtruh/

#### 前端框架
* angular1 + webpack2 + bootstrap3 + flex

#### 开发时注意
* 如需登录、验证、获取权限、用户信息、退出，可以引入'auth'服务
* 调用后台接口需引入'IHttp'
* 开发时，不需要再引入 '$state' 和 '$stateParams'，只需要引入$rootScope即可。
   >>>> 使用时：$rootScope.$state 和 $rootScope.$stateParams
* 文书样式，将页面私有的样式，用id选择器单独写在一个文件里。
* 尽量使用bootstrap字体图标，链接上面有 【bootstrap icon】
* ui-grid  引入uiGridServe服务
   >>>> 具体看uiGridServe.factory.js
