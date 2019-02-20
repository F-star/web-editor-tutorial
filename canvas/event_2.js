// import { parseCanvasCoord } from "./util.js";

let selectorParentGroup = canvas.group().id('selectorParentGroup');
let selectedBox = selectorParentGroup.group().id('selectedBox')



canvas.on('mousedown', function(e) {
    let target = e.target;
    console.log(target)
    console.log(target.tagName)
    if(target.tagName == 'image') {
        let image = SVG.adopt(target);
        highLight(image)
    }
})

function highLight(el) {
    const b = el.bbox(),
        // [x, y] = parseCanvasCoord(b.x, b.y),
        [width, height] = [b.width * draw.viewbox().zoom, b.height * draw.viewbox().zoom];
    
        // 解析。。
        let m = el.transform()
        console.log(m);


        selectedBox.clear();


        /*** 计算选中框的4个点 ***/
        let gripsCoord = [],
            x, y;

        function cal4Grip(x, y, x2, y2) {

            x = (b.x * m.a + m.e) * draw.viewbox().zoom;
            y = (b.y * m.d + m.f) * draw.viewbox().zoom;
        }

        // // 点1
        // x = 



        // draw 坐标系的旋转中心：
        let c = ((bbox) => {
            const {x, y, x2, y2} = bbox;
            const {a,b,c,d,e,f} = m;
            let tx = ((a * x + c * y + e) + (a * x2 + c * y2 + e)) / 2,
                ty = ((b * x + d * y + f) + (b * x2 + d * y2 + f)) / 2;

            return {
                x: tx,
                y: ty
            }
            

        })(b);

        // draw.rect(10, 10).center(c.x, c.y).fill('red')



        // 点1
        // 
        // let p1 = parseCanvasCoord(b.x * m.a + b.y * m.c + m.e, b.y * m.d + b.y * m.d + m.f);
        let p1 = parseCanvasCoord( b.x * m.a + m.e, b.y * m.d + m.f);
        selectedBox.circle(8)
            .center(p1[0], p1[1]);
        
        // 点4 （这里计算有问题）
        // let p4 = parseCanvasCoord(b.x2 * m.a + + b.y2 * m.c + m.e, b.y2 * m.d + b.y2 * m.d + m.f) 
        let p4 = parseCanvasCoord(b.x2 * m.a + m.e, b.y2 * m.d + m.f)
        // selectedBox.circle(8)
        //     .center(p4[0], p4[1])
        //     .fill('red');
        // selectedBox.circle(8)
        //     .center( ...parseCanvasCoord(b.x * m.a + m.e, el.y() * m.d + m.f));

        // FIXME 应该是旋转中心算错了？
        // let pctr = [(p1[0] + p4[0]) / 2, (p1[1] + p4[1])/2 ];
        selectedBox.circle(8)
            .center(c.x, c.y)
            .fill('blue');
        

            // .translate( ...parseCanvasCoord(m.e, m.f) )

        selectorParentGroup.translate(draw.x(), draw.y())
        selectedBox.attr('transform', `rotate(${m.rotation},${c.x},${c.y})`);  // 中心点为 bbox 的左上角。
        // selectedBox.rotate(m.rotation , pctr[0], pctr[1]);  // 中心点为 bbox 的左上角。

        // 这里改成 path。
        selectedBox.rect(width, height)
            .move(p1[0], p1[1])
            .fill('none')
            .stroke('#4d84ff')
            .id('selectBox0')

}


/**
 * 有 matrix 的图片，移动时，只更新 x 和 y
 * 
 * matrix属性
 */

 // 如何求一个有 tansform 属性的元素的旋转中心？