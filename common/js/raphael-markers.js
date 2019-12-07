/**
 * Created by zwt on 2017/6/23 0023.
 */


/**
 *Script: raphael-markers.js
 *Description: Plugins that adds new drawable objects
 *Autor: Tomas Kocan
 *email: info@sewio.net
 *date: 27.3.2015
 */

(function (Raphael) {
    Raphael.fn.Ruler = function (x, y, length, scale) {
        var ruler = {};
        var rulerString = "";
        var rulertext = "";
        var stroke_w = 1;
        if (scale < 10) {
            rulerString = "M6.63,21.796l-5.122,5.121h25.743V1.175L6.63,21.796zM18.702,10.48c0.186-0.183,0.48-0.183,0.664,0l1.16,1.159c0.184,0.183,0.186,0.48,0.002,0.663c-0.092,0.091-0.213,0.137-0.332,0.137c-0.121,0-0.24-0.046-0.33-0.137l-1.164-1.159C18.519,10.96,18.519,10.664,18.702,10.48zM17.101,12.084c0.184-0.183,0.48-0.183,0.662,0l2.156,2.154c0.184,0.183,0.184,0.48,0.002,0.661c-0.092,0.092-0.213,0.139-0.334,0.139s-0.24-0.046-0.33-0.137l-2.156-2.154C16.917,12.564,16.917,12.267,17.101,12.084zM15.497,13.685c0.184-0.183,0.48-0.183,0.664,0l1.16,1.161c0.184,0.183,0.182,0.48-0.002,0.663c-0.092,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.24-0.046-0.332-0.138l-1.16-1.16C15.314,14.166,15.314,13.868,15.497,13.685zM13.896,15.288c0.184-0.183,0.48-0.181,0.664,0.002l1.158,1.159c0.183,0.184,0.183,0.48,0,0.663c-0.092,0.092-0.212,0.138-0.332,0.138c-0.119,0-0.24-0.046-0.332-0.138l-1.158-1.161C13.713,15.767,13.713,15.471,13.896,15.288zM12.293,16.892c0.183-0.184,0.479-0.184,0.663,0l2.154,2.153c0.184,0.184,0.184,0.481,0,0.665c-0.092,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.242-0.046-0.334-0.138l-2.153-2.155C12.11,17.371,12.11,17.075,12.293,16.892zM10.302,24.515c-0.091,0.093-0.212,0.139-0.332,0.139c-0.119,0-0.238-0.045-0.33-0.137l-2.154-2.153c-0.184-0.183-0.184-0.479,0-0.663s0.479-0.184,0.662,0l2.154,2.153C10.485,24.036,10.485,24.332,10.302,24.515zM10.912,21.918c-0.093,0.093-0.214,0.139-0.333,0.139c-0.12,0-0.24-0.045-0.33-0.137l-1.162-1.161c-0.184-0.183-0.184-0.479,0-0.66c0.184-0.185,0.48-0.187,0.664-0.003l1.161,1.162C11.095,21.438,11.095,21.735,10.912,21.918zM12.513,20.316c-0.092,0.092-0.211,0.138-0.332,0.138c-0.119,0-0.239-0.046-0.331-0.138l-1.159-1.16c-0.184-0.184-0.184-0.48,0-0.664s0.48-0.182,0.663,0.002l1.159,1.161C12.696,19.838,12.696,20.135,12.513,20.316zM22.25,21.917h-8.67l8.67-8.67V21.917zM22.13,10.7c-0.09,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.242-0.046-0.334-0.138l-1.16-1.159c-0.184-0.183-0.184-0.479,0-0.663c0.182-0.183,0.479-0.183,0.662,0l1.16,1.159C22.312,10.221,22.313,10.517,22.13,10.7zM24.726,10.092c-0.092,0.092-0.213,0.137-0.332,0.137s-0.24-0.045-0.33-0.137l-2.154-2.154c-0.184-0.183-0.184-0.481,0-0.664s0.482-0.181,0.664,0.002l2.154,2.154C24.911,9.613,24.909,9.91,24.726,10.092z";
            rulertext = "1px=" + (1 / scale).toFixed(1) + "m";
            stroke_w = 1;
        } else {
            rulerString = "M0,0 L10,0 L10,10";
            for (var i = 1; i <= scale / 10; i++) {
                rulerString += "M 5," + (i * 10) + " L10," + (i * 10);
                if (i !== scale / 10)
                    rulerString += "L10," + (i * 10 + 10);
            }
            rulerString += "M0," + scale + "L10," + scale;
            rulertext = "1m";
            stroke_w = 3;
        }


        ruler.rulerObj = this.path(rulerString).attr({ stroke: '#c68791', "stroke-width": stroke_w });

        ruler.textObj = this.text(ruler.rulerObj.getBBox().width, ruler.rulerObj.getBBox().height / 2, rulertext).attr({ 'text-anchor': 'start' });
        ruler.entireSet = this.set(ruler.rulerObj, ruler.textObj);

        ruler.entireSet.transform("...T" + x + "," + y);

        ruler.refresh = function (scale) {
            var rulerString = "";
            var rulertext = "";
            var height = scale < 10 ? 50 : scale;
            if (scale < 10) {
                rulerString = "M6.63,21.796l-5.122,5.121h25.743V1.175L6.63,21.796zM18.702,10.48c0.186-0.183,0.48-0.183,0.664,0l1.16,1.159c0.184,0.183,0.186,0.48,0.002,0.663c-0.092,0.091-0.213,0.137-0.332,0.137c-0.121,0-0.24-0.046-0.33-0.137l-1.164-1.159C18.519,10.96,18.519,10.664,18.702,10.48zM17.101,12.084c0.184-0.183,0.48-0.183,0.662,0l2.156,2.154c0.184,0.183,0.184,0.48,0.002,0.661c-0.092,0.092-0.213,0.139-0.334,0.139s-0.24-0.046-0.33-0.137l-2.156-2.154C16.917,12.564,16.917,12.267,17.101,12.084zM15.497,13.685c0.184-0.183,0.48-0.183,0.664,0l1.16,1.161c0.184,0.183,0.182,0.48-0.002,0.663c-0.092,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.24-0.046-0.332-0.138l-1.16-1.16C15.314,14.166,15.314,13.868,15.497,13.685zM13.896,15.288c0.184-0.183,0.48-0.181,0.664,0.002l1.158,1.159c0.183,0.184,0.183,0.48,0,0.663c-0.092,0.092-0.212,0.138-0.332,0.138c-0.119,0-0.24-0.046-0.332-0.138l-1.158-1.161C13.713,15.767,13.713,15.471,13.896,15.288zM12.293,16.892c0.183-0.184,0.479-0.184,0.663,0l2.154,2.153c0.184,0.184,0.184,0.481,0,0.665c-0.092,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.242-0.046-0.334-0.138l-2.153-2.155C12.11,17.371,12.11,17.075,12.293,16.892zM10.302,24.515c-0.091,0.093-0.212,0.139-0.332,0.139c-0.119,0-0.238-0.045-0.33-0.137l-2.154-2.153c-0.184-0.183-0.184-0.479,0-0.663s0.479-0.184,0.662,0l2.154,2.153C10.485,24.036,10.485,24.332,10.302,24.515zM10.912,21.918c-0.093,0.093-0.214,0.139-0.333,0.139c-0.12,0-0.24-0.045-0.33-0.137l-1.162-1.161c-0.184-0.183-0.184-0.479,0-0.66c0.184-0.185,0.48-0.187,0.664-0.003l1.161,1.162C11.095,21.438,11.095,21.735,10.912,21.918zM12.513,20.316c-0.092,0.092-0.211,0.138-0.332,0.138c-0.119,0-0.239-0.046-0.331-0.138l-1.159-1.16c-0.184-0.184-0.184-0.48,0-0.664s0.48-0.182,0.663,0.002l1.159,1.161C12.696,19.838,12.696,20.135,12.513,20.316zM22.25,21.917h-8.67l8.67-8.67V21.917zM22.13,10.7c-0.09,0.092-0.211,0.138-0.33,0.138c-0.121,0-0.242-0.046-0.334-0.138l-1.16-1.159c-0.184-0.183-0.184-0.479,0-0.663c0.182-0.183,0.479-0.183,0.662,0l1.16,1.159C22.312,10.221,22.313,10.517,22.13,10.7zM24.726,10.092c-0.092,0.092-0.213,0.137-0.332,0.137s-0.24-0.045-0.33-0.137l-2.154-2.154c-0.184-0.183-0.184-0.481,0-0.664s0.482-0.181,0.664,0.002l2.154,2.154C24.911,9.613,24.909,9.91,24.726,10.092z";
                rulertext = "1px=" + (1 / scale).toFixed(1) + "m";
                this.rulerObj.attr({ "stroke-width": 1 });
            } else {
                rulerString = "M0,0 L10,0 L10,10";
                for (var i = 1; i <= scale / 10; i++) {
                    rulerString += "M 5," + (i * 10) + " L10," + (i * 10);
                    //     if ((i+1) < scale / 10)
                    //        rulerString += "L10," + (i * 10 + 10);
                }
                rulerString += "M0," + scale + "L10," + scale;
                rulerString += "M10,0 L10," + scale;
                rulertext = "1m";
            }
            this.rulerObj.attr("path", rulerString);
            this.textObj.attr('text', rulertext);
            this.textObj.attr('x', this.rulerObj.getBBox().width, this.rulerObj.getBBox().height / 2);
            this.textObj.attr('y', this.rulerObj.getBBox().height / 2);
            return height;
            //  this.entireSet = this.set(ruler.rulerObj, ruler.textObj);
        };

        ruler.hide = function () {
            this.rulerObj.hide();
            this.textObj.hide();
        };
        ruler.show = function () {
            this.rulerObj.show();
            this.textObj.show();
        };
        return ruler;
    };

    Raphael.fn.Grid = function (w, h, offsetx, offsety, scale) {
        var grid = [];
        for (var i = 0; i < w / scale; i++) { //vertical lines
            grid.push(this.path("M" + (i * scale + offsetx) + "," + offsety + "L" + (i * scale + offsetx) + "," + (offsety + h)).attr({ 'stroke-dasharray': "-", "stroke": "#A9A9A9" }));
        }
        for (var i = 0; i < h / scale; i++) { //horizontal lines
            grid.push(this.path("M" + offsetx + "," + (i * scale + offsety) + "L" + (offsetx + w) + "," + (i * scale + offsety)).attr({ 'stroke-dasharray': "-", "stroke": "#A9A9A9" }));
        }
        return grid;
    };

    Raphael.fn.Fence = function (polygonPoints, color, opacity) {
        var fence = {};
        var vertices = [];
        var polystring = "M ";

        for (var p = 0; p < polygonPoints.length - 1; p++) {
            polystring += polygonPoints[p].x + " " + polygonPoints[p].y + " L " + polygonPoints[p + 1].x + " " + polygonPoints[p + 1].y + " ";
        }
        polystring += " Z";
        fence.fillareaObj = this.path(polystring).attr({ 'fill': color, "stroke": color, "fill-opacity": opacity, 'stroke-dasharray': "--","stroke-width": "1" });

        fence.entireSet = this.set(fence.fillareaObj);

        fence.set = function (attr, value) {
            if (attr == "color") {
                this.fillareaObj.attr({ 'fill': value, "stroke": value });
            }
            if (attr == "opacity") {
                this.fillareaObj.attr({ 'fill-opacity': value });
            }
        };

        return fence;
    };


    Raphael.fn.AxisMarker = function (originX, originY) {
        var am = {};
        am.x = originX;
        am.y = originY;

        am.pathObj = this.path("M25.545,23.328,17.918,15.623,25.534,8.007,27.391,9.864,29.649,1.436,21.222,3.694,23.058,\
                                5.53,15.455,13.134,7.942,5.543,9.809,3.696,1.393,1.394,3.608,9.833,5.456,8.005,12.98,\
                                15.608,5.465,23.123,3.609,21.268,1.351,29.695,9.779,27.438,7.941,25.6,15.443,18.098,\
                                23.057,25.791,21.19,27.638,29.606,29.939,27.393,21.5z").attr({ fill: "#cbcbcb", stroke: "#000" });
        am.entireSet = this.set(am.pathObj);
        var transx = (am.x - am.pathObj.getBBox().width / 2);
        var transy = (am.y - am.pathObj.getBBox().height / 2);
        am.entireSet.transform("T" + transx + "," + transy + "r45S0.5,0.5,0,0");
        // am.entireSet.transform('S0.5,0.5,0,0');

        am.move = function (newx, newy) {
            var transx = (newx);
            this.x = newx;
            this.y = newy;
            var transy = (newy);
            this.entireSet.transform("...T" + transx + "," + transy);

        };
        return am;
    };

    Raphael.fn.clipPolygonMarker = function (x, y) {
        var cpm = {};
        cpm.circleObj = this.circle(x, y, 5);
        cpm.circleObj.attr({
            "fill": "90-#2f6d22:55-#fff:45",
            "fill-opacity": 0.5
        });
        cpm.entireSet = this.set(cpm.circleObj);
        cpm.refresh = function (x, y) {
            this.circleObj.attr({ "cx": x, "cy": y });
        };
        cpm.delete = function () {
            this.entireSet.remove();
        };
        return cpm;
    };

    Raphael.fn.drawLine = function (x1, y1, x2, y2, color, savedInDB) {
        var dynamicline = {};
        dynamicline.x1 = x1;
        dynamicline.x2 = x2;

        dynamicline.y1 = y1;
        dynamicline.y2 = y2;

        dynamicline.lineObj = this.path("M" + x1 + "," + y1 + "L" + x2 + "," + y2);
        if (color === undefined) {
            color = "#2f5c69";
        }
        if (savedInDB) {
            dynamicline.lineObj.attr({ 'stroke-dasharray': "0" });
            dynamicline.lineObj.attr("stroke-width", "2");
            dynamicline.lineObj.attr("stroke", color);
        } else {
            dynamicline.lineObj.attr({ 'stroke-dasharray': "-" });
        }


        dynamicline.circleObj = this.circle(x2, y2, 1);
        dynamicline.circleObj.attr({
            "fill": color,
            "fill-opacity": 1,
            "stroke-width": 0
        });

        dynamicline.entireSet = this.set(dynamicline.circleObj, dynamicline.lineObj);


        dynamicline.refresh = function (x2, y2) {
            this.lineObj.attr({ 'path': "M" + this.x1 + "," + this.y1 + "L" + x2 + "," + y2 });
        };
        dynamicline.setFullLine = function (color) {

            dynamicline.lineObj.attr({ 'stroke-dasharray': "0" });
            dynamicline.lineObj.attr("stroke-width", "2");
            dynamicline.lineObj.attr("stroke", color);



        };
        dynamicline.setColor = function (color) {

            dynamicline.circleObj.attr({ 'fill': color });
            dynamicline.lineObj.attr({ 'stroke-dasharray': "0" });
            dynamicline.lineObj.attr("stroke-width", "2");
            dynamicline.lineObj.attr("stroke", color);
        };
        return dynamicline;
    };

    Raphael.fn.drawLineWOcircle = function (x1, y1, x2, y2) {
        var dynamicline = {};
        dynamicline.x1 = x1;
        dynamicline.x2 = x2;

        dynamicline.y1 = y1;
        dynamicline.y2 = y2;


        dynamicline.lineObj = this.path("M" + x1 + "," + y1 + "L" + x2 + "," + y2);

        dynamicline.lineObj.attr({ 'stroke-dasharray': "-" });


        dynamicline.entireSet = this.set(dynamicline.lineObj);


        dynamicline.refresh = function (x2, y2) {
            this.lineObj.attr({ 'path': "M" + this.x1 + "," + this.y1 + "L" + x2 + "," + y2 });
        };
        dynamicline.setFullLine = function () {
            dynamicline.lineObj.attr({ 'stroke-dasharray': "" });

        };
        return dynamicline;
    };


    Raphael.fn.myMarker = function (x, y, radius, txt, id, type) {
        var characterLength;
        var marker = {};
        txt = " " + txt;
        var boxWidth = txt.width() + 8; //width of title + some space
        var boxHeight = txt.height();

        marker.statistics = { 'distancePassed': 0, 'startTime': -1, 'lastTime': 0, 'avgSpeed': 0, 'maxSpeed': 0 };
        marker.id = id;
        marker.x = (x * this.scale + parseFloat(this.originX));//*(1-vsn.panZoom.getCurrentZoom()/10);
        marker.y = (y * this.scale + parseFloat(this.originY));// * (1 - vsn.panZoom.getCurrentZoom() / 10);
        marker.counter = 0;
        marker.noscaleX = x;//real meters
        marker.noscaleY = y;
        marker.hidden = false;
        marker.radius = radius;
        marker.txt = txt;
        marker.type = type;
        marker.clr = 0;

        marker.trackedMarkers = [];
        marker.fences = {};
        marker.xvalues = [];
        marker.yvalues = [];
        marker.clrObj = this.circle(0, 0, 0).attr({
            "fill": "#bedfbf",
            "stroke": "#a4c0a5",
            "stroke-width": "1",
            "opacity": 0.6
        });
        marker.userButtonObj = this.circle(0, 0, 0).attr({
            "fill": "#ce7979",
            "stroke": "#a4c0a5",
            "stroke-width": "0.8",
            "opacity": 0.6

        });
        marker.rectObj = this.rect(-2 - boxWidth / 2 + 3, 5, boxWidth, boxHeight, 0).attr({
            "fill": "#eeecec",
            "fill-opacity": 1,
            "stroke": "#c1c1c1"
        });
        //   marker.rectObj.transform("T" + (marker.x-2 - boxWidth / 2) + "," + (marker.y + radius)); //-2.. leave a little space between rect border and text

        // marker.textObj = this.text(marker.x - boxWidth / 2, +marker.y + 13, marker.txt).attr({ 'text-anchor': 'start' });
        marker.textObj = this.text(-boxWidth / 2 + 4, boxHeight + 2, marker.txt).attr({ 'text-anchor': 'start' });
        //    marker.textObj.transform("T" + (marker.x - boxWidth / 2) + "," + (marker.y + 18));

        //bugfix for raphael library...  Source: https://github.com/DmitryBaranovskiy/raphael/issues/491
        $('tspan', marker.textObj.node).attr('dy', 0);



        marker.circleObj = this.path("M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,\
11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,\
19.584,11S17.979,14.584,16,14.584z");
        if (type == "tag") {
            marker.circleObj.attr({ fill: "#3c72df", stroke: "#c68791" });
        } else {
            marker.circleObj.attr({ fill: "#08762a", stroke: "#c68791" });

        }
        marker.circleObj.attr({ pathXY: [-marker.circleObj.getBBox().width / 2 + 8, -marker.circleObj.getBBox().height] });

        marker.circleObj.feedID = id;
        marker.circleObj.feedType = type;

        //     marker.circleObj.transform("T" + (marker.x - marker.circleObj.getBBox().width) + "," + (marker.y - marker.circleObj.getBBox().height));


        //      marker.entireSet.draggable(id);
        marker.set = function (arg, value) {
            var LFcount = value.split('\n').length - 1; //3
            var maxLine = "";
            var currentLine = "";
            for (var c = 0; c < value.length; c++) {
                currentLine = currentLine + value.charAt(c);
                //   console.log(value[c]);
                if (value.charAt(c) == '\n') {
                    if (currentLine.length > maxLine.length)
                        maxLine = currentLine;
                    currentLine = "";
                }
            }
            if (arg == "type") {
                if (value == "tag") {
                    this.circleObj.attr({ fill: "#3c72df", stroke: "#c68791" });

                }
                if (value == "anchor") {
                    this.circleObj.attr({ fill: "#08762a", stroke: "#c68791" });

                }
            }


            if (arg == "labelContent") {
                this.textObj.attr('text', value);
                var boxWidth = value.width() + 8; //width of title + some space
                var boxHeight = value.height();
                this.rectObj.attr("width", boxWidth);
                this.rectObj.attr("x", -boxWidth / 2);
                this.textObj.attr("x", -boxWidth / 2 + 4);
                $('tspan', this.textObj.node).attr('dy', 0);


            }
            var adaptedRectSize = maxLine.width() + 5;

        };

        marker.changeClr = function (radius, time) {
            this.clr = radius;
            this.clrObj.animate({
                r: radius
            }, time / 2);
        };

        marker.animateUserButton = function () {
            var self = this;
            this.userButtonObj.animate({
                r: 25
            }, 500 ,"backOut",function(){
                self.userButtonObj.animate({r:0},500,"backIn");
            });
        };

        marker.get = function (arg, value) {
            if (arg == "labelContent") {

                return this.textObj.attr('text');
            }
        };

        marker.isVisible = function () {
            var pos = IndoorSensmap.getPanzoomPos();
            var zoom = IndoorSensmap.getPanZoom();
            var leftTopX = pos.x * zoom;
            var leftTopY = pos.y * zoom;
            var rightBottomX = pos.x + $("#paper").width() * zoom;
            var rightBottomY = pos.y + $("#paper").height() * zoom;
            if (!marker.hidden && marker.x < rightBottomX && marker.y < rightBottomY && marker.x > leftTopX && marker.y > leftTopY) {
                return true;
            } else {
                return false;
            }
        };

        onmove = function (dx, dy) {
            if ((this.myset[0].feedType == "anchor" && !IndoorSensmap.getAnchorLock()) || (this.myset[0].feedType == "tag" && !IndoorSensmap.getTagLock())) {
                var zoom = IndoorSensmap.getPanZoom();
                this.myset[0].transform(this.myset[0].default_transform + 'T' + dx * zoom + ',' + (dy) * zoom);
                this.myset[1].transform(this.myset[1].default_transform + 'T' + dx * zoom + ',' + (dy) * zoom);
                this.myset[2].transform(this.myset[2].default_transform + 'T' + dx * zoom + ',' + (dy) * zoom);
            }

        },


            onstart = function (x, y) {
                if ((this.myset[0].feedType == "anchor" && !IndoorSensmap.getAnchorLock()) || (this.myset[0].feedType == "tag" && !IndoorSensmap.getTagLock())) {
                    IndoorSensmap.disablePanZoom();
                    this.myset[0].default_transform = this.myset[0].transform();
                    this.myset[1].default_transform = this.myset[1].transform();
                    this.myset[2].default_transform = this.myset[2].transform();

                }
            };
        onend = function (e) {
            /*   if ((this.myset[0].feedType == "anchor" && !IndoorSensmap.getAnchorLock()) || (this.myset[0].feedType == "tag" && !IndoorSensmap.getTagLock())) {
             IndoorSensmap.enablePanZoom();
             this.myset[0].default_transform = this.myset[0].transform();
             this.myset[1].default_transform = this.myset[1].transform();
             this.myset[2].default_transform = this.myset[2].transform();

             IndoorSensmap.saveDraggedPosition(this.myset[0].feedID, this.myset[0].default_transform); //could be also 1,2 (doesnt matter), contains an array of transformations in pixels
             }*/

            if ((this.myset[0].feedType == "anchor" && !IndoorSensmap.getAnchorLock()) || (this.myset[0].feedType == "tag" && !IndoorSensmap.getTagLock())) {
                //      console.log("kurzorove x,y?", e.clientX, e.clientY);
                IndoorSensmap.enablePanZoom();
                this.myset[0].default_transform = this.myset[0].transform();
                this.myset[1].default_transform = this.myset[1].transform();
                this.myset[2].default_transform = this.myset[2].transform();
                //     $('body').css('cursor', 'default');

                if ("transform" == "cursor") {
                    IndoorSensmap.saveDraggedPosition(this.myset[0].feedID, e.clientX, e.clientY); //could be also 1,2 (doesnt matter), contains an array of transformations in pixels
                } else {
                    IndoorSensmap.saveDraggedPosition(this.myset[0].feedID, this.myset[0].default_transform); //could be also 1,2 (doesnt matter), contains an array of transformations in pixels

                }
            }

        };
        //   marker.entireSet = this.set(marker.circleObj, marker.rectObj, marker.textObj);
        marker.entireSet = this.set();
        marker.entireSet.push(marker.circleObj);
        marker.entireSet.push(marker.rectObj);
        marker.entireSet.push(marker.textObj);
        marker.entireSet.push(marker.userButtonObj);
        marker.entireSet.push(marker.clrObj);

        marker.circleObj.myset = marker.entireSet;
        marker.textObj.myset = marker.entireSet;
        marker.rectObj.myset = marker.entireSet;
        marker.clrObj.myset = marker.entireSet;
        marker.userButtonObj.myset = marker.entireSet;

        marker.entireSet.transform("T" + marker.x + "," + marker.y);
        if (type == "anchor" || type == "tag") { //only anchors and tags are draggable

            marker.entireSet.drag(onmove, onstart, onend);

            marker.entireSet.mouseover(function () {
                $('body').css('cursor', 'pointer');
            });

            marker.entireSet.mouseout(function () {

                $('body').css('cursor', 'default');
            });

        }

        return marker;
    };



    Raphael.fn.nodeList = function () {
        this.nodes = [];
        this.push = function (p) {
            return this.nodes.push(p);
        };

        //  this.nextNode = function(){
        // ... manipulate this.nodes here
        // }
        //  this.previousNode = function(){
        // ...
        //  }
        return this;
    };

    String.prototype.width = function (font) {
        var f = font || '12px arial',
            o = $('<div>' + this + '</div>')
                .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
                .appendTo($('body')),
            w = o.width();

        o.remove();

        return w;
    };

    String.prototype.height = function (font) {
        var f = font || '12px arial',
            o = $('<div>' + this + '</div>')
                .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
                .appendTo($('body')),
            h = o.height();

        o.remove();

        return h;
    };



    Raphael.fn.trackMarker = function (x, y, x2, y2, radius, id) {
        var characterLength;
        var tm = {};
        tm.id = id;
        tm.x = x;
        tm.y = y;
        tm.x2 = x2;
        tm.y2 = y2;
        tm.radius = radius;


        tm.circleObj = this.circle(tm.x, tm.y, radius);
        tm.circleObj.attr({
            "fill": "#c55a5a",
            "fill-opacity": 0.3
        });
        tm.circleObj.attr("stroke", "#fff");

        // this.entireSet.draggable();
        //this.lineObj = this.path("M" + x + "," + y + " L" + x2 + "," + y2);
        tm.lineObj = this.arrow(x, y, x2, y2, 5).attr({ stroke: "#000" });
        tm.entireSet = this.set(tm.circleObj, tm.lineObj);

        // console.log(this);
        return tm;
    };

    Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
        var angle = Raphael.angle(x1, y1, x2, y2);
        var a45 = Raphael.rad(angle - 45);
        var a45m = Raphael.rad(angle + 45);
        var a135 = Raphael.rad(angle - 135);
        var a135m = Raphael.rad(angle + 135);
        var x1a = x1 + Math.cos(a135) * size;
        var y1a = y1 + Math.sin(a135) * size;
        var x1b = x1 + Math.cos(a135m) * size;
        var y1b = y1 + Math.sin(a135m) * size;
        var x2a = x2 + Math.cos(a45) * size;
        var y2a = y2 + Math.sin(a45) * size;
        var x2b = x2 + Math.cos(a45m) * size;
        var y2b = y2 + Math.sin(a45m) * size;
        return this.path(
            //  "M" + x1 + " " + y1 + "L" + x1a + " " + y1a +
            //  "M" + x1 + " " + y1 + "L" + x1b + " " + y1b +
            "M" + x1 + " " + y1 + "L" + x2 + " " + y2 +
            "M" + x2 + " " + y2 + "L" + x2a + " " + y2a +
            "M" + x2 + " " + y2 + "L" + x2b + " " + y2b
        );
    };




    Raphael.fn.scaleStartMarker = function (x, y, id) {
        var ssm = {};
        var paper = this;
        ssm.pathObj = this.path("M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z").attr({ fill: "#0f0", stroke: "none" });
        //mm.txt = id;
        ssm.x = (x);
        ssm.y = (y);
        //var boxWidth = mm.txt.width() + 5; //width of title + some space

        // mm.textObj = this.text(5, -2, mm.txt).attr({ 'text-anchor': 'start' });
        ssm.entireSet = this.set(ssm.pathObj);
        var transx = (x - ssm.pathObj.getBBox().width); // - ...width because we want cross to be where user clicked
        var transy = (y - ssm.pathObj.getBBox().height);
        ssm.entireSet.transform("T" + transx + "," + transy);
        return (ssm);
    };


    Raphael.fn.measureMarker = function (x, y, id) {
        var mm = {};
        var paper = this;
        mm.pathObj = this.path("M25.083,18.895l-8.428-2.259l2.258,8.428l1.838-1.837l7.053,7.053l2.476-2.476l-7.053-7.053L25.083,18.895zM5.542,11.731l8.428,2.258l-2.258-8.428L9.874,7.398L3.196,0.72L0.72,3.196l6.678,6.678L5.542,11.731zM7.589,20.935l-6.87,6.869l2.476,2.476l6.869-6.869l1.858,1.857l2.258-8.428l-8.428,2.258L7.589,20.935zM23.412,10.064l6.867-6.87l-2.476-2.476l-6.868,6.869l-1.856-1.856l-2.258,8.428l8.428-2.259L23.412,10.064z").attr({ fill: "#000", stroke: "none" });
        mm.txt = id;
        mm.x = (x);
        mm.y = (y);
        var boxWidth = mm.txt.width() + 5; //width of title + some space

        mm.textObj = this.text(5, -2, mm.txt).attr({ 'text-anchor': 'start' });
        mm.entireSet = this.set(mm.pathObj, mm.textObj);
        var transx = (x - mm.pathObj.getBBox().width / 2);
        var transy = (y - mm.pathObj.getBBox().height / 2);
        mm.entireSet.transform("T" + transx + "," + transy);
        return (mm);
    };

    Raphael.st.pathXY = function (xy) {
        // pass 'x' or 'y' to get average x or y pos of set
        // pass nothing to initiate set for pathXY animation
        // recursive to work for sets, sets of sets, etc
        var sum = 0, counter = 0;
        this.forEach(function (element) {
            var position = (element.pathXY(xy));
            if (position) {
                sum += parseFloat(position);
                counter++;
            }
        });
        return (sum / counter);
    };
    Raphael.el.pathXY = function (xy) {
        // pass 'x' or 'y' to get x or y pos of element
        // pass nothing to initiate element for pathXY animation
        // can use in same way for elements and sets alike
        if (xy == 'x' || xy == 'y') { // to get x or y of path
            xy = (xy == 'x') ? 1 : 2;
            var pathPos = Raphael.parsePathString(this.attr('path'))[0][xy];
            return pathPos;
        } else { // to initialise a path's pathXY, for animation
            this.attr({ pathXY: [this.pathXY('x'), this.pathXY('y')] });
        }
    };


    /// Plugin - replaces original RaphaelJS .image constructor
    /// with one that respects original dimensions.
    /// Optional overrides for each dimension.
    /// @drzaus @zaus
    /// based on http://stackoverflow.com/questions/10802702/raphael-js-image-with-its-original-width-and-height-size
    /// modified 13/08/2013 by @Huniku to support asynchronous loads
    /// modified 15/02/2015 by Tomas Kocan  to support multiple resolutions and keep scale
    var originalRaphaelImageFn = Raphael.fn.image;

    Raphael.fn.imageAsyncx = function (url, x, y, width, height, w, h) {
        var dfd = new jQuery.Deferred();

        var done = false;
        var paper = this;
        // fix the image dimensions to match original scale unless otherwise provided
        if (!width || !height) {
            //Create the new image and set the onload event to call
            //the original paper.image function with the desired dimensions
            var img = new Image();
            img.onload = function () {
                if (done)
                    return;
                if (!width) width = img.width;
                if (!height) height = img.height;

                var divscalew = (width / w);
                var divscaleh = height / divscalew;
                var divscale2h = (height / h);
                var divscale2w = width / divscale2h;



                if (divscaleh <= h) { //4:3
                    //    paper.imagescale = divscalew;
                    dfd.resolve(originalRaphaelImageFn.call(paper, url, 0, 0, w, divscaleh),divscalew);
                }
                else { //16:9
                    //     paper.imagescale = divscale2h;
                    dfd.resolve(originalRaphaelImageFn.call(paper, url, 0, 0, divscale2w, h),divscale2h);
                }

            };
            //Begin loading of the image
            img.src = url;

            //If the images is already loaded (i.e. it was in the local cache)
            //img.onload will not fire, so call paper.image here.
            //Set done to ensure img.onload does not fire.
            if (img.width != 0) {
                if (!width) width = img.width;
                if (!height) height = img.height;
                done = true;
                //  dfd.resolve(originalRaphaelImageFn.call(paper, url, x, y, w, h));
                var divscalew = (width / w); //*0.9//0.9 because of initial zoom, which is 10%
                var divscaleh = height / divscalew;
                var divscale2h = (height / h); //0.9 * //0.9 because of initial zoom, which is 10%
                var divscale2w = width / divscale2h;



                if (divscaleh <= h) { //4:3 //0.9 * //0.9 because of initial zoom, which is 10%
                    //   var c = this.image(imgpath, 0, 0, w, divscaleh);
                    //    paper.imagescale = divscalew;
                    dfd.resolve(originalRaphaelImageFn.call(paper, url, 0, 0, w, divscaleh),divscalew);
                }
                else { //16:9

                    //    paper.imagescale = divscale2h;
                    //   var c = this.image(imgpath, 0, 0, divscale2w, h);
                    dfd.resolve(originalRaphaelImageFn.call(paper, url, 0, 0, divscale2w, h),divscale2h);
                }
            }
        }
        else
            dfd.resolve(originalRaphaelImageFn.call(paper, url, x, y, width, height));
        return dfd.promise();
    };


})(Raphael);
