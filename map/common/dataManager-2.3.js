/**
 * Created by zwt on 2017/7/24 0024.
 */

ME.maxFlow = {
    limit: 100,
    addLimit: 2,
    counter: 0,
    startTime: 0,
    unit: 0,

};
ME.changeMapNum = 3;

DataManager = window.LibName || {},

    DataManager = function () {
        var maps, mapId, currentMap, currentTags, anchors, tags, fences, fenceType, camera, tagType, tagCat, moreMonitors;
        var tag_changeMap_counter = {};


        /**
         * 显示模式： admin/guest
         * (
         *  admin:管理员模式能看到所有标签，需要登录;
         *  guest: 旅客模式，只能看到指定的标签
         * )
         */
        var showMode, cameras, walls; //admin/guest

        return {
            getDefaultMapId: function () {
                var mapId = 0;
                var storage = window.localStorage && window.localStorage.getItem("mapId");
                if (storage) {
                    mapId = parseInt(storage);
                }
                return mapId;
            },

            isNeedReload:function (data) {
                var queue = tag_changeMap_counter[data.mac];
                if(!queue){
                    tag_changeMap_counter[data.mac] = [data.map];
                    return false;
                }
                if(queue[0] !== data.map){
                    delete tag_changeMap_counter[data.mac];
                    return false;
                }
                queue.push(data.map);
                if(queue.length >ME.changeMapNum){
                    delete tag_changeMap_counter[data.mac];
                    return true;
                }
                return false;
            },

            clearChangeMapCounter:function (data) {
                delete tag_changeMap_counter[data.mac];
            },

            initialize: function (map, $this, func) {
                if (!showMode) {
                    showMode = 'admin';
                }
                var mapId = ME.currentMapId, projectCode = ME.projectCode;
                this.loadBaseDatas(projectCode, $this, func);
                this.loadMaps(projectCode, mapId, $this, func);
            },
            loadCameraModel:function(){
                if(!UBIT.enableCamera) return ;
                $.ajax({
                    method:'get',
                    url:ME.host + '/cameraModel/list',
                    success:function(res){
                        if(!res || res.length < 1 || !(res instanceof Array)){
                            return;
                        }
                        var arr = [];
                        ME.vm.camera.cameraModelList = res;
                        // ME.vm.camera.cameraModelList = res.filter((value,index) => {
                        //     var flag = true;
                        //     if(arr.includes(value.model)){
                        //         flag = false;
                        //     }else{
                        //         arr.push(value.model);
                        //     }
                        //     return flag;
                        // });
                    }
                })
            },

            //匿名通过map获取所有标签
            loadTagsByMap: function (projectCode, mapId, $this, func, convertFunc) {
                $.ajax({
                    url: UBIT.host + "/map/loadTagsByMap?projectCode="+projectCode+"&mapId="+mapId,
                    type:'get',
                    dataType:'json',
                    success: function(json){
                        //console.log(json);
                        if (json && json.hasOwnProperty('msg')) {
                            UBIT.closeSelfPage(json.msg);
                            return;
                        }
                        if (!(json || json.map)) {
                            UBIT.closeSelfPage(lang['loadTagsByMapNote']);
                            return;
                        }
                        currentMap = json.map;
                        ME.user = json.user;
                        ME.api_token = json.user.api_token;

                        if (ME.user.projectDesc) ME.vm.projectDesc = ME.user.projectDesc;

                        if (func) {
                            $this['showMode'] = showMode;
                            $this['currentMap'] = currentMap;
                            $this['mapId'] = currentMap.id;
                            //计算标签的初始位置
                            tags = json.tags.map(function (data, index) {
                                data.markerType = 'tag';
                                data.markerId = data.markerType + '_' + data.code;
                                data.powerLevel = UBIT.getPower(data.power)
                                data.isShow = false;

                                data.tagDisappear=ME.vm.getTagDisappear(data);

                                if (!data.time) return data;

                                var diff = Date.now()-data.time;
                                // console.log(data);
                                if (!ME.tagDisappearTime || ME.tagDisappearTime == 0 || diff < ME.tagDisappearTime) {
                                    data.isShow = true;
                                }

                                return data;
                            });

                            //计算基站的初始位置
                            var anchors = json.anchors.map(function (data, index) {
                                data.markerType = 'anchor';
                                data.markerId = data.markerType + '_' + data.code;
                                data.isShow = true;
                                return data;
                            });

                            func(currentMap, 'currentMap', $this);
                            func([currentMap], 'map', $this);
                            func(currentMap.id, 'mapId', $this);
                            func(showMode, 'showMode', $this);
                            func(tags, 'tag', $this);
                            func(anchors, 'anchor', $this);

                            DataManager.loadFences(currentMap.id, $this, func)
                        }
                    },

                });
            },


            initializeByTags: function (tagCodes, $this, func) {
                showMode = 'guest';
                this.loadMapByTagCode(tagCodes, $this, func);
            },

            loadMapByTagCode: function (tagCodes, $this, func) {
                var params = {tags: tagCodes};
                $.ajax({
                    url: UBIT.host + "/map/loadTagsByCodes",
                    type: 'post',
                    data:params,
                    dataType: 'json',
                    success: function (json) {
                        //console.log(json);
                        if (json && json.hasOwnProperty('msg')) {
                            UBIT.closeSelfPage(json.msg);
                            return;
                        }

                        maps = json.maps;
                        if (!maps || !maps[0]) {
                            UBIT.closeSelfPage(lang['loadMapByTagCodeNote']);
                            return;
                        }
                        for (var i = 0; i < maps.length; i++) {
                            var m = maps[i];
                            m.imgPath = UBIT.getImgSrc('maps', m.filePath);
                        }

                        currentMap = maps[0];

                        currentTags = json.tags;
                        ME.user = json.user;
                        //ME.user.projectCode = 'jiankongzhineng';
                        ME.projectCode = ME.user.projectCode;
                        ME.currentMapId = mapId = currentMap.id;
                        ME.api_token = json.user.api_token;

                        for (var i = 0; i < currentTags.length; i++) {
                            var tag = currentTags[i];
                            tag.markerType = 'tag';
                            tag.markerId = tag.markerType + '_' + tag.code;
                            tag.isShow = true;
                            tag.powerLevel = UBIT.getPower(tag.power)
                            tag.mapName = currentMap.cname;
                        }

                        if (func) {
                            $this['showMode'] = showMode;
                            $this['map'] = maps;
                            $this['currentMap'] = currentMap;
                            $this['mapId'] = currentMap.id;
                            $this['currentTags'] = {data:currentTags};

                            func(showMode, 'showMode', $this);
                            func(maps, 'map', $this);
                            func(currentMap, 'currentMap', $this);
                            func(currentMap.id, 'mapId', $this);
                            func(currentTags, 'currentTags', $this);
                        }

                        DataManager.loadFences(currentMap.id, $this, func)
                    },
                });
            },

            loadBaseDatas: function (projectCode, $this, func) {
                $.ajax({
                    url: UBIT.host + "/mapBaseDatas/list?projectCode="+projectCode,
                    type:'get',
                    dataType:'json',
                    success: function(json){
                        tagCat = json.tagCat;
                        tagType = json.tagType;
                        fenceType = json.fenceType;
                        if (func) {
                            func(tagCat, 'tagCat', $this);
                            func(tagType, 'tagType', $this);
                            func(fenceType, 'fenceType', $this);
                        }
                    },

                });
            },
            //加载互监组
            loadMoreMonitors:function(projectCode, $this, func){
                $.ajax({
                    type:'get',
                    url:UBIT.host + "/moreMonitor/list?projectCode="+projectCode,
                    dataType:'json',
                    success:function(json){
                        // moreMonitors = json.moreMonitors;
                        moreMonitors = json;
                        if (func) {
                            func(moreMonitors, 'moreMonitor', $this);
                        }
                    }
                });
            },

            isFenceTip: function (fence, isIn) {
                if (fence.trif == 'i') {
                    //进入触发
                    if (isIn) return true;
                } else if (fence.trif == 'o') {
                    //出去触发
                    if (!isIn) return true;
                } else {
                    //进出触发
                    return true;
                }
                return false;
            },

            loadMaps: function (projectCode, mapId, $this, func) {
                $.ajax({
                    url: UBIT.host + "/map/list?projectCode="+projectCode,
                    type:'get',
                    dataType:'json',
                    success: function(json){
                        maps = json;//地图信息

                        for (var i = 0; i < maps.length; i++) {
                            var m = maps[i];
                            m.imgPath = UBIT.getImgSrc('maps', m.filePath);
                        }

                        //获取当前地图, 若mapId不存在，取第一个为当前地图
                        mapId ?
                            currentMap = _.find(maps, ['id', parseInt(mapId)]) : currentMap = _.head(maps);
                        if (func) {
                            func(maps, 'map', $this);
                            func(currentMap, 'currentMap', $this);
                            func(showMode, 'showMode', $this);
                            if (currentMap) {
                                func(currentMap.id, 'mapId', $this);
                            } else {
                                func(0, 'mapId', $this);
                            }
                        }
                    },

                });
            },


            loadFences: function (mapId, $this, func, convertFunc,type, cb) {
                if(!convertFunc){
                    var convertFunc = function (position) {
                        var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                        if (!ME.vm.scanActive) {
                            newPos.y += ME.vm.yCenter;
                        }
                        return newPos;
                    };
                }

                var url='';
                if(!type) type='fence'
                switch(type){
                    case 'dimension':url=UBIT.host + "/dimension/list?projectCode="+ME.projectCode+'&mapId='+mapId;break;
                    case 'fence':url=UBIT.host + "/fence/listByAnony?projectCode="+ME.projectCode+'&mapId='+mapId;break;
                }
                $.ajax({
                    // url: UBIT.host + "/fence/listByAnony?projectCode="+ME.projectCode+'&mapId='+mapId,
                    url: url,
                    type:'get',
                    dataType:'json',
                    success: function(json){
                        if(cb) cb(mapId, $this, func, convertFunc);

                        if (json.hasOwnProperty('isOk') && !json.isOk) {
                            console.log(json);
                            // return window.location.reload();
                            return;
                        }
                        //数据转换
                        // fences = json.map(function (data, index) {
                        var types = json.map(function (data, index) {
                            data.savedInDb = true;

                            data.isShow = true;
                            if([UBIT.fenceType.pollingId,UBIT.fenceType.attendanceId,UBIT.fenceType.specialZoneId].includes(parseInt(data.ftypeId))){
                                data.isShow = false;
                            }

                            data.innerTags = {};
                            data.polygonPoints = DataManager.generatePolygonByPoints(data.points, convertFunc);
                            return data;
                        });

                        if (func) {
                            // func(fences, 'fence', $this);
                            func(types, type, $this);
                        }
                    },

                });
            },

            generatePolygonByPoints: function (points, convertFunc) {
                var polygonPoints = [];
                if (points) {
                    var ps = points.split(',');
                    for (var j = 0; j < ps.length; j++) {
                        var p = ps[j];
                        var pos = p.split(' ');
                        //坐标转化
                        var position = {x: parseFloat(pos[0]), y: parseFloat(pos[1])};
                        var newPos = convertFunc(position);

                        polygonPoints.push(newPos)
                    }
                }
                return polygonPoints;
            },

            adjustPosition:function (tag, map, x, y) {
                $.ajax({
                    type: "GET",
                    url: ME.host+"/map/adjustPosition",
                    async:false,
                    data: {mac: tag, map,  x, y},
                    dataType: "json",
                    success: function(datas){
                        console.log(datas);
                    }
                });
            },

            loadNodes: function (mapId, $this, func, convertFunc) {
                $.ajax({
                    url: UBIT.host + "/nodes/list?projectCode="+ME.projectCode+'&mapId='+mapId,
                    type:'get',
                    dataType:'json',
                    success: function(json){
                        if (json.hasOwnProperty('isOk') && !json.isOk) {
                            console.log(json);
                            // return window.location.reload();
                            return;
                        }
                        anchors = json.anchors;
                        tags = json.tags;
                        cameras = json.cameras;
                        walls = json.walls;
                        fences = json.fences;
                        //计算基站的初始位置
                        anchors = json.anchors.map(function (data, index) {
                            data.markerType = 'anchor';
                            data.markerId = data.markerType + '_' + data.code;
                            data.isShow = true;
                            return data;
                        });

                        var now = Date.now();
                        //计算标签的初始位置
                        tags = json.tags.map(function (data, index) {
                            data.markerType = 'tag';
                            data.markerId = data.markerType + '_' + data.code;
                            data.powerLevel = UBIT.getPower(data.power);
                            data.tagDisappear=ME.vm.getTagDisappear(data);
                            data.isShow = false;//标签是否显示

                            if (!data.time) return data;

                            var diff = now - data.time;
                            // 根据是否勾选全选,是，绘画出本地图标签
                            if(ME.vm.tag.showAll){
                                data.isShow = true;
                            }else if(!data.tagDisappear || data.tagDisappear==0 || diff < data.tagDisappear){
                                data.isShow = true;
                            }

                            return data;
                        });
                        //计算围墙的初始位置
                        walls = json.walls.map(function (data, index) {
                            data.markerType = 'wall';
                            data.mapCname = ME.vm.currentMap.cname;
                            data.markerId = data.markerType + '_' + data.id;
                            data.isShow = true;
                            return data;
                        });
                        //计算摄像头的初始位置
                        for (var i = 0; i < cameras.length; i++) {
                            cameras[i].markerType = 'camera';
                            cameras[i].markerId = cameras[i].markerType + '_' + cameras[i].id;
                            cameras[i].isShow = true;
                            //todo
                            cameras[i].savedInDb = true;
                            cameras[i].polygonPoints = DataManager.generatePolygonByPoints(cameras[i].points, convertFunc);
                        }
                        if (func) {
                            func(cameras, 'camera', $this);
                            func(walls, 'wall', $this);
                            func(tags, 'tag', $this);
                            func(anchors, 'anchor', $this);
                        }
                    },

                });
            },

            //获取历史数据
            historyPlayGetDatas:function (mapId, tagMacs, start, end, $this,checkHistoryData){
                $.ajax({
                    type: "GET",
                    url: ME.host+"/history/list",
                    async:false,
                    data: {mapId: mapId, tagMacs: tagMacs, start: start, end: end},
                    dataType: "json",
                    success: function(datas){
                        //验证数据，保存数据,显示控制按钮
                        if(checkHistoryData){
                            checkHistoryData(datas);
                        }
                    }
                });
            },


            //搜索标签或者基站
            searchMarkers:function (name, cb){
                $.ajax({
                    type: "GET",
                    url: ME.host+"/map/searchMarker",
                    async:false,
                    data: {name: name,mapId:ME.vm.currentMap.id,projectId:ME.user.projectId},
                    dataType: "json",
                    success: function(datas){
                        if(cb){
                            cb(datas);
                        }
                    },
                    error: function(...args){
                        console.log(args);
                    }
                });
            },

            /**
             * 统计在1秒内的数据量有多少，如果超过500，则随机的丢掉一些数据，使的每秒的数据保持在500内；
             500可设置，当前设置为100；
             * @param data
             */
            maxFlow: function (data, limitNum) {
                var maxFlow = ME.maxFlow;
                maxFlow.counter++;

                var currentTime = new Date().getTime();
                var unitTime = currentTime - maxFlow.startTime;
                if (maxFlow.startTime < 1 || unitTime > 1000) {
                    maxFlow.startTime = currentTime;
                    maxFlow.counter = 0;
                }

                if (unitTime > 0 && maxFlow.counter / unitTime > limitNum) {
                    console.warn('over max limit(' + limitNum + ')', data);
                    return true;
                }
                return false;
            },
            maxFlowfilter: function (data) {
                return this.maxFlow(data, ME.maxFlow.limit);
            },
            maxAddFlowfilter: function (data) {
                return this.maxFlow(data, ME.maxFlow.addLimit);
            }
        }

    }();


// function dataInit(){
//     //加载围栏的基础数据
//     $.ajax({
//         type: "GET",
//         url: ME.host+"/fenceType/list",
//         async:false,
//         data: {},
//         dataType: "json",
//         beforeSend: function(request) {
//             request.setRequestHeader("api_token", ME.api_token);
//         },
//         success: function(data){
//             ME.fenceType = data;
//         }
//     });
// };
