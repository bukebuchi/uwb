'use strict';

/**
 * Created by zwt on 2017/6/29 0029.
 * 自定义图标样式
 */

var MarkerTool = {

    options: {
        //基站图标
        anchorAttr: { 'fill': '#08762a', 'stroke': '#c68791', 'cursor': 'pointer' },
        anchorMarker: 'M46.9,6.5C34.9-2.9,27.2,1.6,21.1,6s1.4,6.8,1.4,6.8v5.8c-5.2-1.5-1.9,4.4-1.9,4.4L16,31.3c-2.8,4.9,1.4,5.4,1.4,5.4l8.4.5.5,12.2h1.4L30.5,63H38l2.8-14.6-.3,1,1.7.9s.1,3,.5,1.9c4-10.6-.5-20.5-.5-20.5l-.5-1.5H38.9v-.5l3.3-1.9,1.9-3.4s7-5.4.9-6.3V12.8S52.5,10.9,46.9,6.5ZM28.6,30.9h-.5l-.5-.5H25.3l-1.4,1H21.6v-1S23.8,26,23.4,25h.5s1.4,4.9,4.7,4.9Z',
        anchorIcon: 'anchor.png',
        anchor: {
            text_position: { x: 15, y: 35 },
            size: 20
        },

        //标签图标
        tagAttr: { 'fill': '#3c72df', 'stroke': '#c68791', 'cursor': 'pointer', 'height': 2000, 'width': 2000 },
        tagMarker: 'M 0.5 -25.621 C -3.642 -25.621 -7 -22.263 -7 -18.121 C -7 -13.978 0.5 0 0.5 0 C 0.5 0 8 -13.978 8 -18.121 C 8 -22.263 4.643 -25.621 0.5 -25.621 C 0.5 -25.621 0.5 -25.621 0.5 -25.621 M 0.5 -14.537 C -1.479 -14.537 -3.084 -16.141 -3.084 -18.121 C -3.084 -20.101 -1.479 -21.705 0.5 -21.705 C 2.479 -21.705 4.084 -20.1 4.084 -18.121 C 4.084 -16.142 2.479 -14.537 0.5 -14.537 C 0.5 -14.537 0.5 -14.537 0.5 -14.537',
        tagIcon: 'man.png',
        tag: {
            text_position: { x: 0, y: -36 },
            power_position: { x: 0, y: -50 },
            size: 26,
            power_width: 36,
            power_height: 4
        },

        //原点图标
        coordinateAttr: { 'fill': '#cbcbcb', 'stroke': '#000000' },
        coordinateMarker: 'M25.545,23.328L17.918,15.623L25.534,8.007L27.391,9.864L29.649,1.436L21.222,3.694L23.058,5.53L15.455,13.134L7.942,5.543L9.809,3.696L1.393,1.394L3.608,9.833L5.456,8.005L12.98,15.608L5.465,23.123L3.609,21.268L1.351,29.695L9.779,27.438L7.941,25.6L15.443,18.098L23.057,25.791L21.19,27.638L29.606,29.939L27.393,21.5Z',

        markerTextAttr: { 'font-size': 12 },
        popupRectAttr: { 'stroke': '#ccc', 'fill': '#f4f4f4', 'fill-opacity': 0.99 },
        powerAttr: { 'stroke': '#ccc', 'fill': '#ccc', 'fill-opacity': 0.99 },
        defaultStrokeWidth: { 'stroke-width': 1 },
        
        //摄像头图标
        cameraAttr: { 'fill': '#08762a', 'stroke': '#c68791', 'cursor': 'pointer'},
        cameraMarker: 'M 0.5 -25.621 C -3.642 -25.621 -7 -22.263 -7 -18.121 C -7 -13.978 0.5 0 0.5 0 C 0.5 0 8 -13.978 8 -18.121 C 8 -22.263 4.643 -25.621 0.5 -25.621 C 0.5 -25.621 0.5 -25.621 0.5 -25.621 M 0.5 -14.537 C -1.479 -14.537 -3.084 -16.141 -3.084 -18.121 C -3.084 -20.101 -1.479 -21.705 0.5 -21.705 C 2.479 -21.705 4.084 -20.1 4.084 -18.121 C 4.084 -16.142 2.479 -14.537 0.5 -14.537 C 0.5 -14.537 0.5 -14.537 0.5 -14.537',
        cameraIcon: 'camera.png',
        camera: {
            text_position: { x: 0, y: -36 },
            power_position: { x: 0, y: -50 },
            size: 26,
        },
    },

    getMarkerSize:function () {
        var size = this.getCfgSize();
        if(UBIT.isPhone()){
            return size / 4.5;
        }
        return size;
    },

    getCfgSize:function () {
        // var size = ME.mapWidth/ME.vm.curRealLength * 100;
        // var width = Math.min(ME.mapWidth,ME.mapHeight)/8;
        // if(size<width) size = width;

        var map = ME.vm.currentMap;
        if(map && map.cfgMap){
            // console.log(map.cfgMap);
            var cfg = JSON.parse(map.cfgMap);
            for(var i in cfg){
                if( cfg[i].key == 'marker_size' ){
                    return cfg[i].value;
                }
            }
        }
        return 60;
    },

    /**
     *
     * @param allMarker
     * @param node  只有 基站（anchor） 和 标签（tag） 两种类型 (加:摄像头camera)
     * @param paper
     * @returns {*}
     */
    drawMarker: function drawMarker(allMarker, node, paper) {
        var size = this.getMarkerSize();

        var marker = MarkerTool.getMarker(allMarker, node, paper);
        //别名，形状和颜色
        MarkerTool.markerStyle(marker, node, paper, size);

            //电量显示
        MarkerTool.markerPower(marker, node, paper, size);
        //click事件
        MarkerTool.markerClick(marker);
        //hover事件
        MarkerTool.markerHover(marker);
        //drag事件
        // MarkerTool.markerDrag(marker);
        //zoom marker
        // marker.s = ME.vm.screenLength / ME.imgLength;
        // marker.scale( marker.s, marker.s);
        
        return marker;
    },

    markerClick: function markerClick(marker) {
        var node = marker.node;
        marker.click(function (event) {
            if(ubiMap.lockTag || ME.followMap){
                return false;
            }
            MarkerTool.marekerEditPanel(node);
        });
    },
    showQrCode: function showQrCode(node) {
        if (node.markerType != 'tag') {
            return;
        }
        var qrcode = ME.vm.tag.qrcode;
        qrcode.mac = node.mac;
        qrcode.code = node.code;
        qrcode.value_2d = ME.selfHost + '/map/map2d/svg/follow/?tag=' + node.code;
        qrcode.value_3d = ME.selfHost + '/map/map3d/?tag=' + node.code + '&anony=1';
        qrcode.title = lang['tagQrcode'];
        qrcode.show = true;
    },

    marekerEditPanel: function (node) {
        //先隐藏其它面板
        if(!ME.vm['anchor']) return;

        var anchorEdit = ME.vm['anchor'].floatEdit;
        if (anchorEdit.visible) {
            ME.vm.anchorFloatEditCancell();
        }
        if(node.markerType == 'camera'){
            //控制编辑框显示
            var params={};
            if(node.ip) params.ip=node.ip;
            if(node.id) params.id=node.id;
            if(node.addUser) params.addUser=node.addUser;
            if(node.addTime) params.addTime=node.addTime;
            if(node.points) params.points=node.points;
            if(node.mapId) params.mapId=node.mapId;
            if(node.x) params.x=node.x;
            if(node.y) params.y=node.y;
            if(node.z) params.z=node.z;

            if(node.port) params.port=node.port;
            if(node.interfaceAgreement) params.interfaceAgreement=node.interfaceAgreement;
            if(node.networkAgreement) params.networkAgreement=node.networkAgreement;
            if(node.initAngleX) params.initAngleX=node.initAngleX;
            if(node.rotateMax) params.rotateMax=node.rotateMax;
            if(node.interfacePort) params.interfacePort=node.interfacePort;
            if(node.username) params.username=node.username;
            if(node.productModel) params.productModel=node.productModel;
            if(node.seqNum) params.seqNum=node.seqNum;
            if(node.manu) params.manu=node.manu;
            if(node.markerType) params.markerType=node.markerType;
            if(node.markerId) params.markerId=node.markerId;
            node=params;
            setTimeout(function(){
                ME.vm.camera.floatEdit.visible=true;
            },10);

        }
        //生成修改面板
        var edit = ME.vm[node.markerType].floatEdit;
        // edit.left = event.offsetX+10;
        // edit.top = event.offsetY-100;

        util.emptyObj(edit.data);
        edit.data = util.deepCopy(node);
        if (node.markerType == 'anchor' || node.markerType == 'camera') {

            edit.data.x=((edit.data.x-(ME.vm.currentMap.origin_x)) / 100).toFixed(2);
            edit.data.y=((edit.data.y-(ME.vm.currentMap.origin_y)) / 100).toFixed(2);
            edit.data.z=((edit.data.z-(ME.vm.currentMap.origin_z)) / 100).toFixed(2);
            if(node.markerType == 'anchor'){
                ME.vm.mapChangeImg();
            }

        }else if (node.markerType == 'tag') {
            this.showQrCode(node);
        }

        if (node.color) edit.data.color = node.color;
        if (node.cat && node.cat.color) edit.data.color = node.cat.color;

        ME.vm.tag.floatEdit.typeIconShow = false;

        if (node.type && node.type.id) {
            edit.data.typeId = node.type.id;
            edit.typeIcon = UBIT.getImgSrc( 'tagTypes', node.type.icon);
            ME.vm.tag.floatEdit.typeIconShow = true;
        }

        if (node.cat && node.cat.id) {
            edit.data.catId = node.cat.id;
        }

        edit.visible = true;

        var zindex = 100;
        var raps = $('.el-dialog__wrapper');
        raps.map(function(i, e){
            var z = parseInt($(e).css('z-index'));
            if(zindex<z) zindex=z;
        });

        $('.el-popover').css({ left: '50%', top: '20%', 'z-index': ++zindex});
    },

    markerHover: function markerHover(marker) {
        var markerTip = null;
        marker.hover(function (event) {
            if(ubiMap.lockTag || ME.followMap){
                return false;
            }
            var left = event.offsetX + 10;
            var top = event.offsetY + 2;

            markerTip = document.createElement('div');
            markerTip.innerHTML = MarkerTool.createMarkerInfoTable(marker, top, left);
            document.body.appendChild(markerTip);
        }, function (event) {
            if (markerTip) document.body.removeChild(markerTip);
        });
    },
    createMarkerInfoTable: function createMarkerInfoTable(marker, top, left) {
        //编号，别名，分组，类型，电量，状态，速度
        var a = marker.node;
        var originRelPoint={x:ME.vm.currentMap.origin_x,y:ME.vm.currentMap.origin_y};
        var originScreenPoint=ubiMap.convert(originRelPoint,ME.vm.curRealLength);
        var c = '<div class="qtip-default" style="position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:100;padding:10px;">';
        c += "<span style='float: left;' ><table class='infowindowTable'>";


        if (a.markerType === 'tag') {
            c += "<tr><td>"+lang['code']+"</td><td>" + a.code + "</td></tr>";
            c += "<tr><td>"+lang['alias']+"</td><td>" + (a.alias ? a.alias : lang['undefined']) + "</td></tr>";
            if (a.type) a.type.cname?c += "<tr><td>"+lang['type']+"</td><td>" + a.type.cname + "</td></tr>":'';
            if (a.cat) a.cat.cname?c += "<tr><td>"+lang['group']+"</td><td>" + a.cat.cname + "</td></tr>":'';
            if (a.powerLevel) c += "<tr><td>"+lang['power']+"</td><td>" + a.powerLevel + "%</td></tr>";
            if (a.heartRate || a.heartRate==0) c += "<tr><td>"+lang['heartRate']+"</td><td>" + a.heartRate + lang['times_minute']+"</td></tr>";
            // c += "<tr><td>状态：</td><td>" + (a.status == 'online' ? "在线" : "离线") + "</td></tr>";
            // c += "<tr><td>速度：</td><td>" + (a.speed?a.speed:0) + "cm/s</td></tr>";

            if(ME.vm && ME.vm.switchData.isShowCoordinate) {
                c += "<tr><td>"+lang['locationM']+"</td><td>X:" + (a.x / 100).toFixed(2) + "，Y:" + (a.y / 100).toFixed(2) + "</td></tr>";
                c += "<tr><td>"+lang['locationPx']+"</td><td>X:" + Math.round(a.screenX) + "，Y:" + Math.round(a.screenY) + "</td></tr>";
            }

            c += "</table></span></div>";

            return c;

        } else if(a.markerType=='anchor'){
            c += "<tr><td>"+lang['code']+"</td><td>" + a.code + "</td></tr>";
            c += "<tr><td>"+lang['alias']+"</td><td>" + (a.alias ? a.alias : lang['undefined']) + "</td></tr>";
            c += "<tr><td>"+lang['anchorType']+"</td><td>" + (a.isMaster == '1' ? lang['masterAnchor'] : lang['notMasterAnchor']) + "</td></tr>";
        }else if(a.markerType=='camera'){
            c += "<tr><td>"+lang['ipaddress']+"</td><td>" + a.ip + "</td></tr>";
            c += "<tr><td>"+lang['port']+"</td><td>" + a.port + "</td></tr>";
        }else if(a.markerType=='fence'){
            var innerTagNum = Object.getOwnPropertyNames(a.innerTags).length - 1;
            c += "<tr><td>"+lang['fenceId']+"</td><td>" + a.id + "</td></tr>", c += "<tr><td>"+lang['fenceName']+"</td><td>" + a.cname + "</td></tr>",
                c += "<tr><td>"+lang['fenceType']+"</td><td>" + a.ftype + "</td></tr>",
                c += "<tr><td>"+lang['warningCondition']+"</td><td>" + (a.trif == 'i' ? lang['triggeringIn'] : a.trif == 'o' ? lang['triggeringOut'] : lang['triggeringInOut']) + "</td></tr>";

                // c += "<tr><td>内部标签：</td><td>";c += "共" + innerTagNum + "个<br/>";
            c += "</table></span></div>";
            return c;
        }else if(a.markerType=='wall'){
            //围墙类型处理
            var wtype=a.wtype?(function(){
                var t=lang['unknown2'];
                for(var i=0;i<ME.vm.wall.wtypes.length;i++){
                    var item=ME.vm.wall.wtypes[i];
                    if(a.wtype==item.code){
                        t=item.cname;
                        break;
                    }
                }
                return t;

            })():lang['unknown2'];
            c += "<tr><td>"+lang['wallId']+"</td><td>" + a.id + "</td></tr>", c += "<tr><td>"+lang['wallName']+"</td><td>" + a.cname + "</td></tr>", c += "<tr><td>"+lang['wallType']+"</td><td>" + wtype + "</td></tr>", c += "<tr><td>"+lang['startCoordinate']+"</td><td>X:"+a.startX+'&nbsp;&nbsp;&nbsp;Y:'+a.startY+"</td></tr>",c += "<tr><td>"+lang['endCoordinate']+"</td><td>X:"+a.endX+'&nbsp;&nbsp;&nbsp;Y:'+a.endY+"</td></tr>";
            c += "</table></span></div>";
            return c;
        }
        c += "<tr><td>"+lang['locationM']+"</td><td>X:" + (a.x / 100).toFixed(2) + "，Y:" + (a.y / 100).toFixed(2) + "</td></tr>";
        c += "<tr><td>"+lang['locationPx']+"</td><td>X:" + Math.round(a.screenX) + "，Y:" + Math.round(a.screenY) + "</td></tr>";


        //
        // c += "<tr><td>"+lang['code']+"</td><td>" + a.code + "</td></tr>";
        // c += "<tr><td>别名：</td><td>" + (a.alias ? a.alias : lang['undefined']) + "</td></tr>";
        // if (a.markerType === 'tag') {
        //     if (a.type) a.type.cname?c += "<tr><td>类型：</td><td>" + a.type.cname + "</td></tr>":'';
        //     if (a.cat) a.cat.cname?c += "<tr><td>分组：</td><td>" + a.cat.cname + "</td></tr>":'';
        //     if (a.powerLevel) c += "<tr><td>电量：</td><td>" + a.powerLevel + "%</td></tr>";
        //     if (a.heartRate || a.heartRate==0) c += "<tr><td>心率：</td><td>" + a.heartRate + "次/分钟</td></tr>";
        //     // c += "<tr><td>状态：</td><td>" + (a.status == 'online' ? "在线" : "离线") + "</td></tr>";
        //     // c += "<tr><td>速度：</td><td>" + (a.speed?a.speed:0) + "cm/s</td></tr>";
        //
        //     if(ME.vm && ME.vm.switchData && ME.vm.switchData.isShowCoordinate) {
        //         c += "<tr><td>位置(m)：</td><td>X:" + ((a.x-ME.vm.currentMap.origin_x) / 100).toFixed(2) + "，Y:" + ((a.y-ME.vm.currentMap.origin_y) / 100).toFixed(2) + "</td></tr>";
        //         c += "<tr><td>位置(px)：</td><td>X:" + Math.round(a.screenX-originScreenPoint.x) + "，Y:" + Math.round(a.screenY-originScreenPoint.y) + "</td></tr>";
        //     }
        //
        // } else {
        //     c += "<tr><td>基站类型：</td><td>" + (a.isMaster == '1' ? "主基站" : "从基站") + "</td></tr>";
        //     c += "<tr><td>位置(m)：</td><td>X:" + ((a.x-ME.vm.currentMap.origin_x) / 100).toFixed(2) + "，Y:" + ((a.y-ME.vm.currentMap.origin_y) / 100).toFixed(2) + "</td></tr>";
        //     c += "<tr><td>位置(px)：</td><td>X:" + Math.round(a.screenX-originScreenPoint.x) + "，Y:" + Math.round(a.screenY-originScreenPoint.y) + "</td></tr>";
        //
        // }
        //
        c += "</table></span></div>";

        return c;
    },
    getMarker: function getMarker(allMarker, node, paper) {
        var marker = allMarker[node.markerId];
        if (!marker) {
            marker = paper.set();
            // allMarker[node.markerId] = marker;
        } else {
            //初始相同
            marker.remove();
        };
        marker.node = node;
        return marker;
    },

    //画原点
    drawCoordinateMarker: function drawCoordinateMarker(paper, scan, yCenter,oPoints) {
        var y = -10.322;
        if (!scan) {
            y += yCenter;
        }


        //
        if(oPoints){
            if(!ME.origin){
                ME.origin=paper.path(MarkerTool.options.coordinateMarker).attr(MarkerTool.options.coordinateAttr).transform(Raphael.matrix(0.3536, 0.3536, -0.3536, 0.3536, 0.7344, y).toTransformString());
            }
            var originWh=ME.origin.getBBox();
            ME.origin.animate({ transform: ["t" + (parseFloat(oPoints.x)-originWh.width/2).toString() + ',' + (parseFloat(oPoints.y)-originWh.height/2).toString(),'R',45] }, 200);
        }else{
            ME.origin=paper.path(MarkerTool.options.coordinateMarker).attr(MarkerTool.options.coordinateAttr).transform(Raphael.matrix(0.3536, 0.3536, -0.3536, 0.3536, 0.7344, y).toTransformString());
            var originWh=ME.origin.getBBox();
            //实际屏幕显示的点
            var initPoint={x:ME.vm.currentMap.origin_x,y:ME.vm.currentMap.origin_y};
            var relPoint=ubiMap.convert(initPoint,ME.vm.curRealLength);
            //实际点转屏幕点
            // ME.origin.animate({ transform: ["t" + (parseFloat(ME.vm.currentMap.origin_y)-originWh.height/2).toString() + ',' + (parseFloat(ME.vm.currentMap.origin_y)-originWh.height/2).toString(),'R',45]});
            ME.origin.animate({ transform: ["t" + (parseFloat(relPoint.x)-originWh.height/2).toString() + ',' + (parseFloat(relPoint.y)-originWh.height/2).toString(),'R',45]});
        }
    },

    //tag 文字显示
    tagText: function tagText(tag, paper, textAttr, rectAttr) {
        //设置文本
        var alias = tag.alias ? tag.alias : tag.code;

        textAttr.text = alias;
        textAttr.title = alias;
        var text = paper.text(MarkerTool.options.tag.text_position.x, MarkerTool.options.tag.text_position.y, alias).attr(textAttr);

        text.toFront();

        return [text, {}];
    },
    //摄像头文字显示
    cameraText:function cameraText(camera,paper,textAttr,rectAttr){
        // var alias = camera.alias ? camera.alias : camera.ip;        
        var alias=camera.ip;
        textAttr.text=alias;
        textAttr.title=alias;
        var text=paper.text(MarkerTool.options.camera.text_position.x,MarkerTool.options.camera.text_position.y,alias).attr(textAttr);
        text.toFront();
        
        return [text, {}];
    },

    //anchor 文字显示
    anchorText: function anchorText(anchor, paper, textAttr, rectAttr) {
        //设置文本、文本框
        var alias = anchor.alias ? anchor.alias : anchor.code;
        var text = paper.text(MarkerTool.options.anchor.text_position.x, MarkerTool.options.anchor.text_position.y, alias).attr(textAttr),
            textPos = text.getBBox();
        var textFrame = paper.rect(-textPos.width / 2 + 12, -textPos.height / 2 + 32, textPos.width + 4, textPos.height + 4).attr(rectAttr);
        // var textFrame = paper.rect(MarkerTool.options.anchor.text_position.x,
        //     MarkerTool.options.anchor.text_position.y, textPos.width + 6, textPos.height + 6).attr(rectAttr);
        text.toFront();
        return [text, textFrame];
    },

    markerPower: function markerPower(marker, node, paper,size) {
        if (node.markerType != 'tag') return marker;
        if(!node.powerLevel){
            node.powerLevel = UBIT.getPower(node.power)
        }
        //是否显示
        if(ME.projectCode==='slairport'){
            node.powerLevel=100;
        }
        var rectAttr = MarkerTool.options.powerAttr;

        var width = size * (node.powerLevel / 100);
        if (node.powerLevel < 30) rectAttr.fill = "#eb3324";else if (node.powerLevel < 70) {
            rectAttr.fill = "#f7cd46";
        } else {
            rectAttr.fill = "#4cd96c";
        }
        rectAttr.stroke = rectAttr.fill;
        var powerset = paper.set();

        var coord = {x: -size/2, y:(-size - (size*3/5 + 5 ))};
        var powerFrame = paper.rect(coord.x,coord.y , size, size/9, 2).attr({ 'stroke': rectAttr.stroke, 'stroke-opacity': 0.2, 'fill': rectAttr.fill, 'fill-opacity': 0.2 });
        powerset.push(powerFrame);

        var power = paper.rect(coord.x, coord.y, width, size/9, 2).attr(rectAttr);
        powerset.push(power);

        powerset.flag = "power";

        //是否显示

        var isShow = ME.vm.isShowTagPower(node.powerLevel, node.isShow);
        isShow ? powerset.show() : powerset.hide();
        marker.push(powerset);
        return marker;
    },

    hidePower:function(marker,isShow){
        for (var i = 0; i < marker.items.length; i++) {
            var item = marker.items[i];
            if (!item.flag || item.flag!== 'power') continue;
            isShow ? item.show():item.hide();
        }
    },
    markerStyle: function markerStyle(marker, node, paper, size) {
        //设置文本
        var fontSize = size * 3/10 + 1;
        // console.log('size:', size, 'fontSize:', fontSize);

        var textAttr = { 'font-size':fontSize, 'width': size};//, 'textLength': size, 'font-family':'sans-serif', 'text-anchor':'middle'
        var text_position = { x: 0, y: - size - fontSize };

        var alias = null;
        switch(node.markerType){
            case 'tag':
            case 'anchor': alias=node.alias ? node.alias : node.mac;break;
            case 'camera': alias=node.ip;break;
        }
        //颜色
        if (node.color) textAttr.fill = node.color;
        if (node.cat && node.cat.color) textAttr.fill = node.cat.color;

        textAttr.text = alias;
        textAttr.title = alias;

        //todo
        var text = paper.text(text_position.x, text_position.y, alias).attr(textAttr);
        marker.push(text);

        //形状
        var iconsvg = this.markerIconByImg(node, paper, size);
        if(node.productId == 17){
            var deg = node.direction || 0;
            var directionIconSvg = this.drowAnchorDirection(node, iconsvg.paper, size,deg);
            marker.push(directionIconSvg);
        }
        marker.push(iconsvg);

        //摄像头覆盖区域
        // var area=this.markerArea(node,paper, size);
        // marker.push(area);
        //设置flag值
        marker.flag = node.markerType;
        return marker;
    },
    //绘画摄像头覆盖范围
    // markerArea:function markerArea(node,paper,size){
    //     if(node.markerType!=='camera') return;
    //     //计算圆心
    //     var x=node.x ? node.x : 0;
    //     var y=node.y ? node.y : 0;
    //     var deg_x=node.initAngleX ? node.initAngleX % 360 : 0;    //x轴正方向为0角度
    //     var deg_end_x=node.initAngleX+270;    //结束时角度，假设旋转角120
    //
    //     var r=node.visual_radius ? node.visual_radius*size/100 : 50;
    //     // var r=node.visual_radius ? node.visual_radius : 3000;
    //
    //     var rad = Math.PI / 180;
    //     var x1 = r * Math.cos(-deg_x * rad);
    //     var x2 =  r * Math.cos(-deg_end_x * rad);
    //     var y1 =  r * Math.sin(-deg_x * rad);
    //     var y2 =  r * Math.sin(-deg_end_x * rad);
    //
    //     //判断绘画长弧或短弧(1:长弧，0：短弧)
    //     var deg=deg_end_x-deg_x>180?1:0;
    //     // var area=paper.path(['M', x1, y1, "A", r, r,0,1,1,x2,y2,'L',0,0,'l',x1,y1]).attr({fill:'rgba(0,125,222,.6)','stroke-width':"0"});
    //     var area=paper.path(['M', x1, y1, "A", r, r,0,deg,0,x2,y2,'L',0,0,'l',x1,y1]).attr({fill:'rgba(0,125,222,.6)','stroke-width':"0"});
    //     return area;
    //  },

    markerIconByPath: function markerIconByPath(node, paper) {
        //节点样式设置
        var styleAttr = MarkerTool.options[node.markerType + 'Attr'];
        var path = MarkerTool.options[node.markerType + 'Marker'];

        // if(node.type && node.type.icon){
        //     path = SVG_LIB[node.type.icon];
        // }

        var paths = paper.set();
        if (_.isArray(path)) {
            for (var i = 0; i < path.length; i++) {
                paths.push(paper.path(path[i]).attr(styleAttr)); //.translate(-10,-10)
            }
        } else {
            paths.push(paper.path(path).attr(styleAttr)); //.translate(-10,-10)
        }
        if (node.markerType == 'tag') {
            // paths.scale(0.7,0.7);
            paths.translate(-40, -40);
        }
        return paths;
    },
    //显示标记图标
    markerIconByImg: function markerIconByImg(node, paper, size) {
        var icon = '';
        var text_position = { x: -(size)/2, y: -size };
        var size_x = size;
        var size_y = size;

        if(node.markerType == 'tag'){

            if(node.type && node.type.icon){
                icon =UBIT.getImgSrc( 'tagTypes', node.type.icon);
                if(node.type.cname == '轻轨'){
                    size_x = size* 34 ;
                    size_y = size* 2;
                    text_position.x = - size_x + (size)*4.55;
                }

            }else {
                icon = ME.iconPath + node.markerType + '/location_gray.png';
            }

        }else {

            var type, color = 'blue';
            icon = ME.iconPath + node.markerType;

            switch(node.markerType){
                case 'anchor':type='anchor',color='blue';break;
                case 'camera':type='camera',color='blue';break;
                default : break;
            }

            if(node.status==='offline') color='gray';
            if(type=='anchor' && node.isMaster>0) type+='_master';
            if(node.productId == 17){
                type = 'anchor_direction';
                if(node.isMaster>0){
                    type+='_master'
                }
            }
            //形状
            icon += '/' + type + '_' + color + '.png';
        }

        var img = paper.image(icon, text_position.x, text_position.y, size_x, size_y);
        return img;
    },

    //画圆弧
    getArc: function (radius,start,over){

        var sweepFlag=over > start ? 1 : 0,
            largeArc=((over-start)%360+360)%360 >180 ? 1 : 0 ,
            rad1 = Math.PI/180,
            cos = Math.cos,
            sin = Math.sin,
            startX = radius*cos(rad1*start),
            startY = radius*sin(rad1*start)-radius,
            overX = radius*cos(rad1*over),
            overY = radius*sin(rad1*over)-radius;

        return [
            'M',
            startX.toFixed(2),startY.toFixed(2),
            'A',
            radius,radius,
            0,largeArc,sweepFlag,
            overX.toFixed(2),overY.toFixed(2)
        ].join(' ');
    },
    drowAnchorDirection: function (node, paper, size,deg) {
        var r = size/2;
        var startdeg = deg -6;
        var enddeg = deg +6;
        var R = size/2 + size/6;
        var bigx = R * Math.cos(2*Math.PI/360*deg);
        var bigy = R * Math.sin(2*Math.PI/360*deg)-r;
        var optstr = this.getArc(r,startdeg,enddeg);
        optstr += "L" + bigx + " " + bigy +"Z";
        var drawfill = paper.path(optstr);
        var color = "#598CC3";
        if(node.status === "offline"){
            color = "#A4A4A4";
        }
        drawfill.attr("fill", color).attr("stroke", color);
        return drawfill;
    },

    markerHalo: function markerHalo(marker, type, paper, scolor) {
        var haloNum = 4;
        var size = MarkerTool.getMarkerSize();
        var color=scolor?scolor:'red';

        var coord = {x: 0, y:-size/2};

        var haloSet = paper.set();
        for(var i=1;i<=haloNum;i++){
            var innerHalo = paper.circle(coord.x, coord.y, size * i/haloNum).attr({'stroke':color,'stroke-width':Math.pow(2,haloNum-(i+1))});
            innerHalo.hide();
            haloSet.push(innerHalo);
        }
        haloSet.flag=type;

        // 将光环放置最底层
        var haloItems=marker.items[0];
        if(haloItems){
            haloSet.insertBefore(haloItems);
        }
        marker.push(haloSet);
        //haloSet move
        haloSet.translate(marker.x, marker.y);

        return haloSet;
    },

    // 设置光环闪烁
    setEscper:function(monitorHalo){
        monitorHalo.hide();
        if(!monitorHalo.timerId){
            monitorHalo.timerId = setTimeout(function () {
                monitorHalo.show();
                monitorHalo.timerId = 0;
            }, 200);
        }
    },


    markerRemove:function(marker, type){
        marker.forEach(function(item, i){
            if(item.flag == type){
                marker.splice(i,1);
                return false;
            }
        });
    },

    findInMarker:function(marker,type){
        for (var i = 0; i < marker.items.length; i++) {
            var item = marker.items[i];
            if (!item.flag || item.flag!= type) continue;
            return item;
        }
        return false;
    },

    clearLine:function (type) {
        if(paper[type]){
            paper[type].remove();
        }
        delete paper[type];
    },

    // 清除光环/连线
    clearHaloAndLine : function(type){
        if(!type) return;
        var nowTime = Date.now();

        var allGroupMem=ME[type+'Halos'];
        var hideTime=ME[type+'HalosHideTime'];

        for(var mac in allGroupMem){
            var halo = allGroupMem[mac].halo;
            if(!halo) return;
            var drawDataTime = halo[type+'drawDataTime'];
            if(nowTime-drawDataTime>=hideTime){
                halo.remove();

                // MarkerTool.clearLine(mac, type);
                var lineKey=mac+'_'+type;
                if(type=='moreMonitor'){
                    lineKey=allGroupMem[mac].lineKey;
                }
                MarkerTool.clearLine(lineKey);

                var marker = ubiMap.getMarker('tag_'+mac);
                if(!marker) return;
                MarkerTool.markerRemove(marker, type);

                delete allGroupMem[mac];
            }
        }

        // if(type=='moreMonitor'){
        //     for(var j=0;j<ME.vm.moreMonitor.data.length;j++){
        //         var item=ME.vm.moreMonitor.data[j];
        //         var moreMonitorLine=ME.vm.currentMap.cname+'_'+ME.vm.currentMap.id+'_'+item.id;
        //         if(!paper[moreMonitorLine]||!paper[moreMonitorLine].moreMonitordrawDataTime) continue;
        //         if(nowTime-paper[moreMonitorLine].moreMonitordrawDataTime>=hideTime){
        //             paper[moreMonitorLine].remove();
        //         }
        //     }
        // }
    },



    markerHeart: function (marker, paper) {
        var heart = this.findInMarker(marker, 'heart');
        if(heart){
            this.setEscper(heart);

        }else {
            var size = MarkerTool.getMarkerSize()/3;
            var coord = {x: size, y: -size};

            var icon = ME.iconPath + '/heart.png';
            heart = paper.image(icon, coord.x, coord.y, size, size);
            heart.flag='heart';
            // heart.hide();

            marker.push(heart);

            //haloSet move
            heart.translate(marker.x, marker.y);
        }

        return heart;
    },
};
