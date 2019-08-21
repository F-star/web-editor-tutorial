import { parseDrawCoord, showSelectedBox } from "./util.js";

let params = {
    state: 'init',   // init drag
    coord: {
        center: {},
        control: {},   // 控制点。
        contentCenter: {},  // svgContent 上的坐标
        contentControl: {}
    },
    box: {
        old: {},
        new: {},
    },
    originD: '',
};

class SelectAction {
    constructor() {
        
    }
    mousedown(e) {
        // 点击 path -> 显示格子。
        if (e.target.parentNode.id === 'selectedBox') {
            params.state = 'drag';
            
            // console.log(editor.selected)
            const i = parseInt(e.target.id.slice(-1));
            const controlGrip = SVG.get('grip_dir-' + i);
            const centerGrip = SVG.get('grip_dir-' + ((i + 4) % 8));

            params.coord.control = {x: controlGrip.cx(), y: controlGrip.cy()};
            params.coord.center = {x: centerGrip.cx(), y: centerGrip.cy()};
            params.coord.contentControl = parseDrawCoord(params.coord.control);
            params.coord.contentCenter = parseDrawCoord(params.coord.center);

            // params.box.old.width = 
            params.originD = editor.selected.attr('d');

            // svgContent.circle(10).cx(params.coord., 10);
            console.log('点击控制点 ' + i)
        }
    }
    mousemove(e) {
        const {x: mouse_x, y: mouse_y} = parseDrawCoord({x: e.offsetX, y: e.offsetY});
        const uniformScale = e.shiftKey;   // 是否等比缩放。
        if (params.state === 'drag') {
            const {x: cx, y: cy} = params.coord.contentCenter,
                  {x: ctrlX, y: ctrlY} = params.coord.contentControl,
                  mouse_dx = mouse_x - cx,
                  mouse_dy = mouse_y - cy,
                  origin_dx = ctrlX - cx,
                  origin_dy = ctrlY - cy;

            if (mouse_dx === 0 || mouse_dy === 0) return;  // scaleX（或 scaleY） 要变成 0，结束运算。
            console.log({
                mouse_dx,
                mouse_dy,
                origin_dx,
                origin_dy,
            })
            let scaleX, scaleY;
            if (!uniformScale) {
                scaleX = origin_dx == 0 ? 1 : mouse_dx / origin_dx;
                scaleY = origin_dy == 0 ? 1 : mouse_dy / origin_dy;
            } else {
                // 等比缩放。

                // 1. 同一象限
                if (mouse_dx * origin_dx >= 0 && mouse_dy * origin_dy >= 0) {
                    if (Math.abs(mouse_dx / mouse_dy) <  Math.abs(origin_dx / origin_dy)) {
                        scaleX = Math.abs(mouse_dx / origin_dx);
                        scaleY = scaleX;
                    } else {
                        scaleY = mouse_dy / origin_dy;
                        scaleX = scaleY; 
                    }
                }
                // 2. x 轴方向 + 反方向 缩放（点中的是 3、7 控制点）
                else if (origin_dy === 0) {
                    scaleX = -Math.abs(mouse_dx / origin_dx);
                    scaleY = scaleX;
                }
                // 3. y 轴方向 + 反方向 缩放（点中的是 1、5 控制点）
                else if (origin_dx === 0) {
                    scaleY = -Math.abs(mouse_dy / origin_dy);
                    scaleX = scaleY;
                }
                // 4. 对面（即原点对称的象限）
                else if (mouse_dx * origin_dx < 0 && mouse_dy * origin_dy < 0) {
                    if (Math.abs(mouse_dx / mouse_dy) >  Math.abs(origin_dx / origin_dy)) {  // 基准和象限的控制。
                        scaleX = -Math.abs(mouse_dx / origin_dx);
                        scaleY = scaleX;
                    } else {
                        scaleY = -Math.abs(mouse_dy / origin_dy);
                        scaleX = scaleY; 
                    }
                }
                // 5. x 轴对称的象限。
                else if (mouse_dx * origin_dx < 0 && mouse_dy * origin_dy >= 0) {
                    scaleX = -Math.abs(mouse_dx / origin_dx);
                    scaleY = scaleX;
                }
                // 6. y 轴对称的象限：只以
                else if (mouse_dx * origin_dx > 0 && mouse_dy * origin_dy <= 0) {
                    scaleY = -Math.abs(mouse_dy / origin_dy);
                    scaleX = scaleY;
                }
            }
            editor.selected.plot( dScale(params.originD, scaleX, scaleY, cx, cy) );
            showSelectedBox(editor.selected);
        }
    }
    mouseup(e) {
        params.state = 'init';
    }
}

export const selectAction = new SelectAction();



const dScale = (d, scaleX, scaleY, cx=0, cy=0) => {
    // editorGlobal.activePath
    //     .scale(sx, sy, cx, cy);
    if (typeof d == 'string') {
        d = new SVG.PathArray(d).value;
    }

    // FIXME，还要考虑 v 和 l 的问题。只有一个值。
    
    let rd = d.map( (item, index, array) => {
        const coords = item.slice(1);
        if (coords.length == 0) return item;
        for (let i = 0; i < coords.length; i+=2) {

            // 简单判断了 V 的情况，还要考虑 H 的清空。（此外还有需要算法进行转换的 Q 和 A命令）
            if (item[0] == 'V') {
                coords[1]= coords[0];
                coords[0] = array[index - 1].slice(-2)[0];
                item[0] = 'L';
            }
            [ coords[i], coords[i+1] ] = scale(coords[i], coords[i+1], scaleX, scaleY, cx, cy);
        }
        return [item[0], ...coords];
        
    });
    return rd;

    function scale(x, y, scaleX, scaleY, cx=0, cy=0) {
        // ... 其实这里没什么必要写成矩阵。。。我佛了。
        const m = [
            scaleX, 0, 0, scaleY, 0, 0
        ];
        return transform(x, y, m, cx, cy);
    }
    function transform(x, y, matrix, cx=0, cy=0) {
        const [a, b, c, d, e, f] = matrix;
    
        // 先偏移 cx，cy 距离到到原点。
        // let translateMatrix = [
        //     1, 0, 0, 1, -cx, -cy
        // ];
        x -= cx;
        y -= cy;
    
        let tx = a * x + c * y + e;
        let ty = b * x + d * y + f;
    
        tx += cx;
        ty += cy;
    
        return [tx, ty];
    }
    
}