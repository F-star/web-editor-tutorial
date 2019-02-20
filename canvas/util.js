
const parseCanvasCoord = (x, y) => {
    x = x * draw.viewbox().zoom;
    y = y * draw.viewbox().zoom;
    return [x, y];
}