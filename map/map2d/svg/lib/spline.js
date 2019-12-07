function toPoints(points, tolerance, highestQuality) {
    // let mappedToObjXY = mapPointsArray2ObjectXY(points);
    points = simplify(points,tolerance,highestQuality);
    let converted = catmullRom2bezier(points);
    return converted;
}

function toPath(points) {
    var cubics = toPoints(points,1,true);
    var attribute = `M${points[0].x}, ${points[0].y}`;
    for (let i = 0; i < cubics.length; i++) {
        attribute += `C${cubics[i][0]},${cubics[i][1]} ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
    }
    return attribute;
}

function catmullRom2bezier(pts) {
    var cubics = [];
    for (var i = 0, iLen = pts.length; i < iLen; i++) {
        var p = [
            pts[i - 1],
            pts[i],
            pts[i + 1],
            pts[i + 2]
        ];
        if (i === 0) {
            p[0] = {
                x: pts[0].x,
                y: pts[0].y
            }
        }
        if (i === iLen - 2) {
            p[3] = {
                x: pts[iLen - 2].x,
                y: pts[iLen - 2].y
            };
        }
        if (i === iLen - 1) {
            p[2] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
            p[3] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
        }
        var val = 6;
        cubics.push([
            (-p[0].x + val * p[1].x + p[2].x) / val,
            (-p[0].y + val * p[1].y + p[2].y) / val,
            (p[1].x + val * p[2].x - p[3].x) / val,
            (p[1].y + val * p[2].y - p[3].y) / val,
            p[2].x,
            p[2].y
        ]);
    }
    return cubics;
}

function mapPointsArray2ObjectXY(points) {
    return points.map(function(point) {
        return {
            x: point[0],
            y: point[1]
        };
    });
}