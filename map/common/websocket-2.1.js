/**
 *  common webSocket:  map2d map3d map2dV2
 * @param mapId
 * @param realLength
 * @param scan
 * @param yCenter
 */
ME.socketRequest = null;
ME.intervalTime = 20;
ME.reconnectTime = 3000;
ME.messageData = [];


/**
 * @param model
 * @param realLength
 * @param methods   //methods: {msgType:method}
 * @param types //'_type|fenceAlert|sos|power';
 */
function webSocketInit(model, realLength, methods, types) {
    //检查浏览器是否支持WebSocket
    if (!window.WebSocket) {
        alert(lang['nonsupportWebSocket']);
        return;
    }

    if (ME.socketRequest && !ME.socketRequest.closed) {
        return;
    }

    //创建随机值
    var socketUrl;
    var tagMacs = getCurrentTags();
    var typestr = '';
    if(types){
        typestr += '_type';
        for(var i=0;i<types.length;i++){
            typestr += '|'+types[i];
        }
    }
    if (tagMacs) {
        socketUrl = ME.websocketUrl + "/websocket/tag_" + tagMacs + "_" + model + ME.api_token + typestr;
    } else {
        socketUrl = ME.websocketUrl + "/websocket/" + ME.projectCode + "_" + ME.currentMapId + "_" + model + ME.api_token + typestr;
    }
    ME.socketRequest = new WebSocket(socketUrl);
    ME.socketRequest.onopen = function (event) {
        if (ME.socketRequest) {
            ME.socketRequest.open && ME.socketRequest.open(event, this);
            ME.socketRequest.closed = false;
            // setInterval(function (){
            //     socketRequest.send('are you ok?');
            //     console.log(socketRequest.readyState);
            // }, 3000);
        }
    }

    ME.socketRequest.onmessage = onmessage;

    //每间隔250ms 获取一次数据
    setInterval(function () {
        // 数据推动移动
        messOnData();

        //标签定时消失
        if(typeof intervalTagDisappear != 'undefined'){
            intervalTagDisappear();
        };

        // 检查距离测量状态
        if(methods.clearHalo) {
            methods.clearHalo('distanceAlert');
            methods.clearHalo('moreMonitor');
            // methods.clearHalo('forceRemove');
        };

        if (ME.canvas) {
            ME.canvas.renderAll();
        }

    }, ME.intervalTime);


    ME.socketRequest.onerror = function (event) {
        console.log(event);
        //错误重连
        ME.socketRequest.error && ME.socketRequest.error(event, this);
        if(ME.socketRequest.connect)ME.socketRequest.connect();
    };

    ME.socketRequest.onclose = onclose;


    function messOnData(){
        for (var key in ME.messageData) {
            var datas = ME.messageData[key];

            if (!datas || datas.length < 1) continue;

            //todo get the last data
            var data = datas[datas.length - 1];

            // if(data && data.mac=='21010000') {
            //     console.log(data.mac, data.x, data.y);
            // }
            // return;

            //标签不能越界
            outMapCheck(data, realLength);

            //标签移动，围栏监控
            methods.coord(data, realLength);

        }
        //清空数组
        ME.messageData = [];
    }
    function onmessage (event){
        try {
    
            var data;
            try{
                data = JSON.parse(event.data);
            }catch(e){
                console.warn(data, e);
                return;
            }
            if (!data) return;
            //过滤 currentTags
            if (ME.anony && ME.anony != 'super' && ME.vm.currentTags && ME.vm.currentTags.data.length > 0) {
                var isExist = false;
                for (var i = 0; i < ME.vm.currentTags.data.length; i++) {
                    var t = ME.vm.currentTags.data[i];
                    if (t.mac == data.mac) {
                        isExist = true;
                        break;
                    }
                }
    
                if (!isExist) {
                    return;
                }
            }
    
    
            //检查消息类型
            if (!data.hasOwnProperty('msgType')) {
                console.error('error data:', data);
                return;
            }
            if(UBIT.enableAutoCamera){
                var typeArr = ['sos','fenceAlert'];
                if(typeArr.includes(data.msgType)){
                    var autoCamera = localStorage.getItem('autoCamera') || '{}';
                    var autoCameraObj = JSON.parse(autoCamera);
                    if(autoCameraObj[data.code]){
                        return console.log('当前标签已经自动打开');
                    }
                    commonVue.followTagVideo(data.code);
                    var obj = {
                        [data.code]:true
                    };
                    localStorage.setItem('autoCamera',JSON.stringify(obj));
                }
            }
            var mtd = methods[data.msgType];
            if(!mtd) {
                return;
            }
            var alertTypes = ['sos','forceRemove','lifeStatus','fenceAlert','moreMonitorAlert','distanceAlert','powerAlert','heartAlert','aggregateAlert','stillnessAlert'];
            if(alertTypes.indexOf(data.msgType) !== -1){
                mtd(data);
                return;
            }
            // if (
            //         data.msgType == 'sos'       //sos 报警
            //     || data.msgType == 'forceRemove' //强拆 报警
            //     || data.msgType == 'lifeStatus'
            //     || data.msgType == 'fenceAlert'
            //     || data.msgType == 'moreMonitorAlert'
            //     || data.msgType == 'distanceAlert'//距离报警
            //     || data.msgType == 'powerAlert'
            //     || data.msgType == 'heartAlert'
            //     || data.msgType == 'aggregateAlert'
            //     ) {

            // }


            //coord 定位
            if (data.msgType == 'coord') {
                if (!ME.messageData[data.mac]) {
                    ME.messageData[data.mac] = [];
                }
                if (data.map.split('_')[0] === 'slairport') {
                    data.power = 100;
                }
                //存储数据到队列
                ME.messageData[data.mac].push(data);
                return;
            }


        } catch (e) {
            console.warn(e)
        }
    }
    
    function onclose (event){
        console.log(event);
        ME.socketRequest.closed = true;
        if (ME.vm.switchData) {
            ME.vm.switchData.lockTag = true;
        }
        if (ubiMap && ubiMap.setLockTag) {
            ubiMap.setLockTag(false);
        }

        //关闭重连
        var id = setTimeout(function(){
            if(ME.socketRequest.closed === false){
                clearInterval(id);
            }
            ME.socketRequest = new WebSocket(socketUrl);
            ME.socketRequest.onopen = function(event){
                ME.socketRequest.closed = false;
            }
            ME.socketRequest.onmessage = onmessage;
            ME.socketRequest.onclose = onclose;
        },ME.reconnectTime)
    }
}



//超出地图检测
function outMapCheck(param, realLength) {
    param.x = param.x && param.x > 0 ? param.x : 0;
    param.y = param.y && param.y > 0 ? param.y : 0;

    var realHeight = realLength * (ME.mapHeight / ME.mapWidth);
    param.x = param.x < realLength ? param.x : realLength;
    param.y = param.y < realHeight ? param.y : realHeight;

    return param;
};


function getCurrentTags() {
    if (ME.vm && ME.vm.currentTags) {
        var tagMacs = [];
        for (var i = 0; i < ME.vm.currentTags.data.length; i++) {
            var tag = ME.vm.currentTags.data[i];
            if (tag.mac) {
                tagMacs.push(tag.mac);
            }
        }
        return tagMacs.join(',');
    }
    return false;
}
