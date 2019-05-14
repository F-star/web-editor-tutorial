

let canvas = SVG('editor-container').size(500, 500);
let draw = canvas.nested().id('svgcontent');
// 视口对象（单例模式）
let workArea = {
    width: 1547.7,
    height: 1085.5,
    top: 40,
    left: 40,
    el: $('div#workarea'),
    init() {
        this.el
            .width(this.width)
            .height(this.height)
            .css('top', this.top)
            .css('left', this.left)
            .scrollTop( (canvas.height() - this.el.height()) / 2 )      // 使 draw 居中
            .scrollLeft( (canvas.width() - this.el.width()) / 2 )     
    }
};

// svg 主体初始化。
function initDraw() {
    const width = 515.9,
          height = 328.5;
    draw
        .size(width, height)
        .move(width, height)
        .viewbox(0, 0, width, height);
    // .attr({overflow: 'visible'})
}

// 画布初始化。
function initCanvas() {
    canvas
        .size(workArea.width, workArea.height)
        .center(draw.x() + draw.width() / 2, draw.y() + draw.height() /2)
        // .size(draw.width() * 3, draw.height() * 3)
    // .attr({overflow: 'visible'})
}

// 画布背景初始化
function initDrawBg() {
    let canvasBg = canvas.nested().id('canvasBg');
    canvasBg
        .size(draw.width(), draw.height())
        .center(draw.x() + draw.width() / 2, draw.y() + draw.height() /2)
        .back();
    canvasBg.rect('100%', '100%').fill('#fff').id('bg')
}


// canvasBg 的 x/y/width/height 追随 svgcontent
// div#editor-container 的 width/height 追随 canvas
let img_cx, img_cy;

initDraw();
initCanvas();
initDrawBg();

workArea.init();


// let img = draw.image('./img.jpg').loaded(function(loader) {
//     // console.log(loader)
//     // this.attr('transform', 'matrix(-0.4493 0 0 0.4493 4.4883 90.1656)')
//     // this.attr('transform', 'rotate(27.3215 122.768 292.886) matrix(-0.4493 0 0 0.4493 4.4883 90.1656)')
//     // this.attr('transform', 'rotate(5 144.092 131.323) matrix(0.420881 0 0 0.40591 359.558 81.4252)')
//     // this.attr('transform', 'rotate(32.1747 278.091 140.823) matrix(-0.384356 0 0 0.367735 -152.801 79.3704)')
//     this
//         // .attr('transform', 'rotate(32.1747 278.091 140.823) matrix(-0.384356 0 0 0.367735 -152.801 79.3704)')
//         // .attr('transform', 'rotate(7.48299 142 200.379) matrix(0.621537 0 0 0.588116 6.81563 35.4837)')
//         .attr('transform', 'rotate(7.48299 71.1852 172.275) matrix(0.268349 0 0 0.492854 11.1277 43.5504)')
//         .size(415, 388)
//         // .move(-1328.57, -26.8886);
//         // .move(-1341.57, 147.8886);
//         // .move(10, 86)
    
//     highLight(img)
// });

let img = draw.image('./img.jpg').loaded(function(loader) {
    this
        .translate(10, 30)
        .rotate(30, 0, 0)
        .x(10)
        .y(30);


});


// 缩放时
// 如果已经translate，会导致错误。。。