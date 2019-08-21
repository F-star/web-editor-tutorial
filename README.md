# web-editor-tutorial

> web 编辑器教程的源代码。

因为使用了 ES6 的 import 语法，所以需要在静态服务器下运行。建议使用 vscode 的 live server 插件。

### 教程目录（更新中）

#### 1. 撤销重做功能

编辑器 “撤销重做” 功能。

https://f-star.github.io/web-editor-tutorial/undo/

#### 2. 编辑器层次结构

DOM结构设计。

https://f-star.github.io/web-editor-tutorial/canvas/

#### 3. path 元素缩放（没有使用 transform 方案，可以等比缩放）

demo 可以运行在 Chrome 浏览器，在 Firefox 运行会有问题。这样因为不同浏览器的 e.offsetX / e.offsetY 在 svg 里的行为不同。

https://f-star.github.io/web-editor-tutorial/scale/