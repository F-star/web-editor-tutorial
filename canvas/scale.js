
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
                // console.log('选中', target.id);


                dragElement = SVG.adopt(target);
                const centerElement = SVG.get(getRelativeDir(target.id));

                centerX = centerElement.cx();   // 记录缩放中心
                centerY = centerElement.cy();

                oldW = dragElement.cx() - centerX;
                oldH = dragElement.cy() - centerY;
                // dragX = dragElement.cx();
                // drawY = dragElement.cy();
                // svgEditor.activeEl = el;
                //     angle =  el.transform().rotate;
                // const rot = canvas.node.createSVGTransform();
                // rot.setRotate(-angle, cx, cy);  
                // const rotm = rot.matrix

                // console.log('缩放中心', getRelativeDir(target.id), centerX, centerY);
                // console.log('宽高', target.id, oldW, oldH);

                
            }
        },

        mouseMove(e) {
            if (activeFlag) {
                console.log('------------------------------------')
                const mouseX = e.offsetX - draw.x(),
                    mouseY = e.offsetY - draw.y();

                // 强势修改！！

                console.log('光标位置，', mouseX, mouseY)
                
                let newDragPt = transformPoint(mouseX, mouseY, img.transform());

                
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
            
                const scaleX = (newDragX - centerX) / oldW,
                    scaleY = (newDragY - centerY) / oldH;


                // console.log({
                //     scaleX,
                //     scaleY,
                // })
            }
        },

        mouseUp(e) {
            // if (activeFlag) {
                activeFlag = false;
            // }
        },
    }

})();


canvas.on('mousedown', scale.mouseDown);
canvas.on('mousemove', scale.mouseMove);
canvas.on('mouseup', scale.mouseUp);