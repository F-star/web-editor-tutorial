import './commondAction.js';

// 创建一个 svg 元素，并返回一个 svgjs 包装后的对象
window.draw = SVG('drawing').size(500, 500);


// 绑定事件
draw.on('click', function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    executeCommond('drawText', x, y, 20, '好');
});

document.getElementById('undoBtn').onclick = function() {
    executeCommond('undo');
};

document.getElementById('redoBtn').onclick = function() {
    executeCommond('redo');
};


