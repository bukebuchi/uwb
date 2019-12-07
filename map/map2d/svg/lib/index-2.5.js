
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/***
 * add by zwt 2017.06.01
 * 管理员管理后台
 */

/**
 * 程序总入口
 */
;(function (window) {
    init();
})();


/**
 * 页面初始化   UBIT.init =
 */
function init() {
    if (!privCheck()) return;
    jqxNotificationInit();
    vsnInit();
    raphaelInit();
    vueInit();
    eventInit();
    cssInit();
}

function dataInit(datas, key, vm) {
    // console.dir(key);
    if (_.isArray(datas)) {
        vm[key].data = datas;
    } else {
        vm[key] = datas;
    }
    if (key == 'tagCat') {
        vm.switchData.isShowTagCats = datas.map(function (d) {
            return d.id;
        })
    }else if (key == 'mapId') {
        if (datas > 0) {
            if(!ME.currentMapId) ME.currentMapId = datas;
            currentMapInit(vm);
            ME.rotate=ME.vm.currentMap.northAngle;
            // $('.button_rotate_origin').css({transform:'translate(-50%,-50%) rotate('+(ME.rotate)+'deg)'});
            $('.button_rotate').css({transform:'rotate('+ME.rotate+'deg) scale(0.4)'});
            
        } else {
            jqAlert(lang['systemHint'],lang['showTipNote4'],function () {
                top.location.href = UBIT.selfHost + "/super/index/";
            })
            return;
        }
    } else if (key == 'fence' || key=='dimension') {
        drawFences(vm, key);
    } else if (key == 'anchor') {

        drawNode(vm, key);
    } else if (key == 'tag'|| key == 'currentTags') {
        drawNode(vm, key);
        ubiMap.setIcon(vm.scanActive);

        webSocketInit('2D', vm.curRealLength,
            {
                coord:websocketOnData,
                sos:SysAlert.sos,
                fenceAlert:SysAlert.fenceAlert,
                moreMonitorAlert:SysAlert.moreMonitorAlert,
                forceRemove:SysAlert.forceRemove,
                lifeStatus:SysAlert.updateHeartRate,
                distanceAlert:SysAlert.distanceAlert,
                heartAlert:SysAlert.heartAlert,
                aggregateAlert:SysAlert.aggregate,
                stillnessAlert:SysAlert.stillness,
                clearHalo:MarkerTool.clearHaloAndLine,
            });

    }else if(ME.vm.isShowCamera && key=='camera'){
        drawCameras(vm);
        drawNode(vm, key);
    };

}



// function drawFences(vm) {
function drawFences(vm,key) {
    FenceTool.showFences({ force: !1, mapId: vm.mapId }, vm[key].data,key);
    // ubiMap.toggleFence(ME.vm.switchData.fence);
    // 根据全局设置，隐藏围栏
    ME.vm.checkFenceIsShowByglobal();

    // FenceTool.showFences({ force: !1, mapId: vm.mapId }, data);
    //等界面上的标签和围栏加载完毕后，统计围栏/维度区中的标签数量
    setTimeout(function(){
        ME.vm.freshAllFenceInnerTags('fence');
        ME.vm.freshAllFenceInnerTags('dimension');
    }, 3000);
}


//绘制摄像头覆盖区域
function drawCameras(vm) {
    CameraTool.showCameras({ force: !1, mapId: vm.mapId }, vm.camera.data);
}

//绘制基站和标签和摄像头
function drawNode(vm, key) {
    for (var i = 0; i < vm[key].data.length; i++) {
        var data = vm[key].data[i];
        if (key == 'tag') {
            ME.tags[data.code] = UBIT.deepCopy(data);
            //设置触发围栏所有标签，搜索时内容改变
            // ME.vm.fence.allTagsData.push(data);
            //设置互监组成员搜索来源值
            ME.vm.moreMonitor.allTagsData.push(data);
            ME.vm.history.allTags.push({ key: data.code, label: data.alias ? data.alias : data.code});
        }

        if (data.mapId != ME.vm.mapId ) continue;

        if(key=='anchor'){
            data.x=parseFloat(data.x)+parseFloat(ME.vm.currentMap.origin_x);
            data.y=parseFloat(data.y)+parseFloat(ME.vm.currentMap.origin_y);
            data.z=parseFloat(data.z)+parseFloat(ME.vm.currentMap.origin_z);
            // 显示或隐藏标签
            data.isShow=ME.vm.anchor.defaultDisplay;
        }

        var marker = ubiMap.addMarker(data, ME.vm.curRealLength, true);
        data.isShow? marker.show():marker.hide();
    }
}

/**
 * 画地图
 * @param vm
 */
function currentMapInit(vm) {
    vm.scanActive = vm.showMode == 'admin';
    vm.setNodeData(vm.currentMap, vm.scanActive, vm.currentTags ? vm.currentTags.data : null);
    ME.vm.getCoordBorder();
}


function intervalTagDisappear (){
    if(ubiMap.lockTag || !ME.vm.switchData.isShowActiveTag) return;

    for(var i in ME.tags){
        var t = ME.tags[i];
        var marker = allMarker['tag_'+t.code];
        if(!marker) continue;

        //获取tag.data对应数据，改变isShow,控制勾选
        var item=ME.vm.tag.data.find(function(v){return v.sourceId==t.sourceId});
        if(!item|| !t.time || !item.tagDisappear||item.tagDisappear<1) continue;
        var diff = Date.now() - t.time;

        var isIn = true;
        if(ME.tags[i]&&ME.tags[i].lastPostion){
            isIn=ME.vm.checkInBorderCoord(ME.tags[i].lastPostion);
        }
        if(!diff||diff>=item.tagDisappear){
            //hide marker
            hideMarker(item, marker)

        }else{
            //show marker
           if(isIn){
               showMarker(item, marker);
           }
        }
    }

};


