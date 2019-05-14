
function getRelativeDir(dir) {
    let relativeDir = '';
    const map = {
        n: 's',
        s: 'n',
        w: 'e',
        e: 'w'
    }
    for (let i = 0; i < dir.length; i++) {
        relativeDir += map[dir[i]];
    }
    return relativeDir;
};


const scale = (() => {

    let centerX, centerY,
        // dragX, dragY;
        oldW, oldH,
        dragElement,
        originM,
        oldMatrixObj,
        newM,
        realCtr,
        activeFlag = false;

    function getCenterPoint(bbox, m, zoom = 1) {
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
        return {
            x: cx, 
            y: cy
        };
    }




    return {
        mouseDown(e) {
            const target = e.target;
            if(target.tagName == 'rect' && target.id != 'bg') {


                activeFlag = true;
                originM = img.attr('transform');
                oldMatrixObj = img.transform();
                // console.log('选中', target.id);
                let m = img.transform();


                dragElement = SVG.adopt(target);
                const centerElement = SVG.get(getRelativeDir(target.id));

                window.c = centerElement;

                // 计算出要旋转回去的 matrix
                let rotM = calMatrixByRotation(img.transform().rotation, img_cx, img_cy);


                let ctr = transformPoint(centerElement.cx(), centerElement.cy(),rotM);
                realCtr = ctr;

                draw.circle(12).center(realCtr.x, realCtr.y).fill('pink')

                ctr = getOriginCoord(ctr.x, ctr.y, img.transform());   // 记录img无transform时的缩放中心
        
                // ctr = transformPoint(ctr.x, ctr.y, );
                // centerY = centerElement.cy();
                centerX = ctr.x;
                centerY = ctr.y;

                draw.circle(8).center(centerX, centerY).fill('blue')

                
                let dragCoord = transformPoint(dragElement.cx(), dragElement.cy(), rotM);
                dragCoord = getOriginCoord(dragCoord.x, dragCoord.y, img.transform());
                


                draw.circle(8).center(dragCoord.x, dragCoord.y).fill('blue')

                oldW = dragCoord.x - centerX;
                oldH = dragCoord.y - centerY;
                

                // 求img的缩放中心点。



                
            }
        },

        mouseMove(e) {
            if (activeFlag) {
                console.log('------------------------------------')
                let mouseX = e.offsetX - draw.x(),
                    mouseY = e.offsetY - draw.y();
                
                // 强势修改！！

                console.log('光标位置，', mouseX, mouseY)
                
                let newDragPt = getOriginCoord(mouseX, mouseY, img.transform());

                const originX = newDragPt.x,
                    originY = newDragPt.y;
                
                const angle =  img.transform().rotation,
                    rot = canvas.node.createSVGTransform();
                    center = getCenterPoint(img.bbox(), img.transform());

                console.log('center:', center, '-angle', -angle)

                rot.setRotate(-angle, center.x, center.y);  
                const rotm = rot.matrix;

                newDragPt = transformPoint(newDragPt.x, newDragPt.y, rotm);

                const newDragX = newDragPt.x,
                    newDragY = newDragPt.y;

                console.log('   拖拽点的新坐标位置', newDragX, newDragY)

                dragElement.center(newDragX, newDragY);
            
                const scaleX = (originX - centerX) / oldW,
                    scaleY = (originY - centerY) / oldH;


                console.log({
                    scaleX,
                    scaleY,
                })

                /******* 修改 scale 进行缩放！！ *******/
                /**
                 * 1. 缩放中心点确定。
                 * 
                 */
                originM = img.attr('transform'); 

                // realCtr = {x: 23.66, y: 20.98}
                // newM = `${originM} translate(${-img.x()} ${-img.y()}) scale(${scaleX}, ${scaleY}) translate(${-img.x()} ${img.y()})`;
                newM = `${originM} scale(${scaleX}, ${scaleY}) `;
                // img.attr('transform', newM)

                // 尝试新方案。
                // 计算新的
            }
        },

        mouseUp(e) {
            if (activeFlag) {
                img.attr('transform', newM);
                activeFlag = false;
                highLight(img);

                // 计算缩放中心的偏移量
                let referElem = SVG.get('nw');
                let rotM = calMatrixByRotation(img.transform().rotation, img_cx, img_cy);
                let newCtrCoord = transformPoint(referElem.cx(), referElem.cy(), rotM);

                let oldCtrCoord = transformPoint(img.bbox().x, img.bbox().y, oldMatrixObj);

                console.table([
                    newCtrCoord,
                    oldCtrCoord
                ])

                const offsetX = oldCtrCoord.x - newCtrCoord.x,
                    offsetY = oldCtrCoord.y - newCtrCoord.y;

                img.attr('transform', newM + `translate(${offsetX} ${offsetY})`)
                highLight(img);


            }
        },
    }

})();


canvas.on('mousedown', scale.mouseDown);
canvas.on('mousemove', scale.mouseMove);
canvas.on('mouseup', scale.mouseUp);


// 方法抽象

// getCenterInTransformElem()   获取一个有 transform 属性的元素的中心。
// calMatrixByRotation()   传入 rotate,和 x y，求出对应 matrix



function calMatrixByRotation(angle, cx = 0, cy = 0) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        rot = svg.createSVGTransform();
    rot.setRotate(angle, cx, cy); 
    const rotm = rot.matrix;

    return rotm;
}