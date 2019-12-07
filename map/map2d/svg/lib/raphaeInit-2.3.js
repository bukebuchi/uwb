function raphaelInit() {

    var config = {
        width: 19030,
        height: 12200,
        id: 'mapSvg',
        bg: '../common/img/1.png',
        duration: 400,
        // log: 1, // draw marker move line
        len: 0, // how much point to log
        markerEnable: true // tags are visible
    };

    function UbiMap(options) {
        //生成画布
        paper = Raphael(options.id, options.width, options.height);
        // var scaleIcon = Raphael("toppaper", 80, 50);

        //背景TODO
        var bg;
        var tagMarker = {};
        var anchorMarker = {};
        var camera={};
        var allMarker = {};
        var hisMarker = {};

        window.allMarker = allMarker;

        var lastZoom = 1;

        this.interimMarker = null;
        this.interimHisMarker = null;

        this.len = options.len || 0;
        this.duration = options.duration || 400;

        this.audio = new Audio();

        this.moveEle = null;
        this.lockTag = false;
        this.lockAnchor = false;

        this.pan = paper.panzoom({ initialZoom: 0, initialPosition: { x: 0, y: 0 }, repaintHook: remarkStayInitSize });

        this.screenLength = document.documentElement.clientWidth;

        // this.a, this.b, this.c, this.j, this.k, this.d = {},
        //     this.e = {},
        //     this.func = "", //在canvas  onclick中需要判断用哪个方法
        //     this.i = "",
        //     this.p = [], //多边形顶点
        //     this.q = [],
        //     this.r = !1,
        //     this.s = 0;

        var a = paper,
            b,
            c = this.pan,
            j,
            k,
            d = {},
            e = {},
            func = "",
            el='',   //element 绘制摄像头或围栏
            callback = "",
            i = "",
            p = [],
            q = [],

            //测量距离对象
            distance = {};
        r = !1, s = 0, t = {};

        function remarkStayInitSize(currAbsolteZoom) {}
        // console.log(currAbsolteZoom);
        // // debugger;
        // var curr =currAbsolteZoom/lastZoom;
        // console.log(lastZoom);
        // console.log(curr);

        // for(var i in allMarker){
        //     var item=allMarker[i];
        //     item.scale(curr).attr({'stroke-width':currAbsolteZoom});
        //     // console.log(currAbsolteZoom)
        //     var textY=23.6-item[0].getBBox().height/curr-(14.2-item[1].getBBox().height/curr)/2;
        //     var textX=(item[1].getBBox().width-item[1].getBBox().width/curr)/2+(23.6-15.64)/2-(item[0].getBBox().width/curr-item[1].getBBox().width/curr)/2;
        //     var textFrameY=23.6-item[0].getBBox().height/curr-(18.6-item[2].getBBox().height/curr)/2;
        //     var textFrameX=(item[2].getBBox().width-item[2].getBBox().width/curr)/2+(23.6-19.46)/2-(item[0].getBBox().width/curr-item[2].getBBox().width/curr)/2;

        //     if(currAbsolteZoom<1){
        //         if(currAbsolteZoom<lastZoom){
        //             item[1].translate(-textX,-textY);
        //             item[2].translate(-textFrameX,-textFrameY);
        //         }else if(currAbsolteZoom>lastZoom){
        //             item[1].translate(textX,textY);
        //             item[2].translate(textFrameX,textFrameY);
        //         }
        //     }else if(currAbsolteZoom>1){

        //     }
        // }
        // // console.log(allMarker);
        // lastZoom=currAbsolteZoom;

        //弹出---暂时隐藏
        // function showPopUp(param,el, x, y) {
        //     if (el.popup) {
        //         if(parseInt(param.type) === 1){
        //             el.popup.set.attr({ x: x+16, y: y+24 }).show();
        //         }else{
        //             el.popup.set.attr({ x: x, y: y }).show();
        //         }
        //     } else {
        //         var rect = paper.rect(x, y, 140, 80, 4).attr(options.popupRectAttr);
        //         var text = paper.text(x, y, "Hello World").attr({ 'font-size': 12 }).transform(Raphael.matrix(1, 0, 0, 1, 40, 13).toTransformString());
        //         var set = paper.set();
        //         set.push(rect, text);
        //         el.popup = { rect: rect, text: text, set: set };
        //     }
        // }
        //轨迹
        this.drawLine2 = function(marker, logs ){
            // console.log(marker);
            var color = 'black';
            var node = marker.node;
            if(marker && marker.node && marker.node.cat &&  marker.node.cat.color){
                color = node.cat.color;
            }
            //debugger;
            if(!logs || logs.length < 1){
                return;
            }
            let path = toPath(logs);
            if (!marker.logPath || !marker.logPath.id) {
                // 初始化并隐藏
                marker.logPath = paper.path(path);

            } else {
                marker.logPath.attr('path', path);
            }
            marker.logPath.attr({ 'stroke': color });
        };
        this.drawLine = function (marker, logs ) {
            // console.log(marker);
            var color = 'black';
            var node = marker.node;
            if(marker && marker.node && marker.node.cat &&  marker.node.cat.color){
                color = node.cat.color;
            }
            //debugger;
            var str = [];
            if(!UBIT.enableDrawLine){
                logs.forEach(function (item, index) {
                    str.push(Raphael.fullfill("M{x},{y}", item));
                });
            }else{
                logs.forEach(function (item, index) {
                    if (index == 0) {
                        str.push(Raphael.fullfill("M{x},{y}", item));
                    } else {
                        str.push(Raphael.fullfill("L{x},{y}", item));
                    }
                });
            }

            if (!marker.logPath || !marker.logPath.id) {
                // 初始化并隐藏
                marker.logPath = paper.path(str.join(''));

            } else {
                marker.logPath.attr('path', str.join(''));
                // mark
                // er.logPath.hide();
            }
            marker.logPath.attr({ 'stroke': color });
        };





        this.findInMarker=function(marker,type){
            if(!type) return;
            for (var i = 0; i < marker.items.length; i++) {
                var item = marker.items[i];
                if (!item.flag || item.flag!= type) continue;
                return item;
            }
            return false;
        };


        this.clearLine=function(type,nowTime){
            if(!type) return; 
            // 清除连线
               for(var groupLine in paper){
                var item=paper[groupLine];
                if(item[type+'drawDataTime']){
                    if(nowTime-item[type+'drawDataTime']>=ME[type+'halosHideTime']){
                        item.remove();
                        // item.hide();
                    }
                }
            }
        },
        this.findInMarker=function(marker,type){
            if(!type) return;
            for (var i = 0; i < marker.items.length; i++) {
                var item = marker.items[i];
                if (!item.flag || item.flag!= type) continue;
                return item;
            }
            return false;
        },

            this.cleanMoreMonitorInMarker = function(marker){
                for (var i = 0; i < marker.items.length; i++) {
                    var item = marker.items[i];
                    if (!item.flag || item.flag!= 'moreMonitor') continue;
                    item.remove();
                    delete marker.items[i];
                    return item;
                }
                return true;
            },


//            根据多个点绘制直线,如果成员为三人则绘制三角形，否则绘制被监人到其余成员连线
        this.drawStrLine=function(type,points,keyName,strokeColor){
            if(!type) return;
            if(paper[keyName]){
                paper[keyName].remove();
            }

            if(points&&points.length>0){
               paper[keyName]=paper.set();
               var stokeC=strokeColor?strokeColor:'#db1b21';
               for(var i=0;i<points.length;i++){
                   var item=points[i];
                   //组内某成员无marker
                   if(item.length<2){continue}
                   var strLine=paper.path('M'+item[0].x+','+item[0].y+'L'+item[1].x+','+item[1].y);

                    //绘制距离值    
                    if(item[2]&&item[2].distance){
                        var font= item[2].distance+lang['m'];
                        var pos={
                            x:(parseFloat((item[0].x+item[1].x))/2)+10,
                            y:parseFloat((item[0].y+item[1].y))/2,
                        };
                        var attr={
                            'font-size':30,
                            'stroke':stokeC
                        }
                        var disFont=ubiMap.drawDisFont(font,pos,attr);
                        if(disFont){
                            paper[keyName].push(disFont); 
                        }
                    }

                   // strLine.attr({ 'stroke-dasharray': "-" });
                   strLine.attr({ 'stroke-dasharray': ".",stroke:stokeC,'stroke-width':3 });
                   paper[keyName].push(strLine);
               }
           //    三角形第三条边
                if(type=='moreMonitor'&&points.length==2){
                //   成员只有三个
                    var threeLine=paper.path('M'+points[0][1].x+','+points[0][1].y+'L'+points[1][1].x+','+points[1][1].y);
                    // strLine.attr({ 'stroke-dasharray': "-" });
                    threeLine.attr({ 'stroke-dasharray': ".",stroke:stokeC,'stroke-width':3 });
                    paper[keyName].push(threeLine);
                }
                paper[keyName][type+'drawDataTime']=new Date().getTime();
           }
            

        }
        this.drawDisFont=function(font,pos,attr){
            if(!font||!pos||!(pos instanceof Object)||!pos.hasOwnProperty('x')||!pos.hasOwnProperty('y')||
            !attr||!(attr instanceof Object)||JSON.stringify(attr)=='{}') return false;
            var disFont=paper.text(pos.x,pos.y,font).attr(attr);
            return disFont;

        }
        //右侧显示标签
        function toggleMarker(val, status) {
            for (var i in allMarker) {
                if (allMarker.hasOwnProperty(i)) {
                    if (allMarker[i].flag === val) {
                        ubiMap.toggleNode(i, status);
                    }
                }
            }
        }
        function toggleHisMarker(status) {
            for (var i in hisMarker) {
                if (hisMarker.hasOwnProperty(i)) {
                    if (status) {
                        hisMarker[i].show();
                    } else {
                        hisMarker[i].hide();
                    }
                }
            }
        }

        this.toggleNode = function (id, status) {
            if (allMarker[id]) {
                if(status){
                    if(allMarker[id].node && !allMarker[id].node.isShow){
                        return;
                    }
                    allMarker[id].show();
                    //电量显示控制
                    if(id.indexOf('tag')>-1){
                        MarkerTool.hidePower(allMarker[id], ME.vm.isShowTagPower(allMarker[id].node.powerLevel, allMarker[id].node.isShow))
                    }
                }else {
                    allMarker[id].hide();
                    if(id.indexOf('tag')>-1) {
                        this.drawLine(allMarker[id], []);
                        // 隐藏心跳图标
                        var markerHeart=ubiMap.findInMarker(allMarker[id],'heart');
                        if(markerHeart){
                            markerHeart.remove();
                        }  
                    }
                }
            }
        };
        this.init = function () {
            var self = this;
            this.pan.enable();
            // this.audio.src = '../audio/info.mp3';
            // this.audio.muted = false;
            // this.audio.play();
            //拖动
            paper.canvas.onmousemove = function (e) {
                //debugger
                var svgOrigin = this.viewBox.baseVal,
                    zoom = 1 - self.pan.getCurrentZoom() * 0.1;
                if (self.moveEle) {
                    // debugger;
                    e.preventDefault();
                    e.stopPropagation();
                    var pos = self.moveEle.pos;
                    // console.log(self.moveEle.pos);
                    var x = e.pageX * zoom + svgOrigin.x - pos.width / 2 + (pos.width - (pos.pageX * zoom + svgOrigin.x - pos.x)),
                        y = e.pageY * zoom + svgOrigin.y - pos.height / 3 + (pos.height - (pos.pageY * zoom + svgOrigin.y - pos.y)),
                        tf = 't' + x + ',' + y;
                    //self.moveEle.popup.set.hide();
                    self.moveEle.x = x;
                    //console.log(self.moveEle.x)
                    self.moveEle.y = y;
                    self.moveEle.transform(tf);
                    self.moveEle.text.transform(tf);
                }
                else {
                    if(ME.vm && ME.vm.switchData.isShowCoordinate){
                        // debugger;
                        var initRelPoint={x:ME.vm.currentMap.origin_x,y:ME.vm.currentMap.origin_y};
                        var initScreenPoint=ubiMap.convert(initRelPoint,ME.vm.curRealLength);
                        var x = (e.pageX * zoom + svgOrigin.x-initScreenPoint.x).toFixed(2),
                            y = (e.pageY * zoom + svgOrigin.y-initScreenPoint.y).toFixed(2);
                        $('.company .coordinate .x').text(x);
                        $('.company .coordinate .y').text(y);

                        var screenLength = self.screenLength;
                        var realLength = ME.vm.curRealLength;
                        var relX = parseInt(x / screenLength * realLength);
                        var relY = parseInt(y / screenLength * realLength);

                        $('.company .coordinate .relX').text((relX/ 100).toFixed(2));
                        $('.company .coordinate .relY').text((relY/ 100).toFixed(2));
                    }
                    ME.vm.statisticsShow(e);
                }

                if (func == 'polygon') {
                    var d = self.pan.getCurrentPosition();
                    var ex = e.clientX * (1 - self.pan.getCurrentZoom() / 10) + d.x;
                    var ey = e.clientY * (1 - self.pan.getCurrentZoom() / 10) + d.y;

                    if (p.length >= 1) {
                        if (void 0 === a.myDynamicLine) {
                            a.myDynamicLine = a.drawLineWOcircle(p[p.length - 1].x, p[p.length - 1].y, ex, ey);
                        } else {
                            r || a.myDynamicLine.refresh(ex, ey);
                        }
                    }
                    if (p.length > 2) {
                        if (self.distance(ex, ey, p[0].x, p[0].y) < ME.distance_to_clip_polygon) {

                            if (void 0 === a.myclipPolygonMarker) {
                                a.myclipPolygonMarker = a.clipPolygonMarker(p[0].x, p[0].y);
                                r = !0;
                            } else {
                                a.myclipPolygonMarker.refresh(p[0].x, p[0].y);
                                a.myclipPolygonMarker.entireSet.show();
                                a.myDynamicLine.refresh(p[0].x, p[0].y);
                                r = !0;
                            }
                        } else {
                            void 0 !== a.myclipPolygonMarker && (r = !1, a.myclipPolygonMarker.entireSet.hide());
                        }
                    }
                } else if (func == 'getDistance') {
                    //计算两点多距离，
                    var svgOrigin = this.viewBox.baseVal,
                        zoom = 1 - self.pan.getCurrentZoom() * 0.1;
                    var ex = (e.pageX * zoom + svgOrigin.x).toFixed(1),
                        ey = (e.pageY * zoom + svgOrigin.y).toFixed(1);
                    // console.log(x,y).
                    var screenLength = self.screenLength;
                    var relX = parseInt(ex / screenLength * ME.vm.curRealLength);
                    var relY = parseInt(ey / screenLength * ME.vm.curRealLength);

                    // var d = self.pan.getCurrentPosition();
                    // var ex = e.clientX * (1 - self.pan.getCurrentZoom() / 10) + d.x;
                    // var ey = e.clientY * (1 - self.pan.getCurrentZoom() / 10) + d.y;

                    if (distance.point1 && !distance.point2) {
                        if (void 0 === a.myDistanceLine) {
                            a.myDistanceLine = a.drawLineWOcircle(distance.point1.x, distance.point1.y, ex, ey);
                        } else {
                            a.myDistanceLine.refresh(ex, ey);
                        }
                        //动态显示距离
                        var start = { x: (distance.point1.relX/100).toFixed(2), y: (distance.point1.relY/100).toFixed(2) },
                            end = { x: (relX/100).toFixed(2), y: (relY/100).toFixed(2) };
                        var dis = util.getDistance(start, end);

                        distance.pathLength = a.myDistanceLine.lineObj.getTotalLength();

                        var left = e.offsetX + 10;
                        var top = e.offsetY + 2;
                        if (!distance.markerTip) {
                            distance.markerTip = document.createElement('div');
                            document.body.appendChild(distance.markerTip);
                        }
                        distance.markerTip.innerHTML = vsn.createDistanceHtml(start, end, dis, top, left);
                    } else if (distance.point2) {
                        //清除所有
                    }
                }
            };
            //鼠标松开的时候
            paper.canvas.onmouseup = function (e) {
                self.moveEle = null;
            };
            paper.canvas.ondblclick=function(e){
                var pos=ubiMap.getPosition(e)
                ME.vm.realTimeStatistics(pos)
            },

            paper.canvas.parentNode.addEventListener('mousewheel', function () {
                var zoom = (1 - self.pan.getCurrentZoom() * 0.1).toFixed(1);
                $('.main .coordinate .zoom').text(zoom);
            }, false);

            paper.canvas.onclick = function (b) {
                $('.logoIn').removeClass('active');
                $('.panel .tab-list .list-item').removeClass('active');
                ME.vm.tabActive = '';
                $('#right_menus_items>div').removeClass('active');
                $('.total_tag_table').hide();
                if (1 != b.which) {
                    return false;
                }

                var svgOrigin = this.viewBox.baseVal,
                    zoom = 1 - self.pan.getCurrentZoom() * 0.1;
                var x = (b.pageX * zoom + svgOrigin.x).toFixed(1),
                    y = (b.pageY * zoom + svgOrigin.y).toFixed(1);
                var screenLength = self.screenLength;
                var relX = parseInt(x / screenLength * ME.vm.curRealLength);
                var relY = parseInt(y / screenLength * ME.vm.curRealLength);

                if (func == 'polygon') {
                    $("body").css("cursor", "default");

                    p.push({
                        x: x,
                        y: y,
                        relX: relX,
                        relY: relY,
                        drawn: !1
                    }), self.redrawPolygon();
                    delete a.myDynamicLine;

                } else if (func == 'getDistance') {
                    if (!distance.point1) {
                        distance.point1 = {
                            x: x,
                            y: y,
                            pageX: b.clientX,
                            pageY: b.clientY,
                            relX: relX,
                            relY: relY };
                    } else {
                        distance.point2 = {
                            x: x,
                            y: y,
                            pageX: b.clientX,
                            pageY: b.clientY,
                            relX: relX,
                            relY: relY };

                        //计算出距离
                        var s = { x: distance.point1.relX, y: distance.point1.relY };
                        var e = { x: distance.point2.relX, y: distance.point2.relY };
                        distance.distance = (util.getDistance(s, e)/100).toFixed(2);//cm to m

                        //计算出像素
                        var dis = ME.mapWidth * (distance.pathLength/screenLength);

                        switch(callback){
                            case 'distance':ME.vm.showTip(lang['correctMapNotePre'] + distance.distance + lang['m']);break;
                            case 'correctMap':ME.vm.showPromptBox(lang['correctMapNotePre'] + distance.distance + lang['correctMapNoteAfter'],{success:ME.vm.mapCorrect,succDate:{dis}});break;
                        }

                        //清除
                        self.clearGetDistance(true);
                    }
                } else if (func == 'getPos') {

                    //同时这里反馈回去的是真实坐标值
                    callback({ x: relX, y: relY, z: 100});
                    var editData = j;
                    var realLength = b;

                    //is camera
                    // var cameras = CameraTool.getCameras();
                    // var camera = cameras[editData.id];

                    if (!editData.id) {
                        // debugger;
                        if (self.interimMarker == null) {
                            ubiMap.addMarker(editData, realLength, true);
                        } else {
                            var id = self.interimMarker[0].id;
                            self.move(id, x, y, false);
                        }
                    } else {
                        var id = editData.markerType + '_' + editData.code;
                        if( editData.markerType == 'camera'){
                            id = editData.markerType + '_' + editData.id;
                        }
                        self.move(id, x, y, false);
                    }
                }else if(func=='setOrigin'){
                // 设置坐标原点
                    var oPoints={x:x,y:y};
                    MarkerTool.drawCoordinateMarker(paper, true, ME.vm.yCenter,oPoints);
                    // 显示弹出确认框，存储实际设置原点坐标
                    ME.vm.setOrigin.edit.origin_x=(relX/100).toFixed(2);
                    ME.vm.setOrigin.edit.origin_y=(relY/100).toFixed(2);

                }
                return false;
            };
        };
        this.getPosition=function(b){
            var svgOrigin = paper.canvas.viewBox.baseVal,
            zoom = 1 - this.pan.getCurrentZoom() * 0.1;
            var x = (b.pageX * zoom + svgOrigin.x).toFixed(1),
            y = (b.pageY * zoom + svgOrigin.y).toFixed(1);
            var screenLength = this.screenLength;
            var relX = parseInt(x / screenLength * ME.vm.curRealLength);
            var relY = parseInt(y / screenLength * ME.vm.curRealLength);
            return {x:x,y:y,relX:relX,relY:relY}
        },
        this.drawAriaByTwo=function(p1,p2,conf){
            var startPoint=ME.vm.getStartP(p1,p2);
            if(paper.statistics){
                paper.statistics.remove();
            }
            paper.statistics=paper.rect(startPoint.x,startPoint.y,startPoint.w,startPoint.h);
            paper.statistics.attr({
                stroke:'#3d3d3d',
                'stroke-dasharray':'--'
            });
        }
        this.clearGetDistance = function (isContinue) {
            if (distance) {
                if (distance.markerTip) {
                    document.body.removeChild(distance.markerTip);
                    delete distance.markerTip;
                    delete distance.point1;
                    delete distance.point2;
                }
            }
            if (a.myDistanceLine) {
                a.myDistanceLine.entireSet.remove();
                delete a.myDistanceLine;
            }

            distance = {};

            if (!isContinue) {
                func = '';
                $("body").css("cursor", "default");
                ME.vm.switchData.distance = false;
                ME.vm.switchData['correctMap'] = false;
            }
        }, this.showGrid = function (b) {
            if (b) {
                var d = document.documentElement.clientWidth,
                    e = document.documentElement.clientHeight,
                    f = c.getCurrentPosition();
                var zoom = 100 / (1 - c.getCurrentZoom() * 0.1);
                a.grid = a.Grid(d * (1 - .1 * c.getCurrentZoom()), e * (1 - .1 * c.getCurrentZoom()), f.x, f.y, zoom);
            } else if (void 0 !== a.grid) for (var g = 0; g < a.grid.length; g++) {
                a.grid[g].remove();
            }
        },

            //计算两点间的距离
            this.distance = function (a, b, c, d) {
                var e = 0,
                    f = 0;
                return e = c - a, e *= e, f = d - b, f *= f, Math.sqrt(e + f);
            },


            this.redrawPolygon = function () {
                if (void 0 === p[1]) {
                    return;
                }



                if (0 == p[0].drawn && 0 == p[1].drawn) {

                    p[0].drawn = !0, p[1].drawn = !0, s++, q.push(a.drawLine(p[0].x, p[0].y, p[1].x, p[1].y)), a.myDynamicLine.entireSet.hide(), a.myDynamicLine.entireSet.remove();

                    return;
                }

                if (r) {
                    //已画完
                    q.push(a.drawLine(p[p.length - 2].x, p[p.length - 2].y, p[0].x, p[0].y));
                    p[p.length - 1] = p[0], s++;

                    if(el=='camera'){

                        var editCamera = ME.vm.camera.floatEdit.data;
                        var lastPoint =  p[p.length - 1];
                        editCamera.x =lastPoint.relX;
                        editCamera.y =lastPoint.relY;
                        editCamera.z =100;

                        CameraTool.createNewCamera("new", p, q, s, !1, ME.vm.mapId);
                        s = 0, p = [], q = [], r = !1;
                        a.myclipPolygonMarker.entireSet.hide();
                        a.myDynamicLine.entireSet.hide();
                        a.myDynamicLine.entireSet.remove();
                        vsn.newCameraForm();
                        ubiMap.escDrawCamera();

                        //open zhe left menu panel
                        $('.camera').addClass('active');
                        // $(wh).addClass('active');
                        //ME.vm.freshAllCameraInnerTags();
                    }else if(el=='fence'){
                        FenceTool.createNewFence("new", p, q, s, !1, ME.vm.mapId);
                        s = 0, p = [], q = [], r = !1;
                        a.myclipPolygonMarker.entireSet.hide();
                        a.myDynamicLine.entireSet.hide();
                        a.myDynamicLine.entireSet.remove();
                        vsn.newFenceForm();
                        ubiMap.escDrawFence();

                        //open zhe left menu panel
                        $('.' + ME.vm.activeWrap).addClass('active');
                        // $(wh).addClass('active');
                        ME.vm.freshAllFenceInnerTags('fence');
                    }else if(el=='dimension'){
                        FenceTool.createNewFence("new", p, q, s, !1, ME.vm.mapId);
                        s = 0, p = [], q = [], r = !1;
                        a.myclipPolygonMarker.entireSet.hide();
                        a.myDynamicLine.entireSet.hide();
                        a.myDynamicLine.entireSet.remove();
                        // vsn.newFenceForm();
                        ubiMap.escDrawFence();
                        $('.dimension').addClass('active');
                        ME.vm.freshAllFenceInnerTags('dimension');
                    }
                    // s = 0, p = [], q = [], r = !1;
                    // a.myclipPolygonMarker.entireSet.hide();
                    // a.myDynamicLine.entireSet.hide();
                    // a.myDynamicLine.entireSet.remove();
                    // vsn.newFenceForm();
                    // ubiMap.escDrawFence();

                    // //open zhe left menu panel
                    // $('.fence').addClass('active');
                    // // $(wh).addClass('active');
                    // // ME.vm.freshAllFenceInnerTags();
                    ME.hideMenuFlag = false;
                    return false;
                }

                s++, q.push(a.drawLine(p[p.length - 2].x, p[p.length - 2].y, p[p.length - 1].x, p[p.length - 1].y));
                p[p.length - 1].drawn = !0, p[p.length - 2].drawn = !0;

                a.myDynamicLine.entireSet.hide(), a.myDynamicLine.entireSet.remove();
            };

        this.removeUnsavedPolygons = function () {
            if (p = [], void 0 !== q) for (var b = 0; b < q.length; b++) {
                q[b].entireSet.remove();
            }q = [], r = !1, s = 0;

            void 0 !== a.myDynamicLine && a.myDynamicLine.entireSet.remove(), void 0 !== a.myclipPolygonMarker && a.myclipPolygonMarker.entireSet.hide();
            FenceTool.removeUnsavedFence();
            CameraTool.removeUnsavedCamera();
        };

        this.escDrawFence = function () {
            setTimeout(function () {
                $(".seq-preloader").hide();
            }, 500), $("body").css("cursor", "default"), vsn.placingStatus = -1, this.setplacingStatus("-1");
            this.removeTemporaryObjects();

            // try {
            //     // $.guider.hideAll()
            // } catch(a) {
            //     console.log(a)
            // }
            // vsn.enableEverythingWizard(),
            // sensmapstatus.tutorial = !1,
            // sensmapstatus.newbuilding = !1,
            // sensmapstatus.editingbuilding = !1,
            // sensmapstatus.newplan = !1,
            vsn.removeHighlight();
        };
        this.escDrawCamera = function () {
            setTimeout(function () {
                $(".seq-preloader").hide();
            }, 500), $("body").css("cursor", "default"), vsn.placingStatus = -1, this.setplacingStatus("-1");
            this.removeTemporaryObjects();

            // try {
            //     // $.guider.hideAll()
            // } catch(a) {
            //     console.log(a)
            // }
            // vsn.enableEverythingWizard(),
            // sensmapstatus.tutorial = !1,
            // sensmapstatus.newbuilding = !1,
            // sensmapstatus.editingbuilding = !1,
            // sensmapstatus.newplan = !1,
            vsn.removeHighlight();
        };
        this.setplacingStatus = function (a, b, c, cb, wh) {
            func = a, i = b, j = c, callback = cb;
            el=wh;   //标记绘制类型（摄像头、围栏、维度区域）
        };

        this.removeTemporaryObjects = function () {
            if (p = [], void 0 !== q) for (var b = 0; b < q.length; b++) {
                q[b].entireSet.remove();
            }q = [], r = !1, s = 0, void 0 !== a.myDynamicLine && a.myDynamicLine.entireSet.remove(), void 0 !== a.myclipPolygonMarker && a.myclipPolygonMarker.entireSet.hide();
            this.removeScaleMarkers();
        }, this.removeScaleMarkers = function () {
            void 0 !== a.myscaleStartMarker && a.myscaleStartMarker.entireSet.remove(), void 0 !== a.myscaleEndMarker && a.myscaleEndMarker.entireSet.remove();
        },
            this.setIcon = function (scan, yCenter) {
                MarkerTool.drawCoordinateMarker(paper, scan, yCenter);
            };
        //获取坐标
        this.getPos = function (p, func, realLength, editData, mapId) {
            if (p) {
                var id = editData.markerType + '_' + editData.code;
                if(editData.markerType=='camera'){
                    id = editData.markerType + '_' + editData.id;
                }

                var self = this;
                //将拖动基站能动移动这里
                if (allMarker[id]) {

                    // console.log(allMarker[id],'nlsdkfsdfkk');
                    allMarker[id].mousedown(function (e, x, y) {
                        // debugger;
                        e.stopPropagation();
                        var info = this.getBBox();
                        this.pos = {
                            pageX: e.pageX,
                            pageY: e.pageY,
                            width: info.width,
                            height: info.height,
                            x: info.x,
                            y: info.y
                        };
                        if (this.flag == 1) {
                            self.moveEle = self.lockAnchor ? null : this;
                        }
                    });
                }

                //设置onclick的参数
                this.setplacingStatus('getPos', realLength, editData, func);
            } else {
                //取消定位
                this.setplacingStatus('-1');
            };
        };

        this.changeColor = function (newData, oldData) {
            var newMarker = allMarker[newData.markerType + '_' + newData.code];
            var oldMarker = allMarker[oldData.markerType + '_' + oldData.code];
            if (oldMarker) {
                var color = 'blue';
                if (oldMarker.node.cat && oldMarker.node.cat.color) color = oldMarker.node.cat.color;
                this.changeImgSrc(oldMarker, color);
            }
            // debugger;
            if (newMarker) {
                this.changeImgSrc(newMarker, 'red', true);

                //todo  移动地图，将需要显示的标签移动到屏幕中心
                var point = { x: newMarker.node.screenX, y: newMarker.node.screenY };
                this.movePaperInCenterPointer(point);
            };
        };

        this.changeImgSrc = function (marker, ncolor, isShow) {
            var node = marker.node;
            if(node.markerType == 'tag' && isShow){
                node.isShow = isShow;
                this.toggleNode('tag_'+node.code, isShow)
            }
        };

        this.changeColor2 = function (newData, oldData) {
            var newMarker = allMarker[newData.markerType + '_' + newData.code];
            var oldMarker = allMarker[oldData.markerType + '_' + oldData.code];
            if (oldMarker) {
                // var color = '#3c72df';
                var color = '#333';
                if (oldData.markerType === 'anchor') {
                    color = '#08762a';
                }

                if (oldData.color) color = oldData.color;
                if (oldData.cat && oldData.cat.color) color = oldData.cat.color;

                oldMarker[0].attr({ 'fill': color });
            }
            // debugger;
            if (newMarker) {
                // debugger;
                newMarker[0].attr({ 'fill': '#FF0000' });
                //todo  移动地图，将需要显示的标签移动到屏幕中心
                var point = { x: newMarker.node.screenX, y: newMarker.node.screenY };
                this.movePaperInCenterPointer(point);
            };
        };
        //todo  移动地图，将需要显示的标签移动到屏幕中心
        this.movePaperInCenterPointer = function (point) {
            ubiMap.pan.draggingByPoint(point);
        };
        this.paperClear = function () {
            paper.clear();
            allMarker = {};
            // this.setIcon(true);
        };
        //删除标签
        this.delMarker = function (param) {
            var delMarker = allMarker[param.markerId];
            if (!delMarker) {
                return;
            }
            if (delMarker.logPath) {
                delMarker.logPath.remove();
            }
            // delMarker.text.remove();
            delMarker.remove();
            delete allMarker[param.markerId];
            delMarker = null;
        };
        //删除标签
        this.delHisMarker = function (markerId) {
            var delMarker = hisMarker[markerId];
            if (!delMarker) {
                return;
            }
            if (delMarker.logPath) {
                delMarker.logPath.remove();
            }
            // delMarker.text.remove();
            delMarker.remove();
            delete hisMarker[markerId];
            delMarker = null;
        };
        this.clearInterimMarker = function () {
            // debugger;
            var vm = this;
            if (vm.interimMarker !== null) {
                var marker = vm.interimMarker[0];
                if (marker.logPath) {
                    marker.logPath.remove();
                }
                // delMarker.text.remove();
                marker.remove();
                delete vm.interimMarker[0];
                vm.interimMarker = null;
            }
        };
        //将真实坐标转化为屏幕坐标
        this.convert = function (param, realLength) {
            //console.log(realHeight)
            if(!realLength) realLength = ME.vm.curRealLength;
            // debugger;
            param.x = param.x ? param.x : 0;
            param.y = param.y ? param.y : 0;

            var relPosX = parseFloat(param.x),
                relPosY = parseFloat(param.y);

            var screenLength = this.screenLength;

            param.screenX = parseFloat(relPosX * screenLength / realLength);
            param.screenY = parseFloat(relPosY * screenLength / realLength);


            return { x: param.screenX, y: param.screenY };
        };

            //设置坐标
            this.posInital = function (marker, newPos, scan, yCenter) {
                // marker.transform(tf);
                // debugger;
                var x = newPos.x,
                    y = newPos.y;

                if (!scan) {
                    y = y + yCenter;
                }

                // if(marker.s){
                //     marker.translate(x/marker.s,y/marker.s);
                // }else {
                //     marker.translate(x,y);
                // }
                marker.translate(x, y);

                // marker.text.transform(tf);
                // debugger;
                marker.x = x;
                marker.y = y;

                //helper
                // var c = paper.circle(x, y, 2).attr({fill:'red'});
            };
        //添加标签
        this.addMarker = function (param, realLength, scan, yCenter) {
            if (this.interimMarker || !param.markerType) {
                return false;
            }
            //如果不属于当前地图，则return
            if (!param.mapId || param.mapId != ME.currentMapId) {
                console.warn('tag('+param.code+') mapId('+param.mapId+') != currentMapId('+ME.currentMapId+')')
                return false;
            }

            var self = this;

            //生成标签
            var marker = MarkerTool.drawMarker(allMarker, param, paper, realLength, scan, yCenter);
            //坐标转化
            var newPos = this.convert(param, realLength);
            //设置坐标
            this.posInital(marker, newPos, scan, yCenter);

            if (param.markerId) {
                //已经有id第一次刷新/编辑时
                allMarker[param.markerId] = marker;
            } else {
                // debugger;
                //无id第一次添加
                marker.id = -1;
                self.interimMarker = {};
                self.interimMarker[0] = marker;
            }

            // if(!param.isShow){
            //     marker.hide();
            // }else{
            //     marker.show();
            // }

            return marker;
        };
        //添加标签
        this.addHisMarker = function (param, realLength, scan, yCenter) {
            if (this.interimHisMarker || !param.markerType) {
                return;
            }
            var self = this;

            //生成标签
            var marker = MarkerTool.drawMarker(hisMarker, param, paper, realLength, scan, yCenter);

            if (param.markerId) {
                //已经有id第一次刷新/编辑时
                hisMarker[param.markerId] = marker;
            } else {
                // debugger;
                //无id第一次添加
                marker.id = -1;
                self.interimHisMarker = {};
                self.interimHisMarker[0] = marker;
            }
            return marker;
        };


        //判断标签是否进入围栏，提示
        this.monitorFence = function (tag, lastPostion) {
            if (!lastPostion || !tag) {
                return;
            }
            ME.vm.fence.data.forEach(function (fence) {
                var lastPoint = { x: lastPostion.screenX, y: lastPostion.screenY };
                var currentPoint = { x: tag.screenX, y: tag.screenY };
                // 判断是否为围栏触发标签
                // if(!fence.trif_tags||fence.trif_tags.length<1) return;

                // if(!Boolean(fence.trif_tags.find(function(v){return v==tag.sourceId}))) return;


            if (!fence.polygonPoints) {
                    fence.polygonPoints = [];
                    if (fence.points) {
                        var points = fence.points.split(',');
                        for (var j = 0; j < points.length; j++) {
                            var p = points[j];
                            var pos = p.split(' ');

                            var position = { x: parseFloat(pos[0]), y: parseFloat(pos[1]) };
                            var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                            if (!ME.vm.scanActive) {
                                newPos.y += ME.vm.yCenter;
                            }

                            fence.polygonPoints.push({ x: newPos.x, y: newPos.y });
                        }
                    }
                }
                var isIn = util.isInPolygon2D(currentPoint, fence.polygonPoints);
                var lastIsIn = util.isInPolygon2D(lastPoint, fence.polygonPoints);

                //如果上次位置在围栏外面，而当前位置在围栏内部，则提示
                //如果上次位置在围栏内部，而当前位置在围栏外面，则提示
                var tipFlag = lastIsIn != isIn;
                if (!tipFlag) {
                    return;
                }

                //将进入或者离开的标签从fenceTag中动态的进行处理
                ME.vm.freshFenceInnerTags(fence);

                if (!ME.vm.switchData.fenceTip) return;

                if (!DataManager.isFenceTip(fence, isIn)) return;

                var r = vsn.createFenceTipObject(tag, fence, isIn);
                vsn.setFenceWaitMessage(r.string, r.type);

                if (ME.vm.switchData.sound) {
                    var audio = 'warning.mp3';
                    if (fence && fence.type && fence.type.audio) audio = fence.type.audio;
                    var v = new Audio("../../common/audio/" + audio);
                    v.play();
                }
            });
        };


        //判断标签是否存在于维度区域
        this.monitorDimension = function (tag, lastPostion) {
            if (!lastPostion || !tag) {
                return;
            }
            ME.vm['dimension'].data.forEach(function (dimension) {
                var lastPoint = { x: lastPostion.screenX, y: lastPostion.screenY };
                var currentPoint = { x: tag.screenX, y: tag.screenY };
                if (!dimension.polygonPoints) {
                    dimension.polygonPoints = [];
                    if (dimension.points) {
                        var points = dimension.points.split(',');
                        for (var j = 0; j < points.length; j++) {
                            var p = points[j];
                            var pos = p.split(' ');

                            var position = { x: parseFloat(pos[0]), y: parseFloat(pos[1]) };
                            var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                            if (!ME.vm.scanActive) {
                                newPos.y += ME.vm.yCenter;
                            }

                            dimension.polygonPoints.push({ x: newPos.x, y: newPos.y });
                        }
                    }
                }

                var isIn = util.isInPolygon2D(currentPoint, dimension.polygonPoints);
                var lastIsIn = util.isInPolygon2D(lastPoint, dimension.polygonPoints);

                //如果上次位置在围栏外面，而当前位置在围栏内部，则提示
                //如果上次位置在围栏内部，而当前位置在围栏外面，则提示
                var tipFlag = lastIsIn != isIn;
                if (!tipFlag) {
                    return;
                }
                //将进入或者离开的标签从dimension中动态的进行处理
                ME.vm.freshFenceInnerTags(dimension);
            });
        };

        this.move = function (id, x, y, p, marker) {
            if (!marker) {
                marker = ubiMap.getMarker(id);
            }
            if (!marker && this.interimMarker !== null) {
                marker = this.interimMarker[0];
            }
            if (!marker) return;

            marker.x = x;
            marker.y = y;

            if (marker.flag=='tag'&& p) {
                marker.animate({ transform: "t" + x + ',' + y }, 120);
                if(!marker.node.isShow) return;
                //电量显示

                // var isShow = ME.vm.isShowTagPower(marker.node.power);
                // MarkerTool.hideMaker(marker,isShow);
                //
                // //marker上halo是否显示(移动时原本hide自动变为show)
                // if(ME.moreMonitorHalos.has(marker.node.mac)&&marker.hasOwnProperty('showHalo')){
                //     var monitorHalo=ubiMap.findMarker(marker,'moreMonitor');
                //     if(monitorHalo){
                //         marker.showHalo?monitorHalo.show():monitorHalo.hide();
                //     }
                // }
                // isShow ? powerset.show() : powerset.hide();

                marker.log = marker.log || [];
                marker.log.push({ x: x, y: y });
                if (marker.log.length > 100) {
                    marker.log.shift();
                }

                switch (this.len) {
                    case 0:
                        this.drawLine(marker, []);
                        break;
                    default:
                        this.drawLine(marker, marker.log.slice(-this.len));
                        break;
                }
                return;
            }
            if(marker.flag === 'camera'){//摄像头区域也要跟着移动   但是摄像头区域是一个path   参照点为起始点，与摄像头图标的参照点不一致
                var _x = marker.node.polygonPoints[0].x;
                var _y = marker.node.polygonPoints[0].y;
                marker.node.cameraDrawing.entireSet.animate({ transform: "t" + (x - _x) + ',' + (y - _y) }, options.duration)
            }
            marker.animate({ transform: "t" + x + ',' + y }, options.duration);
        };


        this.drawTailer = function (marker, pos, limitLen) {
            //隐藏尾巴
            if (limitLen == 0) {} else {}
        };

        this.getMarker = function (id) {
            return allMarker[id];
        };
        this.getAllMarker = function () {
            return allMarker;
        };
        this.getHisMarker = function (id) {
            return hisMarker[id];
        };
        this.getAllHisMarker = function () {
            return hisMarker;
        };
        this.toggleTag = function (flag) {
            toggleMarker('tag', flag);
        };
        this.toggleGrid = function (flag) {
            ubiMap.showGrid(flag);
        };
        this.toggleCamera = function(flag){
            toggleMarker('camera',flag);
        }
        this.toggleFence = function (flag, ftypeId) {
            var fences = ME.vm.fence.data;
            for (var i = 0; i < fences.length; i++) {
                var f = fences[i];
                if(ftypeId && f.ftypeId!=ftypeId){
                    continue;
                }
                f.isShow = flag;
                if (f && f.fenceDrawing && f.fenceDrawing.entireSet) {
                    flag ? f.fenceDrawing.entireSet.show() : f.fenceDrawing.entireSet.hide();
                }
            }
        };
        this.toggleFenceById = function (flag, fid) {
            var fence=ME.vm.fence.data.find(function(v){ return v.id==fid});
            if(fence&& fence.fenceDrawing && fence.fenceDrawing.entireSet){
                flag ? fence.fenceDrawing.entireSet.show() : fence.fenceDrawing.entireSet.hide();
            }
        };
        //测量距离
        this.getDistance = function (flag,type) {
            if (flag) {
                $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");
                switch(type){
                    case 'distance':ubiMap.setplacingStatus("getDistance",'','','distance');break;
                    case 'correctMap':ubiMap.setplacingStatus("getDistance",'','','correctMap');break;
                }
            } else {
                //取消测量距离
                ubiMap.clearGetDistance();
            }
        };
        this.toggleAnchor = function (flag) {
            toggleMarker('anchor', flag);
        };
        this.setPath = function (id, flag) {
            if (flag) {
                allMarker[id] && allMarker[id].logPath && allMarker[id].logPath.show();
            } else {
                allMarker[id] && allMarker[id].logPath && allMarker[id].logPath.hide();
            }
        };
        this.setLen = function (val) {
            this.len = parseInt(val);
        };
        this.setLockTag = function (flag, func) {
            this.lockTag = flag;
        };
        this.setLockAnchor = function (flag) {
            this.lockAnchor = flag;
        };
        //扫描地图居中
        this.scanCenter = function (imgHight) {
            var screenHeight = document.documentElement.clientHeight;
            var yCenter = (screenHeight - imgHight) / 2;
            // console.log(height);
            if (yCenter < 0) {
                yCenter = 0;
            }
            return yCenter;
        };
        //设置原点
        this.setOrigin=function(flag){
            if (flag) {
                //开始设置原点
                // $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");
                ME.vm.setOrigin.visible=true;
                ME.vm.setOrigin.edit.origin_x=(ME.vm.currentMap.origin_x/100).toFixed(2);
                ME.vm.setOrigin.edit.origin_y=(ME.vm.currentMap.origin_y/100).toFixed(2);
                // ubiMap.setplacingStatus("setOrigin",'','','setOrigin');

            } else {
                //停止设置原点
                // $("body").css("cursor", "default")
                ME.vm.setOrigin.visible=false;
                ME.vm.setOrigin.edit.origin_x='';
                ME.vm.setOrigin.edit.origin_y='';

            }
        };
        //设置背景
        this.setBg = function (data, scan, tags, realLength) {
            var imgUrl = UBIT.getImgSrc( 'maps', data.filePath);
            var img = new Image();
            var vm = this;
            img.src = imgUrl;
            img.onload = function () {
                var length = ME.mapWidth = this.width;
                var height = ME.mapHeight = this.height;

                // var screenHeight=((vm.screenLength-ME.leftMenusWidth)/length)*height;
                var screenHeight = vm.screenLength / length * height;

                if (!scan && tags) {
                    var id = data.id;
                    var yCenter = ubiMap.scanCenter(screenHeight);
                    vm.yCenter = yCenter;
                    yCenter = 0;

                    // bg = paper.image(imgUrl, ME.leftMenusWidth, ME.headerHeight+yCenter, vm.screenLength-ME.leftMenusWidth, screenHeight).toBack();
                    bg = paper.image(imgUrl, 0, yCenter, vm.screenLength, screenHeight).toBack();
                    // bg = paper.image(imgUrl, 0, yCenter, length, height).toBack();

                    for(var i=0;i<tags.length;i++){
                        ubiMap.addMarker(tags[i], realLength, scan, yCenter);
                        // ubiMap.changeColor(tags[i], false);
                    }
                    ubiMap.setIcon(scan, yCenter);

                    webSocketInit('2D', realLength,
                        {
                            coord:websocketOnData,
                            sos:SysAlert.sos,
                            fenceAlert:SysAlert.fenceAlert,
                            moreMonitorAlert:SysAlert.moreMonitorAlert,
                            forceRemove:SysAlert.forceRemove,
                            lifeStatus:SysAlert.updateHeartRate,
                            distanceAlert:SysAlert.distanceAlert,
                            heartAlert:SysAlert.heartAlert,
                            clearHalo:MarkerTool.clearHaloAndLine,
                        });

                } else {
                    bg = paper.image(imgUrl, 0, 0, vm.screenLength, screenHeight).toBack();
                }
                ME.vm.fullscreenLoading = false;
            };

            img.onerror = function(msg){
                console.log(msg);
                ME.vm.fullscreenLoading = false;
                ME.vm.mapIsMiss();
                return;
            }

        };

    }

    ubiMap = new UbiMap(config);
    ubiMap.init();
    // ubiMap.set();

    if(FenceTool)FenceTool.initialize(paper);
    if(CameraTool)CameraTool.initialize(paper);
}