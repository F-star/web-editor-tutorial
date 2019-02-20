
let selectorParentGroup = canvas.group().id('selectorParentGroup');
let selectedBox = selectorParentGroup.group().id('selectedBox');

selectorParentGroup.translate(draw.x(), draw.y())


canvas.on('mousedown', function(e) {
    let target = e.target;
    // console.log(target)
    // console.log(target.tagName)
    if(target.tagName == 'image') {
        let image = SVG.adopt(target);
        highLight(image)
    }
})

svgEditor = {
    activeEl: null,
}

function removeHL() {
    selectedBox.clear();
}

// 显示选中框。
function highLight(el) {
    console.log('显示高光。')
    removeHL();

    const bbox = el.bbox(),
        zoom = draw.viewbox().zoom,
        m = el.transform();

    let {x, y, w, h} =  bbox;
    // console.log(bbox)
    
    const newBox = transformBox(x * zoom, y * zoom, w * zoom, h * zoom, m),
        {aabox} = newBox;
    
    x = aabox.x;
    y = aabox.y;
    w = aabox.width;
    h = aabox.height;

    // 计算出旋转中心。
    const cx = x + w/2,
        cy = y + h/2;
    
    const angle = m.rotation;
    // console.log(angle);
    if (angle != 0) {
        // 旋转回去。
        const rot = canvas.node.createSVGTransform();
        rot.setRotate(-angle, cx, cy);  
        const rotm = rot.matrix;

        // console.log(rotm)
        newBox.tl = transformPoint(newBox.tl.x, newBox.tl.y, rotm);   // 左上角：旋转 -angle   
        newBox.tr = transformPoint(newBox.tr.x, newBox.tr.y, rotm);
        newBox.bl = transformPoint(newBox.bl.x, newBox.bl.y, rotm);
        newBox.br = transformPoint(newBox.br.x, newBox.br.y, rotm);


        minx = Math.min(newBox.tl.x, newBox.tr.x, newBox.bl.x, newBox.br.x);
        miny = Math.min(newBox.tl.y, newBox.tr.y, newBox.bl.y, newBox.br.y);
        maxx = Math.max(newBox.tl.x, newBox.tr.x, newBox.bl.x, newBox.br.x);
        maxy = Math.max(newBox.tl.y, newBox.tr.y, newBox.bl.y, newBox.br.y);

        x = minx;
        y = miny;
        w = maxx - minx;
        h = maxy - miny;
    }

    const gripCoords = {
        nw: [x, y],
        ne: [x + w, y],
        sw: [x, y + h],
        se: [x + w, y + h],
        n: [x + w / 2, y],
        w: [x, y + h / 2],
        e: [x + w, y + h / 2],
        s: [x + w / 2, y + h]
    };

    Object.entries(gripCoords).forEach(([dir, coords]) => {
        selectedBox.rect(8, 8).center(coords[0], coords[1]).id(dir);
    })

    // 操作 DOM 
    // selectedBox.rotate(angle, cx, cy);
    selectedBox.attr('transform', `rotate(${angle}, ${cx}, ${cy})`);

    selectedBox.circle(8)
        .center(cx, cy)
        .fill('blue');
}

/*********** 鼠标事件 ***********/
let referX, referY,
    offsetX, offsetY,
    startX, startY,
    startMatrix;
function mouseDown(e) {
    let target = e.target;
    if (target.tagName == 'image') {

        let image = SVG.adopt(target);
        showBBox(image);
        svgEditor.activeEl = image;


        // 计算变形后的box.
        // console.log(image.transform())
        let m = image.transform()
        let refer = transformPoint(image.bbox().x, image.bbox().y, m);
        referX = refer.x;   // 选中元素的左上角坐标。
        referY = refer.y;

        startX = e.offsetX;   // 光标位置。
        startY = e.offsetY;

        offsetX = referX - e.offsetX,  //  元素左上角的位置 - 光标位置
        offsetY = referY - e.offsetY;

        startMatrix = image.attr('transform');

        highLight(image);
    } else if (target.tagName == 'svg' || (target.tagName == 'rect' && target.id == 'bg' )){
        removeHL();
    }

}

function mouseMove(e) {
    // let target = e.target;


    if (svgEditor.activeEl) {
        // svgEditor.activeEl.move(newX, newY);
        // highLight(svgEditor.activeEl);
        // 【！！！！】先暂时 translate，然后再计算为 x, y
        let image= svgEditor.activeEl; 
        const translate = `translate(${e.offsetX - startX} ${e.offsetY - startY}) `;
        image.attr('transform', translate + startMatrix);
        

    }

}

function mouseUp() {
    if (svgEditor.activeEl) {
        highLight(svgEditor.activeEl);
        svgEditor.activeEl = null; 
        startMatrix = null;
    } 
   
}


canvas.on('mousedown', mouseDown);
canvas.on('mousemove', mouseMove);
canvas.on('mouseup', mouseUp);

/**
 * 有 matrix 的图片，移动时，只更新 x 和 y
 * 
 * matrix属性
 */

 // 如何求一个有 tansform 属性的元素的旋转中心？



 /**
  * 
  */