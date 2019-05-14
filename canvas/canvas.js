/**
 * 画布初始化
 */

// svgcanvas 是个 div，宽高需要和 canvas 同步。它的作用是挂载 svg 和其他 div（目前示例暂时不需要）
const svgRoot = SVG('svgcanvas').id('svgroot');         // svg root
const canvasBg = svgRoot.nested().id('canvasBg');       // svg 内容的底色，宽高需和 svg content 同步
const svgContent = svgRoot.nested().id('svgcontent');   // svg 的真正内容位置。
const draw = svgContent.group();                        // svgContent 下创建一个 group，作为第一个“图层”（类似ps的图层概念）

const guideLine = svgRoot.group().id('guideLine');                      // 放置辅助线的父容器
const selectedBox = guideLine.group().id('selectedBox');     // 选中框相关辅助线
const selectedBoxOutline = selectedBox.polygon()            // 选中框-矩形轮廓
                                        .fill('none')
                                        .stroke({width: 1, color: '#4d84ff'})
                                        .hide();    

// 选中框的 6个 缩放控制点                                        
const scaleGrips = (() => {
    const idPrefix = 'grip_dir-';
    let grips = [];
    for(let i = 0; i < 6; i++) {
        const id = idPrefix + i;
        grips[i] = selectedBox.rect(6, 6)
            .fill('#fff')
            .stroke({
                color: '#4d84ff',
                width: 1,
            })
            .id(id);
    };
    return grips;
})();

// 将 div#workarea 和 div#svgcanvas包装一下。
const workarea = {
    node: document.getElementById('workarea'),
    width() {
        // 暂时不做 setter。
        return parseFloat(this.node.style.width)
    },
    w() {
        return this.width();
    },
    height() {
        return parseFloat(this.node.style.height)
    },
    h() {
        return this.height();
    },
    scroll(w, h) {
        this.node.scrollTo(w, h);
    }
}

const svgcanvas = {
    node: document.getElementById('svgcanvas'),
    width() {
        // 暂时不做 setter。
        return parseFloat(this.node.style.width)
    },
    w() {
        return this.width();
    },
    height() {
        return parseFloat(this.node.style.height)
    },
    h() {
        return this.height();
    },
}


// 参数配置
const config = {
    bgcolor: '#fff',
    contentW: 517,
    contentH: 384,
}

// 初始化
svgContent.size(config.contentW, config.contentH).move(config.contentW, config.contentH);   // 设置宽高和左上角坐标
canvasBg.size(config.contentW, config.contentH).move(config.contentW, config.contentH);
svgRoot.size(config.contentW * 3, config.contentH * 3);
workarea.scroll( (svgRoot.width() - workarea.w())/2,  (svgRoot.height() - workarea.h())/2 ); // 滚动条拖到中间
canvasBg.rect('100%', '100%').fill(config.bgcolor);   // canvasBg 添加 白色 rect，实现达到填充背景色效果




export {
    svgRoot, canvasBg, svgContent, draw, guideLine, workarea, svgcanvas,
    selectedBox, selectedBoxOutline, scaleGrips
}