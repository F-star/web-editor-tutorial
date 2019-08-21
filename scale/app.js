/**
 * 入口文件
 */

import {svgRoot, draw} from './canvas.js'
import {showSelectedBox} from './util.js'
import { selectAction } from './selector.js';

// svg 编辑器环境变量。

window.editor = {
    selected: null,
}

// 初始化
svgRoot.node.addEventListener('mousedown', selectAction.mousedown);
svgRoot.node.addEventListener('mousemove', selectAction.mousemove);
svgRoot.node.addEventListener('mouseup', selectAction.mouseup);


// 画一个 path 元素。
const pathStr = `M161.25 80C190 57.5 261.25 85 223.75 127.5C155 176.25 252.5 197.5 257.5 212.5C262.5 227.5 178.75 253.75 126.25 222.5C73.75 191.25 132.5 102.5 161.25 80Z`;
const path = draw.path(pathStr)
                    .fill('none')
                    .stroke({width: 2, color: '#000'});
    
editor.selected = path;
// 显示 选中框。
showSelectedBox(path);
