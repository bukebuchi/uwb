//svg 私有对象方法
var subVue = {
    openVideo: function (cameraId) {
        window.open(UBIT.selfHost + '/super/camera/?cameraId=' + cameraId + '&type=1', cameraId + Date.now(),
            // 'dialogWidth:400px;dialogHeight:300px;center:yes; top=0, left=0, toolbar=no, resizable:yes;status:yes'
            "height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
        );//dialogLeft:200px;dialogTop:150px;
    },
    cameraTableHeaderClick: function cameraTableHeaderClick(column, event) {
        if (column.label.trim() == lang['view']) {
            this.handleCheckAllChange('camera');
        }
    },
    cameraFormatter: function cameraFormatter(row, column) {
        return (new Date(row.addTime)).toLocaleString();
    },
    //点击放大
    zoomEnlarge: function zoomEnlarge(e) {
        // ubiMap.pan.zoomIn(1);
        var point = { x: document.body.clientWidth / 2, y: document.body.clientHeight / 2 };
        ubiMap.pan.applyZoom(1, point);
        e.preventDefault();
    },
    zoomReduce: function zoomReduce(e) {
        var point = { x: document.body.clientWidth / 2, y: document.body.clientHeight / 2 };
        ubiMap.pan.applyZoom(-1, point);
        // ubiMap.pan.zoomOut(1);
        e.preventDefault();
    },
    adjustAnchorStepThree: function () {
        var params = [];
        for (var i = 0; i < this.adjustAnchor.datas.length; i++) {
            var d = this.adjustAnchor.datas[i];
            if (isNaN(d.adjust_x) || 　isNaN(d.adjust_y)) continue;
            params.push({ id: d.id, sourceId: d.sourceId, mac: d.mac, x: d.adjust_x, y: d.adjust_y });
        }

        //submit
        this.adjustAnchor.submitBtnDisable = true;
        ME.vm.$http.post('anchor/adjust', { params: params }).then(function (res) {
            this.adjustAnchor.submitBtnDisable = false;
            var result = res.body;
            if (result.isOk) {

                var screenLength = ubiMap.screenLength;

                var anchors = ME.vm.anchor.data;
                for (var i = 0; i < params.length; i++) {
                    var d = params[i];

                    var screenX = d.x / ME.vm.curRealLength * screenLength;
                    var screenY = d.y / ME.vm.curRealLength * screenLength;

                    //修改vue
                    for (var k = 0; k < anchors.length; k++) {
                        var a = anchors[k];
                        if (a.code == d.code) {
                            a.x = d.x, a.y = d.y;
                            a.screenX = screenX, a.screenY = screenY;
                            break;
                        }
                    }

                    //move marker
                    ubiMap.move('anchor_' + d.code, screenX, screenY);
                }

                this.adjustAnchor.dialog = false;
                this.$alert(lang['successfulCalibration'], lang['prompt']);
            } else {
                this.$alert(lang['calibrationFail'] + result.msg, lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
            }
        });
    },
    updateCameraInnerTags: function updateCameraInnerTags(isIn, tag, camera) {
        // if(tag.alias && tag.alias=='T15' && fence.id==47){
        //     console.log(isIn);
        // }
        if (camera.innerTags[tag.code]) {
            if (!isIn) {
                delete camera.innerTags[tag.code];
            }
        } else {
            if (isIn) {
                camera.innerTags[tag.code] = tag;
            }
        }
    },
    freshCameraInnerTags: function (camera) {
        if (!camera.polygonPoints) {
            return;
        }
        for (var j in ME.tags) {
            var tag = ME.tags[j];
            var isIn = util.isInPolygon2D({ x: tag.screenX, y: tag.screenY }, camera.polygonPoints);
            this.updateCameraInnerTags(isIn, tag, camera);
        }
    },
    historyPlayGo: function (tag, paths) {
        //根据历史数据绘制路径
        // 绘制marker小图标
        var marker = ubiMap.getHisMarker('tag_' + tag.code);
        if (!marker) {
            tag.markerType = "tag";
            tag.markerId = "tag_" + tag.code;
            marker = ubiMap.addHisMarker(tag, ME.vm.curRealLength, ME.vm.scanActive, ME.vm.yCenter);
        }
        // 设置marker坐标位置
         //坐标转化
        var newPos = ubiMap.convert(paths[0], ME.vm.curRealLength);
         //设置坐标
        ubiMap.posInital(marker, newPos, ME.vm.scanActive, ME.vm.yCenter);
        marker.show();

        marker.log = [];
        var positions = [];
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pos = ubiMap.convert(path, ME.vm.curRealLength); //转化
            if (!ME.vm.scanActive) {
                pos.y += ME.vm.yCenter;
            }
            pos.createTime = Date.parse(new Date(path.time));
            pos.code = path.tag;
            marker.log.push({ x: pos.x, y: pos.y });
            positions.push(pos);
        }

        if(this.history.isShowLogs){
            var color = 'red';
            if (tag.cat && tag.cat.color) color = tag.cat.color;
            ubiMap.drawLine(marker, marker.log, color);
        }

        return positions;
    },
    historyAnimate: function historyAnimate() {
        if (this.history.slider >= this.history.max) {
            this.historyStopAnimate();
            return;
        }
        this.history.slider += this.history.step;
        //时间播放 以秒为单位
        this.history.slider = Math.round(this.history.slider / 1000) * 1000;
        var datas = this.history.datas[this.history.slider];
        if (!datas) return;

        var intervalTime = this.history.intervalTime;
        datas.forEach(function (path) {
            var marker = ubiMap.getHisMarker('tag_' + path.code);
            if (!marker) return;
            marker.animate({ transform: "t" + path.x + ',' + path.y }, intervalTime);
        });
    },
    historyClear: function historyClear() {
        var markers = ubiMap.getAllHisMarker();
        //停止动画
        this.historyStopAnimate();
        this.history.slider = this.history.min;
        for (var i in markers) {
            var marker = markers[i];
            //清除路径轨迹
            ubiMap.drawLine(marker, []);
            //隐藏标签
            marker.hide();
            ubiMap.delHisMarker(i);
        }
        this.history.datas = {};
    },
    markerLogClear: function markerLogClear() {
        var markers = ubiMap.getAllMarker();
        for (var i in markers) {
            var marker = markers[i];
            //清除路径轨迹
            marker.log = [];
            ubiMap.drawLine(marker, []);
            // 隐藏心跳图标
            var markerHeart=ubiMap.findInMarker(marker,'heart');
            if(markerHeart){
                markerHeart.remove();
            }
            //隐藏标签
            marker.hide();
        }
    },


    getTagType: function getTagType(id) {
        if (id) {
            for (var i = 0; i < this.tagType.data.length; i++) {
                var item = this.tagType.data[i];
                if (item.id == id) {
                    return item;
                }
            }
        }
        return false;
    },
    getCatType: function getCatType(id) {
        if (id) {
            for (var i = 0; i < this.tagCat.data.length; i++) {
                var item = this.tagCat.data[i];
                if (item.id == id) {
                    return item;
                }
            }
        }
        return false;
    },
    mapChangeImg: function mapChangeImg() {
        if (this.anchor.floatEdit.data.mapId) {
            this.map.data.forEach(function (item) {
                if (item.id == ME.vm.anchor.floatEdit.data.mapId) {
                    ME.vm.anchor.floatEdit.mapImg = UBIT.getImgSrc('maps',item.filePath);
                    return;
                }
            });
        }
    },
    //draw area in map
    setAreaByType: function (e, key, keyType) {
        var typeName = '';

        switch (key) {
            case "fence":
                this.fence[keyType].tagCat = [];
                typeName = lang['fence'];
                break;
            case "camera": typeName = lang['camera']; break;
            case "dimension": typeName = lang['dimension4']; break;
        }
        SysAlert.setWaitMessage(lang['setAreaByTypeNote2'] + typeName + lang['setAreaByTypeNote'], "info", !0, "long"), $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");

        ubiMap.removeUnsavedPolygons(), ubiMap.setplacingStatus("polygon", null, null, null, key);
        this.addHandle(key, e, keyType);
    },
    //  setFence: function setFence(e) {
    //     SysAlert.setWaitMessage("点击界面可以绘制多边形的围栏，按ESC按键可以取消", "info", !0, "long"), $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");
    //
    //     ubiMap.removeUnsavedPolygons(), ubiMap.setplacingStatus("polygon",null,null,null,'fence');
    //     this.addHandle('fence', e);
    // },

    //摄像头
    // addCamera: function addCamera(e) {
    //     //生成添加面板
    //     var edit = ME.vm.camera.floatEdit;
    //     document.getElementById('camera_title').innerText='添加摄像头';
    //     util.emptyObj(edit.data);
    //     edit.visible=true;
    //     //设置添加默认值
    //     edit.data.ip='0.0.0.0';
    //     edit.data.port=5000;
    //     edit.data.mapId=21;
    //     edit.data.x=0;
    //     edit.data.y=0;
    //     edit.data.z=0;
    //     edit.data.initAngleX=0;
    //     edit.data.initAngleY=0;

    // },
    //摄像头删除方法
    cameraDelete: function cameraDelete(event, id) {
        event.preventDefault();
        var key = 'camera'
        var vm = this;
        if (!id) {
            return;
        }

        this.$confirm(lang['deleteCameraNote'], lang['prompt'], {}).then(function () {
            var index = _.findIndex(vm[key].data, ['id', id]);
            var ids = [id];
            service(key).delete({ ids: ids }).then(util.jsonFunc).then(function (json) {
                if (json.isOk) {

                    var delData = vm[key].data.splice(index, 1);
                    ubiMap.delMarker(delData[0]); //delData是删除元素集合
                    CameraTool.deleteCamera(delData[0]);
                }
            }).catch(function (e) {
                console.warn(e);
            });

        });

    },
    getFenceTypeByid: function getFenceTypeByid(id) {
        for (var i = 0; i < this.fenceType.data.length; i++) {
            var item = this.fenceType.data[i];
            if (item.id == id) {
                return item;
            }
        }
        // return null;
        console.log('no fenceType');
    },
    showTip: function showTip(msg, url) {
        this.$alert(msg, lang['prompt'], {
            confirmButtonText: lang['confirm'],
            // dangerouslyUseHTMLString: true,
            callback: function callback() {
                if (url) top.location.href = url;
            }
        });
    },
    showError: function (msg) {
        this.$message.error(msg);
    },
    //获取data
    setNodeData: function setNodeData(data, scan, tags) {
        //无数据，提前结束
        if (!data) {
            return;
        }
        var vm = this;
        var realLength = vm.curRealLength = data.realLength;
        ME.mapWidth = data.pixelLength;
        ME.mapHeight = data.pixelWidth;

        //绘制地图
        ubiMap.setBg(data, scan, tags, realLength);

        //绘制其它基站和标签
        if (scan) {
            var convertFunc = function (position) {
                var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                if (!ME.vm.scanActive) {
                    newPos.y += ME.vm.yCenter;
                }
                return newPos;
            };
            //绘制围栏
            DataManager.loadFences(vm.mapId, this, dataInit, convertFunc, 'fence', DataManager.loadNodes);
            if (UBIT.enableMoreMonitor) {
                DataManager.loadFences(vm.mapId, this, dataInit, convertFunc, 'dimension');
                DataManager.loadMoreMonitors(ME.projectCode, this, dataInit);
            }
            // DataManager.loadNodes(vm.mapId, this, dataInit, convertFunc);
        }
    },
    //设置基站的位置
    setAnchorCoordinate: function () {
        var vm = this;
        var mapId = vm.mapId;

        var edit = vm.anchor.floatEdit.data;
        //判断选择的地图是否是当前地图
        if (vm.mapId != edit.mapId) {
            ME.vm.showTip(lang['cantSetAnchor']);
            return;
        }

        // debugger;
        ubiMap.getPos(true, function (data) {
            for (var key in data) {
                vm.anchor.floatEdit.data[key] = ((data[key] - (ME.vm.currentMap['origin_' + key])) / 100).toFixed(2);
            }
        }, ME.vm.curRealLength, edit, mapId);
    },

    showDistanceFromAllAnchor:function () {
        var refAnchor = this.anchor.floatEdit.data;
        var coord = {x:refAnchor.x*100,y:refAnchor.y*100};
        var anchors = this.anchor.data;

        var goPoints=[];
        for(var i=0;i<anchors.length;i++){
            var a = anchors[i];
            if(refAnchor.id == a.id) continue;
            var distance = (UBIT.getDistance(a, coord)/100).toFixed(2) ;

            var itemPoints=[
                {x:a.screenX,y:a.screenY},
                {x:refAnchor.screenX,y:refAnchor.screenY},
                {distance:distance}
            ];
            goPoints.push(itemPoints);
        }

        //drawLine
        ubiMap.drawStrLine('distanceOfAnchors',goPoints, refAnchor.code+"_distanceOfAnchors", ME.distanceAlertColor);
    },

    clearDistanceFromAllAnchor:function () {
        var anchors = this.anchor.data;

        for(var i=0;i<anchors.length;i++) {
            var a = anchors[i];
            var typeKey=a.mac+'_distanceOfAnchors';
            MarkerTool.clearLine(typeKey);
        }
    },

    //设置摄像头的位置
    setCameraCoordinate: function () {
        var vm = this;
        var mapId = vm.mapId;
        var edit = vm.camera.floatEdit.data;
        //判断选择的地图是否是当前地图(mapIp不存在为添加操作)
        if (vm.mapId != edit.mapId) {
            ME.vm.showTip(lang['cantSetCamera']);
            return;
        }

        // debugger;   获取鼠标点击点坐标
        ubiMap.getPos(true, function (data) {
            for (var key in data) {
                vm.camera.floatEdit.data[key] = parseInt(data[key]);
            }
        }, ME.vm.curRealLength, edit, mapId);
    },

    //设置坐标原点
    setOriginCoordinate: function setOriginCoordinate() {
        $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");
        ubiMap.setplacingStatus("setOrigin", '', '', 'setOrigin');
    },
    //取消设置坐标原点
    originCancel: function originCancel() {
        $("body").css("cursor", "default");
        if (ME.origin) {
            var params = { x: ME.vm.currentMap.origin_x, y: ME.vm.currentMap.origin_y };
            var screenPoint = ubiMap.convert(params, ME.vm.curRealLength);
            var originWh = ME.origin.getBBox();
            // ME.origin.animate({ transform: ["t" + params.x + ',' + params.y,'R',45] }, 200);
            ME.origin.animate({ transform: ["t" + (parseFloat(screenPoint.x) - originWh.width / 2).toString() + ',' + (parseFloat(screenPoint.y) - originWh.height / 2).toString(), 'R', 45] }, 200);
        }
        ubiMap.setplacingStatus('-1');
        this.switchFunc('setOrigin');
        ME.vm.setOrigin.visible = false;
        // ubiMap.move(ME.origin, oPoints.x, oPoints.y, false);

    },
    //保存坐标原点
    originSave: function originSave() {
        var _this = this;
        ME.vm.setOrigin.edit.id = ME.vm.mapId;
        ME.vm.setOrigin.edit.cname = ME.vm.currentMap.cname;
        //数据检查
        if (isNaN(ME.vm.setOrigin.edit.origin_x) || isNaN(ME.vm.setOrigin.edit.origin_y)) {
            // || !data.z
            ME.vm.setOrigin.visible = true;
            _this2.showTip(lang['showTipNote11']);
            return;
        }

        //更新数据库
        var postData = UBIT.deepCopy(ME.vm.setOrigin.edit);
        postData.origin_x = postData.origin_x * 100;
        postData.origin_y = postData.origin_y * 100;
        postData.origin_z = postData.origin_z * 100;

        service('map').update(postData).then(util.jsonFunc).then(function (json) {
            if (json.isOk) {
                //更新数据

                util.emptyObj(ME.vm.setOrigin.edit);
                data = null;
                ME.vm.setOrigin.visible = false;
                _this.switchFunc('setOrigin');
                $("body").css("cursor", "default");
                ubiMap.setplacingStatus('-1');
                //更新原点后操作
                window.location.reload();

            } else {
                ME.vm.showTip(json.msg);
            }
        });


    },
    //取消编辑摄像头回到原位
    cameraFloatEditCancell: function cameraFloatEditCancell() {
        //回到原位
        var edit = this.camera.floatEdit.data;
        this.camera.data.forEach(function (camera) {
            if (camera.id == edit.id) {
                var pos = ubiMap.convert(camera, ME.vm.curRealLength);
                ubiMap.move(edit.markerId, pos.x, pos.y, false);
                return;
            }
        });
        ubiMap.getPos(false);

        // this.camera.floatEdit.visible = false;
        this.camera.floatEdit.visible = !this.camera.floatEdit.visible;

        ubiMap.getPos(false);

        UBIT.emptyObj(this.camera.floatEdit.data);
        this.camera.visible = false;
        ubiMap.escDrawCamera();
    },
    //取消基站编辑
    anchorFloatEditCancell: function anchorFloatEditCancell() {
        //回到原位
        var edit = this.anchor.floatEdit.data;
        this.anchor.data.forEach(function (anchor) {
            if (anchor.code == edit.code) {
                var pos = ubiMap.convert(anchor, ME.vm.curRealLength);
                ubiMap.move(edit.markerId, pos.x, pos.y, false);
                return;
            }
        });
        ubiMap.getPos(false);
        this.anchor.floatEdit.visible = false;
        this.clearDistanceFromAllAnchor();
    },
    //设置坐标
    setCoordinate: function setCoordinate(type) {
        if (type != 'anchor' && type != 'tag') {
            return;
        }

        var editData;
        if (type == 'anchor') {
            editData = this[type].edit;
        }else {
            SysAlert.setWaitMessage("按ESC按键可以取消调整位置", "info", !0, "long");
            editData = this[type].floatEdit.data;
        }

        var vm = this;
        var mapId = this.mapId;

        editData.mapId = this.mapId;
        editData.markerType = type;

        var curMapId = editData.mapId;
        var mapData = _.find(this.map.data, ['id', curMapId]);
        if (mapData) {
            var realLength = mapData.realLength;
        } else {
            ME.vm.showTip(lang['showTipNote8']);
            return;
        }
        // debugger;
        ubiMap.getPos(true, function (data) {
            if(editData.markerType == 'tag'){
                DataManager.adjustPosition(editData.mac, ME.projectCode+'_'+ME.currentMapId, data.x, data.y);
            }
            for (var key in data) {
                editData[key] = parseInt(data[key]);
            }

        }, realLength, editData, mapId);

    },


    // 关闭按钮
    closeBtn: function closeBtn(key, keyType) {
        if(keyType){
            this[key][keyType].visible = false;
        }else {
            this[key].visible = false;
        }

        ubiMap.getPos(false);
        if (key === 'map') {
            this.clearUpload();
        }
        if (key === 'nodes') {
            ubiMap.clearInterimMarker();
        }
    },
    //标签电量显示
    showTagPower: function showTagPower() {
        var allMarkers = ubiMap.getAllMarker();
        for (var m in allMarkers) {
            var marker = allMarkers[m];
            if (marker.flag != 'tag') continue;
            //显示的标签，再判断设置电量显示与否
            if (!marker.node.isShow) { continue }

            var isShow = this.isShowTagPower(marker.node.powerLevel, marker.node.isShow);
            MarkerTool.hidePower(marker, isShow);

        }
    },
    //清空上传做记录
    clearUpload: function clearUpload() {
        // debugger;
        var record = document.getElementById("upload");
        if (record && record.dataset && record.dataset.imgFile) {
            record.dataset.imgFile = "";
        }
        if (record.outerHTML) {
            record.outerHTML = record.outerHTML;
        } else {
            record.value = "";
        }
    },
    // 添加输入框显示
    addHandle: function addHandle(key, event, keyType) {
        event.preventDefault();
        if(keyType){
            util.emptyObj(this[key][keyType]);
            this[key][keyType].visible = true;
        }else {
            util.emptyObj(this[key].edit);
            this[key].visible = true;
        }

        if (key === 'tag' || key === 'anchor') {
            this[key].edit.color = "#3c72df";
        } else if (key === 'fence') {
            this[key].edit.trif = 'io';
            this[key].edit.isRecord = '1';
            this[key].edit.isEmail = '0';
            this[key].edit.isSMS = '0';
            // this[key].allTagsData=ME.vm.tag.data;
        } else if (key === 'camera') {
            //清空编辑框数据（修改时残留）
            util.emptyObj(ME.vm.camera.floatEdit.data);

            ME.vm.camera.floatEdit.data.interfaceAgreement = 'ONVIF';
            ME.vm.camera.floatEdit.data.networkAgreement = 'RTSP';
            ME.vm.camera.floatEdit.data.initAngleX = '0';
            ME.vm.camera.floatEdit.data.rotateMax = '320';

        } else if (key === 'moreMonitor') {
            // this[key].edit.color='#f00';
            //添加操作时，只显示不存在于其他组内的标签
            ME.vm.moreMonitor.edit.model='moreMonitorOne';
            var allAtherGroupMoni = new Set();
            if (ME.vm.moreMonitor.data && ME.vm.moreMonitor.data.length > 0) {
                for (var moreMonitor of ME.vm.moreMonitor.data) {
                    if (!moreMonitor.tags || moreMonitor.tags.length < 1) { continue }
                    for (var tag of moreMonitor.tags) {
                        // allAtherGroupMoni.push(tag.mac)
                        allAtherGroupMoni.add(tag.mac);
                    }
                }
                ME.vm.moreMonitor.allData = ME.vm.tag.data.filter(function (v) {
                    return v.mac && !allAtherGroupMoni.has(v.mac);
                });

            } else {
                ME.vm.moreMonitor.allData = ME.vm.tag.data.concat([]);
            }



        }
        this[key].deleteBtn = false;
        if (key === 'map') {
            this.clearUpload();
        } else {
            this[key].edit.mapId = this.mapId;
        }
    },
    //摄像头操作确认方法
    submitCamera: function submitCamera(key, data, callback, type) {
        // debugger;
        var vm = this;
        var postData = util.deepCopy(data);
        service(key).save(postData).then(util.jsonFunc).then(function (json) {
            if (json.isOk) {

                util.emptyObj(vm.camera.floatEdit);
                data = null;
                vm.camera.floatEdit.visible = false;
                var newCamera = JSON.parse(json.entity);
                if (callback) callback(key, type, postData, newCamera);

            } else {
                // debugger;
                ubiMap.clearInterimMarker();
                ME.vm.showTip(json.msg);
            }
        });
    },
    //保存修改摄像头,确定方式及验证
    cameraSave: function cameraSave(event) {
        var _this = this;
        var edit = _this.camera.floatEdit;
        var data = edit.data;
        var msg = '';
        //标记操作类型
        var type = null;
        if (data.id && data.id > 0) {
            //更新操作
            msg += lang['update']
            type = 'update';
        } else {
            msg += lang['add'];
            type = 'add';
            data.mapId = ME.vm.mapId;
        }
        this.$confirm(lang['confirm'] + msg + lang['cameraSaveNoteAfter'], lang['prompt'], {}).then(function () {
            event.preventDefault();
            if (data && data.id > 0) {
                //更新操作
                //检查数据
                if (!(data.ip || data.id)) {
                    // edit.visible = true;
                    _this.showTip(lang['selectCamera']);
                    return;
                }
            } else if (!data.id) {
                var cameras = CameraTool.getCameras(!0);
                var newCamera = cameras['new'];

                //检查数据
                if (!newCamera || newCamera == {}) {
                    this.showTip(lang['showTipNote25']);
                    return;
                }
                for (var b = "", c = 0; c < newCamera.points.length; c++) {
                    var a = newCamera.points[c];
                    b += a.relX + " " + a.relY + ",";
                }
                data.points = b.substring(0, b.length - 1);
                data.mapId = newCamera.mapId;
            }
            if (!(data.ip || data.port)) {
                _this.showTip(lang['showTipNote5']);
                return;
            }
            _this.submitCamera('camera', data, _this.cameraSubmitAfter, type);
        }).catch(function () {
        });
    },
    cameraSubmitAfter: function cameraSubmitAfter(key, type, data, res) {
        if (key != 'camera') {
            return;
        }
        ME.vm.camera.visible = false;
        if (type == 'add') {

            data.savedInDb = true;
            data.isShow = true;
            data.polygonPoints = DataManager.generatePolygonByPoints(data.points, function (position) {
                var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                if (!ME.vm.scanActive) {
                    newPos.y += ME.vm.yCenter;
                }
                return newPos;
            });

            if (!data.id) {
                /**
                 * 第一个点为摄像头的位置
                 */
                data.id = res.id;
                data.markerType = 'camera';
                data.markerId = data.markerType + '_' + data.id;
                ubiMap.addMarker(data, ME.vm.curRealLength, true);
            }

            // this.freshCameraInnerTags(data);

            ME.vm[key].data.push(data);
            CameraTool.markCameraSaved(data);

            // IndoorSensmap.markersToFront(),
        } else {
            //重新获取后台数据
            var index = _.findIndex(ME.vm[key].data, ['id', data.id]);
            ME.vm[key].data.splice(index, 1, data); //替换
            CameraTool.markCameraUpdate(data);

            res.markerType = key;
            res.markerId = key + '_' + res.id;
            // reDate.isShow = true;
            // ubiMap.delMarker(data); //delData是删除元素集合
            //根据数据更换图标样式
            ubiMap.addMarker(res, ME.vm.curRealLength, ME.vm.scanActive, ME.vm.yCenter);
        }
    },
    nodeSubmitAfter: function nodeSubmitAfter(key, type, data, res) {
        if (key != 'tag' && key != 'anchor' && key != 'camera') {
            return;
        }

        //重新获取后台数据
        var index = _.findIndex(ME.vm[key].data, ['id', data.id]);
        var reDate = JSON.parse(res.entity);
        // reDate.x = (reDate.x / 100).toFixed(2);
        // reDate.y = (reDate.y / 100).toFixed(2);
        reDate.markerType = key;

        if(key == 'camera'){
            reDate.markerId = key + '_' + reDate.id;
        }else {
            reDate.markerId = key + '_' + reDate.code;
        }
        if(key=='tag'){
            reDate.tagDisappear=ME.vm.getTagDisappear(reDate);
        }
        reDate.isShow = true;
        ME.vm[key].floatEdit.data.id = reDate.id;
        ME.vm[key].data.splice(index, 1, reDate); //替换
        // if(key=='tag'){
        ubiMap.delMarker(data); //delData是删除元素集合
        //根据数据更换图标样式
        ubiMap.addMarker(reDate, ME.vm.curRealLength, ME.vm.scanActive, ME.vm.yCenter);
        // }

        //关闭
        ME.vm[key].floatEdit.visible = false;
    },
    tagDelete: function tagDelete(event) {
        event.preventDefault();
        var key = 'tag';
        if (!this[key].edit) {
            return;
        }
        var id = this[key].edit.id;
        var vm = this;

        if (!id) {
            return;
        }

        var index = _.findIndex(vm[key].data, ['id', id]);
        var delData = vm[key].data.splice(index, 1);

        //调删除标签的方法;
        ubiMap.delMarker(delData[0]); //delData是删除元素集合

        util.emptyObj(vm[key].edit);
        vm[key].visible = false;

        // debugger;
        service(key).delete({ id: id }).then(util.jsonFunc).then(function (json) {
            if (!json.isOk) {
                vsn.resetData(vm[key].data, delData[0], index);
                ubiMap.addMarker(delData[0], this.curRealLength, true);
            }
        }).catch(function (e) {
            vsn.resetData(vm[key].data, delData[0], index);
            ubiMap.addMarker(delData[0], this.curRealLength, true);
        });
    },
    //anchor
    anchorSave: function anchorSave(event) {
        var _this2 = this;

        this.$confirm(lang['updateAnchor'], lang['prompt'], {}).then(function () {
            event.preventDefault();
            var key = 'anchor';
            var edit = _this2[key].floatEdit;
            var data = edit.data;


            //检查数据
            // if(data.isMaster===''){
            //     this[key].visible = true;
            //     this.showTip('请选择基站类型');
            //     return;
            // }
            if (data.code == '') {
                edit.visible = true;
                _this2.showTip(lang['showTipNote15']);
                return;
            }
            if (data.alias == '') {
                edit.visible = true;
                _this2.showTip(lang['showTipNote16']);
                return;
            }
            if (data.mapId == '') {
                _this2[key].visible = true;
                _this2.showTip(lang['selectMap']);
                return;
            }
            if (isNaN(data.x) || isNaN(data.y)) {
                // || !data.z
                edit.visible = true;
                _this2.showTip(lang['showTipNote9']);
                return;
            }
            if (isNaN(data.direction) || data.direction < 0 || data.direction > 360) {
                edit.visible = true;
                _this2.showTip(lang['direction'] + " 0 - 360 ");
                return;
            }

            //Vue 上的数据不要随意修改
            var postParams = UBIT.deepCopy(data);
            postParams.x = postParams.x * 100;
            postParams.y = postParams.y * 100;
            postParams.z = postParams.z * 100;

            postParams.x += ME.vm.currentMap.origin_x;
            postParams.y += ME.vm.currentMap.origin_y;
            postParams.z += ME.vm.currentMap.origin_z;

            ubiMap.getPos(false);
            _this2.submit(postParams.sourceId, key, postParams, _this2.nodeSubmitAfter);
        }).catch(function () {
        });
    },

    anchorDelete: function anchorDelete(event) {
        event.preventDefault();
        var key = 'anchor';
        var id = this[key].edit.id;
        var vm = this;

        if (!id) {
            return;
        }

        var index = _.findIndex(vm[key].data, ['id', id]);
        var delData = vm[key].data.splice(index, 1);

        //调删除标签的方法;
        ubiMap.delMarker(delData[0]); //delData是删除元素集合

        util.emptyObj(vm[key].edit);
        vm[key].visible = false;

        // debugger;
        service(key).delete({ id: id }).then(util.jsonFunc).then(function (json) {
            if (!json.isOk) {
                vsn.resetData(vm[key].data, delData[0], index);
                ubiMap.addMarker(delData[0], this.curRealLength, true);
            }
        }).catch(function (e) {
            vsn.resetData(vm[key].data, delData[0], index);
            ubiMap.addMarker(delData[0], this.curRealLength, true);
        });
    },
    //map
    mapSave: function mapSave(event) {
        event.preventDefault();
        var key = 'map';
        var data = this[key].edit;
        var vm = this;

        //TODO
        data.zoneId = 1;

        //检查数据
        if (data.cname == '') {
            this[key].visible = true;
            this.showTip(lang['showTipNote19']);
            return;
        }

        if (data.realLength == '') {
            this[key].visible = true;
            this.showTip(lang['showTipNote20']);
            return;
        }

        //添加地图，必须上传地图
        var upload = document.getElementById("upload");
        var file = upload.files[0];
        if (!data.id) {
            if (!upload || !file) {
                this[key].visible = true;
                this.showTip(lang['showTipNote28']);
                return;
            }
            //上传图片不能为空
            if (!upload.dataset.imgFile || upload.dataset.imgFile === 'undefined') {
                this[key].visible = true;
                this.showTip(lang['showTipNote3']);
                return;
            }

            var imageType = /^image\//;
            if (!imageType.test(file.type)) {
                ME.vm.showTip(lang['showTipNote23']);
                return;
            }
        }

        if (upload && file && upload.dataset.imgFile && upload.dataset.imgFile != 'undefined') {
            //上传图片不能为空
            data.filePath = upload.dataset.imgFile;
            var img = new Image();
            img.src = UBIT.getImgSrc('maps', data.filePath);
            img.onload = function () {
                var length = this.width;
                data.pixelLength = length;
                var flag = vm.judgeValue(data, ['id']);
                if (!flag) {
                    vm[key].visible = true;
                    return;
                }
                vm.submit(data.id, key, data, vm.mapSubmitAfter);
            };
        } else if (data.id > 0) {
            vm.submit(data.id, key, data, this.mapSubmitAfter);
        }
    },
    mapSubmitAfter: function mapSubmitAfter(key, type, data, res) {
        if (key != 'map') {
            return;
        }
        if (type == 'add') {
            data.id = res.id;
            ME.vm[key].data.push(data);
        } else {
            var index = _.findIndex(ME.vm[key].data, ['id', data.id]);
            ME.vm[key].data.splice(index, 1, data); //替换
        }
        ME.vm[key].visible = false;

        //更换当前地图
        this.mapId = data.id;
        this.changeBuild();
    },

    mapClean: function mapClean(event) {
        event.preventDefault();
        util.emptyObj(this['map'].edit);
        this.clearUpload();
    },
    mapDelete: function mapDelete(event) {
        event.preventDefault();
        var key = 'map';
        var id = this[key].edit.id;
        var vm = this;

        if (!id) {
            return;
        }

        var index = _.findIndex(vm[key].data, ['id', id]);
        var delData = vm[key].data.splice(index, 1);

        //调删除地图的方法;
        ubiMap.paperClear();

        util.emptyObj(vm[key].edit);
        vm[key].visible = false;
        data = null;

        // debugger;
        service(key).delete({ id: id }).then(util.jsonFunc).then(function (json) {
            if (!json.isOk) {
                vsn.resetData(vm[key].data, delData[0], index);
                vm.changeBuild();
            }
        }).catch(function (e) {
            vsn.resetData(vm[key].data, delData[0], index);
            vm.changeBuild();
        });
    },
    //fence
    fenceSave: function(event,editKey) {
        event.preventDefault();
        var key = 'fence';
        var data = Object.assign({},this[key][editKey]);
        if(editKey=='pollingEdit'){
            data.ftypeId = UBIT.fenceType.pollingId;
        }else if(editKey=='attendanceEdit'){
            data.ftypeId = UBIT.fenceType.attendanceId;
        }else if(editKey=='specialZone'){
            data.ftypeId = UBIT.fenceType.specialZoneId;
        }else if(editKey=='edit'){
            data.validity=ME.vm.getFenceValidities();
        }

        if(!data.mapId){
            data.mapId = ME.currentMapId;
        }
        if (!data.cname) {
            this[key][editKey].visible = true;
            this.showTip(lang['showTipNote21']);
            return;
        }
        if (!data.ftypeId) {
            this[key][editKey].visible = true;
            this.showTip(lang['selectFenceType']);
            return;
        }
        if (!data.mapId) {
            this[key][editKey].visible = true;
            this.showTip(lang['selectMap']);
            return;
        }

        var fenceType = this.getFenceTypeByid(data.ftypeId);
        data.ftype = fenceType.cname;
        //add operate
        if (!data.id) {
            //添加时默认所有标签都触发
            // if(!data.trif_tags||data.trif_tags.length<1){
            //     for(var i=0;i<ME.vm.tag.data.length;i++){
            //         var item=ME.vm.tag.data[i];
            //         data.trif_tags.push(item.sourceId);
            //     }
            // }
            var fences = FenceTool.getFences(!0);
            var newFence = fences['new'];

            //检查数据
            if (!newFence || newFence == {}) {
                this[key][editKey].visible = true;
                this.showTip(lang['drawFence']);
                return;
            }

            for (var b = "", c = 0; c < newFence.points.length; c++) {
                var a = newFence.points[c];
                b += a.relX + " " + a.relY + ",";
            }
            data.points = b.substring(0, b.length - 1);
        }
        data.tagCat = data.tagCat.join(',');
        this.submit(data.id, key, data, this.fenceSubmitAfter);
        this[key][editKey].visible = false;
        this[key].searchTrifTag = '';
        this[key].edit.trif_tags = [];
        this[key][editKey].cname = '';
        this[key][editKey].tagCat = '';
    },
    //围栏绘制之后操作、维度区域
    fenceSubmitAfter: function fenceSubmitAfter(key, type, data, res) {
        if (key != 'fence' && key != 'dimension') {
            return;
        }
        if (type == 'add') {
            data.id = res.id;
            data.savedInDb = true;
            data.isShow = true;
            data.innerTags = {};
            data.polygonPoints = DataManager.generatePolygonByPoints(data.points, function (position) {
                var newPos = ubiMap.convert(position, ME.vm.curRealLength);
                if (!ME.vm.scanActive) {
                    newPos.y += ME.vm.yCenter;
                }
                return newPos;
            });
            ME.vm[key].data.push(data);
            this.freshFenceInnerTags(data);
            FenceTool.markFenceSaved(data, key);

            // IndoorSensmap.markersToFront(),
        } else {
            //重新获取后台数据
            // var index = _.findIndex(ME.vm[key].data, ['id', data.id]);
            // var index=ME.vm[key].data.find(function(val){
            //     return val.id==data.id;
            // });
            // ME.vm[key].data.splice(index, 1, data); //替换
            for (var i = 0; i < ME.vm[key].data.length; i++) {
                var item = ME.vm[key].data[i];
                if (data.id == item.id) {
                    for (var k in data) {
                        item[k] = data[k];
                    }
                    // ME.vm[key].data.splice(i, 1, item); //替换
                    FenceTool.markFenceUpdate(data, key);
                    return
                }
            }

        }
    },
    //围栏、维度取消
    fenceClean: function (event, type) {
        event.preventDefault();
        util.emptyObj(this[type].edit);
        //取消绘画
        ubiMap.escDrawFence();
        ubiMap.removeUnsavedPolygons();
    },
    //围栏、维度区域删除
    fenceDelete: function fenceDelete(event, fenceId, type) {
        var _this3 = this;
        var msg = '';
        switch (type) {
            case 'fence': msg = lang['fence']; break;
            case 'dimension': msg = lang['dimensionArea']; break;
        }
        this.$confirm(lang['confrimDelete'] + msg + lang['fenceDeleteNoteAfter'], lang['prompt'], {}).then(function () {
            event.preventDefault();
            var key = type;
            if (!_this3[key].edit) {
                return;
            }
            var id = fenceId;
            var vm = _this3;

            if (!id) {
                return;
            }

            var index = _.findIndex(vm[key].data, ['id', id]);
            var delData = vm[key].data.splice(index, 1);

            service(key).delete({ id: id }).then(util.jsonFunc).then(function (json) {
                if (json.isOk) {

                    util.emptyObj(vm[key].edit);
                    vm[key].visible = false;
                    ubiMap.removeUnsavedPolygons();
                    ubiMap.setplacingStatus("-1");

                    FenceTool.deleteFence(delData[0]);
                }
            }).catch(function (e) {
                console.dir(e);
            });
        }).catch(function () {
        });
    },
    formatTagCat: function(row){
        var catName = {};
        ME.vm.tagCat.data.forEach((value) => {
            catName[value.id] = value.cname;
        })
        return row.tagCat.split(',').map((value) => {
            return catName[value];
        }).join(',');
    },
    //维度区域提交保存
    dimensionSave: function dimensionSave(event) {
        event.preventDefault();
        var key = 'dimension';
        var data = this[key].edit;
        if (!data.cname) {
            this[key].visible = true;
            this.showTip(lang['showTipNote7']);
            return;
        }

        if (!data.dim) {
            // this[key].visible = true;
            // this.showTip('请选择维度类型');
            // return;
            data.dim = 'd0';
        }

        if (!data.id) {
            var areas = FenceTool.getFences(!0);
            var newArea = areas['new'];

            //检查数据
            if (!newArea || newArea == {}) {
                this[key].visible = true;
                this.showTip(lang['showTipNote24']);
                return;
            }

            for (var b = "", c = 0; c < newArea.points.length; c++) {
                var a = newArea.points[c];
                b += a.relX + " " + a.relY + ",";
            }
            data.points = b.substring(0, b.length - 1);
        }
        this.submit(data.id, key, data, this.fenceSubmitAfter);
        this[key].visible = false;

    },
    //新增、重置、删除
    doneHandle: function doneHandle(type, key, event) {
        event.preventDefault();
        var data = this[key].edit,
            vm = this,
            id = this[key].edit.id;

        switch (type) {
            case 'save':
                if (key === 'tag' || key === 'anchor') {
                    var flag = vm.judgeValue(data, ['id']);
                    if (!flag) {
                        this[key].visible = true;
                        return;
                    }
                    ubiMap.getPos(false);
                    vm.submit(id, key, data);
                }
                //上传
                if (key === 'map') {
                    this.map.edit.userId = ME.user.id;
                    var flag = vm.judgeValue(data, ['id']);
                    if (!flag) {
                        this[key].visible = true;
                        return;
                    }
                    var upload = document.getElementById("upload");
                    //上传图片不能为空
                    if (upload && upload.dataset && upload.dataset.imgFile) {
                        data.filePath = upload.dataset.imgFile;
                        var img = new Image();
                        img.src = UBIT.getImgSrc('maps', upload.dataset.imgFile);
                        img.onload = function () {
                            var length = this.width;
                            data.pixelLength = length;
                            var flag = vm.judgeValue(data, ['id']);
                            if (!flag) {
                                this[key].visible = true;
                                return;
                            }
                            vm.submit(id, key, data);
                        };
                    } else {
                        if (id === "") {
                            return ME.vm.showTip(lang['showTipNote27']);
                        }
                        vm.submit(id, key, data);
                    }
                }
                this[key].visible = false;
                break;

            case 'clear':
                util.emptyObj(this[key].edit);
                if (key === 'map') {
                    this.clearUpload();
                }
                break;

            case 'delete':
                if (id !== undefined) {
                    //debugger;
                    var index = _.findIndex(vm[key].data, ['id', id]);
                    var delData = vm[key].data.splice(index, 1);
                    var tagIndex = _.findIndex(vm[key].data, ['id', id]);
                    if (key === 'tag' || key === 'anchor') {
                        //调删除标签的方法;
                        ubiMap.delMarker(delData[0]); //delData是删除元素集合
                        vm[key].data.splice(tagIndex, 1);
                    }
                    if (key === 'map') {
                        ubiMap.paperClear();
                    }
                    util.emptyObj(vm[key].edit);
                    vm[key].visible = false;
                    data = null;
                    // debugger;
                    service(key).delete({ id: id }).then(util.jsonFunc).then(function (json) {
                        if (!json.isOk) {
                            vsn.resetData(vm[key].data, delData[0], index);

                            if (key === 'tag' || key === 'anchor') {
                                ubiMap.addMarker(delData[0], this.curRealLength, true);
                                vsn.resetData(vm[key].data, delData[0], tagIndex);
                            } else {
                                vm.changeBuild();
                            }
                        }
                    }).catch(function (e) {
                        vsn.resetData(vm[key].data, delData[0], index);
                        if (key === 'tag' || key === 'anchor') {
                            ubiMap.addMarker(delData[0], this.curRealLength, true);
                        } else {
                            vm.changeBuild();
                        }
                    });
                }
                break;
        }
        //清空上传记录
    },

    //同步坐标
    synPos: function synPos() {
        // debugger;
        var editData = this.nodes.edit;

        var id = editData.markerId;
        if (!id && ubiMap.interimMarker != null) {
            var id = ubiMap.interimMarker[0].id;
        }
        if (id) {
            var realLength = this.curRealLength;
            var newPos = ubiMap.convert(editData, realLength);
            ubiMap.move(id, newPos.x, newPos.y, false);
        } else {
            return;
        }
    },

    // 按钮开关
    switchFunc: function switchFunc(key, e) {
        if (this.power) {
            var status = this.switchData[key];
            switch (key) {
                case 'isShowActiveTag':
                    this.onlyShowActiveTag(status);
                    return;
            }

            status = this.switchData[key] = !this.switchData[key];
            switch (key) {
                case 'tag':
                    ubiMap.toggleTag(status, this.rangeData.value);
                    break;
                case 'grid':
                    ubiMap.toggleGrid(status);
                    break;
                case 'distance':
                    ubiMap.getDistance(status, 'distance');
                    break;
                case 'correctMap':
                    ubiMap.getDistance(status, 'correctMap');
                    break;
                case 'anchor':
                    ubiMap.toggleAnchor(status, this.rangeData.value);
                    break;
                case 'fence':
                    ubiMap.toggleFence(status);
                    break;
                case 'lockTag':
                    if (ME.socketRequest.closed) {
                        webSocketInit('2D', this.curRealLength,
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
                    }
                    ubiMap.setLockTag(status);
                    break;
                case 'lockAnchor':
                    ubiMap.setLockAnchor(status);
                    break;
                case 'power':
                case 'powerAuto':
                    this.showTagPower();
                    break;
                case 'wall':
                    this.showWall(status);
                    break;
                case 'setOrigin':
                    ubiMap.setOrigin(status);
                    break;
                case 'showCamera':
                    this.showCamera(status);
                    break;
                case 'realTimeStatistics':
                    if(!status){
                        this.cancelStatistics();
                    }
                break;
            }
        }
    },
    showCamera: function (status) {
        var cameraDatas = ME.vm.camera.data;
        if (status) {
            cameraDatas.forEach(function (makerData) {
                var marker = ubiMap.getMarker(makerData.markerId);
                marker.show();
            })
            CameraTool.showCameras(cameraDatas[0], cameraDatas);
        } else {
            cameraDatas.forEach(function (makerData) {
                var marker = ubiMap.getMarker(makerData.markerId);
                marker.hide();
            })
            CameraTool.hideCameras(status);
        }
    },
    // showBar:function(event){
    //     var dt = $('#panel');
    //     if(!dt) return;
    //     if(this.showBarAlway){
    //         dt.css('opacity',1);
    //         return;
    //     }
    //     if(event.type === 'mouseleave') {
    //         dt.css('opacity',0);
    //     } else {
    //         dt.css('opacity',1);
    //     }
    // },

}


//svg 私有计算属性
var subWatch = {

    'markerId': function markerId(newVal) {
        if (this.markerId !== -1 && this.markerType) {
            data = _.find(this[this.markerType].data, ['sourceId', newVal]);
            if (data) {
                ubiMap.addMarker(data, this.curRealLength, true);
            }
            this.markerId = -1;
            this.markerType = null;
        }
    },

    'nodes.edit.x': function nodesEditX() {
        // debugger;
        var vm = this;
        vm.synPos();
    },
    'nodes.edit.y': function nodesEditY() {
        // debugger;
        var vm = this;
        vm.synPos();
    },
    'switchData.isShowTagTypes': function isShowTagTypes(val) {
        if(this.switchData.isShowActiveTag){
            return;
        }
        console.log(val);
        //隐藏所有
        this.handleCheckAllChange('tag', false);
        //显示指定tagType的标签
        this.showTagByTypesAndCats(true);

    },
    'switchData.isShowTagCats': function isShowTagCats(val) {
        if(this.switchData.isShowActiveTag){
            return;
        }
        console.log(val);
        //隐藏所有
        this.handleCheckAllChange('tag', false);
        //显示指定tagType的标签
        this.showTagByTypesAndCats(true);
    },





    // 'nodes.data': {
    //     handler: function(newVal, oldVal) {
    //         var tempArr1 = [],
    //             tempArr2 = [],
    //             vm=this;
    //         newVal.forEach(function(obj, ind){
    //             var type = parseInt(obj.type);
    //             if(type === 1) {
    //                 tempArr1.push(obj);
    //                 ubiMap.addMarker(obj, vm.curRealLength);
    //             } else if(type === 2) {
    //                 tempArr2.push(obj);
    //                 ubiMap.addMarker(obj, vm.curRealLength);
    //             }
    //         });
    //         this.nodes.anchorData = tempArr1;
    //         this.nodes.tagData = tempArr2;
    //         tempArr1 = tempArr2 = null;
    //     },
    //     deep: true
    // },
}
