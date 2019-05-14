/**
 * 数学方法（部分搬运自 svgedit 开源项目）
 * @module math
 * 
 */

const transformPoint = function (x, y, m) {
    return {x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f};
}

const transformBox = function (l, t, w, h, m) {
    const tl = transformPoint(l, t, m),
      tr = transformPoint((l + w), t, m),
      bl = transformPoint(l, (t + h), m),
      br = transformPoint((l + w), (t + h), m),
  
      minx = Math.min(tl.x, tr.x, bl.x, br.x),
      maxx = Math.max(tl.x, tr.x, bl.x, br.x),
      miny = Math.min(tl.y, tr.y, bl.y, br.y),
      maxy = Math.max(tl.y, tr.y, bl.y, br.y);
  
    return {
      tl,
      tr,
      bl,
      br,
      aabox: {
        x: minx,
        y: miny,
        width: (maxx - minx),
        height: (maxy - miny)
      }
    };
  }

function showBBox(el) {
    console.log('原始bbox')
    const {x, y, w, h} = el.bbox(),
        coords = [
            [x, y],
            [x + w, y],
            [x + w, y + h],
            [x, y + h]
        ];
    coords.forEach(item => {
        draw.circle(8).center(item[0], item[1]).fill('red')
    })
    
}

// 计算原来的坐标。
function calOriginCoordByMatrix(x, y, m) {

}


// 求逆矩阵
function calInverseMatrix(obj) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let m = svg.createSVGMatrix();
  if (!obj) return null;
  if (obj.a != undefined) m.a = obj.a;
  if (obj.b != undefined) m.b = obj.b;
  if (obj.c != undefined) m.c = obj.c;
  if (obj.d != undefined) m.d = obj.d;
  if (obj.e != undefined) m.e = obj.e;
  if (obj.f != undefined) m.f = obj.f;

  return m.inverse();
}

function getOriginCoord(x, y, m) {
  return transformPoint(x, y, calInverseMatrix(m));
}