function hideMarker(item, marker) {
    if (marker.logPath) {
        marker.logPath.remove();
    }

    //改变勾选状态，隐藏maker
    item.isShow=false;
    marker.node.isShow = false;
    ubiMap.toggleNode(item.markerId,item.isShow);
}

function showMarker(item, marker) {
    item.isShow=true;
    marker.node.isShow = true;
    ubiMap.toggleNode(item.markerId,item.isShow);
}


/**
 * websocket  triger
 * @param data
 * @param realLength
 * @param scan
 * @param yCenter
 */
function  websocketOnData(data, realLength, scan, yCenter){
    // if(!data.id) return;

    var code = data.code = data.code ? data.code : data.mac;
    if (!code) return;

    // if(data.mac == '06110000'){
    //     console.log(data);
    // }
    // 判断标签是否在定位有效区
    var isIn=ME.vm.checkInBorderCoord(data);
    //坐标转化
    ubiMap.convert(data, realLength);
    var tag = ME.tags[code];
    if (!tag) {
        tag = ME.vm.getAnonyTag(data);
        ME.vm.history.allTags.push({
            key: data.code,
            label: data.alias ? data.alias : data.code,
        });
    } else {
        tag.x = data.x;
        tag.y = data.y;
        tag.z = data.z;
        if (tag.mapId !== data.mapId) {
            tag.mapId = data.mapId;
            var map = ME.vm.getMapById(data.mapId);
            if (map) tag.mapName = map.cname;
        }
        tag.screenX = data.screenX;
        tag.screenY = data.screenY;
        tag.status = 'online';
        tag.time = data.time;
    }

    //当前没有播放历史轨迹
    if (!ubiMap.lockTag) {
        var marker = ubiMap.getMarker('tag_' + code);
        if (!marker) {
            console.log('addMarker:', tag.code);
            marker = ubiMap.addMarker(tag, ME.vm.curRealLength, scan, yCenter);
            if(!marker) return;
        }

        if(isIn){
            if(ME.vm.switchData.isShowActiveTag){
                tag.isShow = true;
                marker.node.isShow = true;
                ubiMap.toggleNode('tag_' + code,true);
            }
        }else{
            tag.isShow = false;
            marker.node.isShow = false;
            ubiMap.toggleNode('tag_' + code,false);
        }


        //不要轻易修改vue上的变量，vue变量的改变会导致渲染界面从而使页面卡顿
        var tagTmp = ME.vm.getTag(data);
        if (!tagTmp) {
            tagTmp = UBIT.deepCopy(tag);
            ME.vm.tag.data.push(tagTmp);
        }else if(ME.updateRealtime || (ME.vm && ME.vm.switchData.isShowCoordinate)){//|| ME.vm.tag.data.length<100
            ME.vm.setTag(tagTmp, data);
        }

            if(marker.node.isShow){ubiMap.move('tag_' + code, data.screenX, data.screenY, true, marker)};

        //订阅单个标签，如果标签跨地图，则切换地图
        // if(ME.vm.currentTags && ME.vm.currentTags.data && ME.vm.currentTags.data.length==1){
        //     var subTag = ME.vm.currentTags.data[0];
        //     if(subTag.mac === data.mac && ME.projectCode + '_' + ME.vm.currentMap.id != data.map){
        //         // 切换地图,重新根据code加载页面
        //         if(DataManager.isNeedReload(data)) location.reload();
        //     }else {
        //         DataManager.clearChangeMapCounter(data)
        //     }
        // }

        if(ME.willFollowTag && tag.code==ME.willFollowTag){
        //记录跟随标签的地图信息，如果地图变化则切换
            if(!ME.followMap){
                ME.followMap=ME.projectCode +'_'+ME.currentMapId;
            }else {
                if(ME.followMap!=data.map){
                    // 切换地图,重新根据code加载页面
                    location.reload();
                }
            }

        if(!ME.lastGoPoint.x){
            var point = { x: tag.screenX, y: tag.screenY };
            ubiMap.pan.draggingByPoint(point);
            ME.lastGoPoint=point;
        }else{
            var step=ME.vm.changeStep(ME.lastGoPoint,tag,220,22,'screen');
            if(step.stepX>-0.000001&&step.stepX<0.000001&&step.stepY>-0.000001&&step.stepY<0.000001)return;
            if(ME.goAnimate) clearInterval(ME.goAnimate);
            ME.goAnimate=setInterval(function(){
                    var point={x:ME.lastGoPoint.x+step.stepX,y:ME.lastGoPoint.y+step.stepY};
                    ME.lastGoPoint=point;
                    if((tag.screenX-ME.lastGoPoint.x)/step.stepX<1) {
                        // point = {x: tag.screenX, y: tag.screenY};
                        // ME.lastGoPoint = point;
                        clearInterval(ME.goAnimate);
                        ME.goAnimate=0;
                    }
                        ubiMap.pan.draggingByPoint(point);
                },10);
        }
        }

        //获取上次的最后位置
        if (tag.lastPostion) {
            try {
                //监控标签是否进入维度区域
                ubiMap.monitorDimension(tag, tag.lastPostion);
            } catch (e) {
                console.warn(e);
            }
        }
    }
    //记录标签最后一次的位置
    if (tag) tag.lastPostion = { x: data.x, y: data.y, screenX: data.screenX, screenY: data.screenY };
    ME.tags[code] = tag;

}
