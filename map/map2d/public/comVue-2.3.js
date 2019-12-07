//公共对象方法
var commonVue={
    // fenceStChangeTimeSpan: function (e, timeSpan) {
    //     var sd = new Date().getTime() - timeSpan[0] * 3600 * 1000 * 24;
    //     var ed = new Date().getTime() - timeSpan[1] * 3600 * 1000 * 24;
    //     this.statis.fenceStatisAttr.stime = new Date(sd).Format('yyyy-MM-dd hh:mm:ss');
    //     this.statis.fenceStatisAttr.etime = new Date(ed).Format('yyyy-MM-dd hh:mm:ss');
    //     // var who=e.target;
    //     var who=e.currentTarget;
    //     var sib=$(who).parent('.total_date').children('span');
    //     for(var i=0;i<sib.length;i++){
    //         $(sib[i]).removeClass('active');
    //     }
    //     $(who).addClass('active');
    // },

    /**
     * @param {string} cameraId 相机id
     * type 1 表示 跟随打开，2表示直接打开
     *
     */
    openVideo: function (cameraId) {
        window.open(UBIT.selfHost + '/super/camera/?cameraId=' + cameraId + '&type=1', cameraId + Date.now(),
            // 'dialogWidth:400px;dialogHeight:300px;center:yes; top=0, left=0, toolbar=no, resizable:yes;status:yes'
            "height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
        );//dialogLeft:200px;dialogTop:150px;
    },

    showHeartRateLine: function () {
        var mac = ME.vm.tag.qrcode.mac;
        window.open(UBIT.selfHost + '/super/heartRate/?tag=' + mac,  mac + Date.now(),
            // 'dialogWidth:400px;dialogHeight:300px;center:yes; top=0, left=0, toolbar=no, resizable:yes;status:yes'
            "height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
        );//dialogLeft:200px;dialogTop:150px;
    },

    followTagVideo: function (mac) {
        mac = ME.vm.tag.qrcode.mac;
        // window.open('http://localhost/','test',"height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
        var url = UBIT.selfHost + '/super/camera/?cameraId=0&type=follow&mac=' + mac;
        var child = window.open(url, mac + Date.now(),
            // 'dialogWidth:400px;dialogHeight:300px;center:yes; top=0, left=0, toolbar=no, resizable:yes;status:yes'
            "height=600, width=800, top=60, left=300, center:true，toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
        );//dialogLeft:200px;dialogTop:150px;
        var id = setInterval(() => {
            if(child.closed){
                clearInterval(id);
                var autoCamera = localStorage.getItem('autoCamera') || '{}';
                var obj = JSON.parse(autoCamera);
                if(obj[mac]){
                    delete obj[mac];
                    localStorage.setItem('autoCamera',JSON.stringify(obj));
                }
            }
        },1000);
    },

    setCamera: function setCamera(e) {
        //提示取消，改变样式
        SysAlert.setWaitMessage(lang['drawCameraNote'], "info", !0, "long"), $("body").css("cursor", "crosshair"), vsn.highlight("#mapSvg");

        ubiMap.removeUnsavedPolygons(),
            ubiMap.setplacingStatus("polygon", null, null, null, 'camera');
        this.addHandle('camera', e);
    },
    getCameraList : function(e){
        var url = UBIT.host + '/camera/getCameraOnlineList';
        var self = this;
        this.camera.listLoading = true;
        this.$http.get(url,{_timeout:10000}).then(function(res) {
            self.camera.cameraList = res.body;
            self.camera.listLoading = false;
        })
    },
    showCameraList: function(e){
        this.camera.showCameraList = true;
        this.getCameraList();
    },
    // fenceGetStatisData:function(e,timeSpan){
    //     //设置时间段
    //     if(timeSpan){
    //         this.fenceStChangeTimeSpan(e,timeSpan);
    //     }
    // //  根据参数查询统计
    //     var data=ME.vm.statis.fenceStatisAttr;
    //     if(!data||!data.fenceId||!data.trif){
    //         this.showTip('参数不完整');
    //     }
    //     var url='https://data.jianshukeji.com/jsonp?filename=json/usdeur.json&callback=?';
    //     $.ajax({
    //         type:'post',
    //         url:url,
    //         data:data,
    //         dataType:'json',
    //         success:function(data){
    //             console.log(data,'sdkjfhkjshdkf');
    //             ME.vm.statis.series[0].data=data;
    //             $('#statis').highcharts(ME.vm.statis);
    //         }
    //     });
    // //     console.log(ME.vm.statis.fenceStatisAttr,'ksjdhfkjhk');
    // },
    tagTableHeaderClick: function tagTableHeaderClick(column, event) {
        if(this.switchData.isShowActiveTag){
            return;
        }
        if (column.label.trim() == lang['view']) {
            this.handleCheckAllChange('tag');
        }
    },

    mapIsMiss: function mapIsMiss() {
        this.$alert(lang['mapLoadFail'], lang['prompt'], {
            confirmButtonText: lang['confirm'],
            callback: function callback() {
                // top.location.href = "../../../super/index/";
            }
        });
    },

    anchorTableHeaderClick: function (column, event) {
        if (column.label.trim() == lang['view']) {
            this.handleCheckAllChange('anchor');
        }
    },

    tagPowerFormatter: function tagPowerFormatter(row, column) {
        return row.powerLevel ? row.powerLevel + '%' : '';
    },
    tagLastPosTimeFormatter: function tagLastPosTimeFormatter(row, column) {
        if (row.time) {
            return new Date(row.time).toLocaleString();
        }
        return '0';
    },

    tagCatFormatter: function tagCatFormatter(row, column) {
        return row.cat ? row.cat.cname : '';
    },



    entry3DMap: function entry3DMap() {
        window.location.href = this.selfHost + '/map/map3d/';
    },

    go2Tplatform: function go2Tplatform() {
        var curMap=ME.projectCode+'_'+ME.vm.currentMap.id;
        if(!curMap){return}
        localStorage.setItem('tplaformMap',curMap);
        window.open(this.selfHost + '/tplatform/index/');
    },


    //基站校准
    adjustAnchorOperate: function (step) {
        switch(step){
            case -1:
                this.adjustAnchor.activeName = parseInt(this.adjustAnchor.activeName)-1 + '';
                return;
            case 1:
                this.adjustAnchorStepOne();
                return;
            case 2:
                this.adjustAnchorStepTwo();
                return;
            case 3:
                this.adjustAnchorStepThree();
                return;
            default:
                return;
        }
    },

    adjustAnchorStepOne:function(){
        if(this.adjustAnchor.selects.length!=2){
            return ME.vm.showError(lang['adjustAnchorStepOneNote']);
        }
        this.adjustAnchor.adjustAnchorStepOneBtn = true;
        //获取两参考基站之间的tof距离
        this.adjustAnchor.refCalDistance = UBIT.getDistance(this.adjustAnchor.selects[0],this.adjustAnchor.selects[1]);
        ME.vm.$http.post('super/anchor/getAnchorsDistance', {source:this.adjustAnchor.selects[0].mac, target:this.adjustAnchor.selects[1].mac}).then(function (res) {
            this.adjustAnchor.adjustAnchorStepOneBtn = false;
            var result = res.body;
            if (result.isOk) {
                this.adjustAnchor.refRealDistance = result.distance  * 100 ;
                this.adjustAnchor.refErrorDistance = this.adjustAnchor.refRealDistance - this.adjustAnchor.refCalDistance;
                this.adjustAnchor.activeName = '2';

            } else {
                var msg = '';
                if(result.msg){
                    msg = result.msg;
                    if(msg.msg){
                        msg = msg.msg;
                    }
                }
                this.$alert( lang['calibrationFail'] + msg, lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
            }
        });
    },

    adjustAnchorStepTwo:function(){
        var refcal = parseFloat(this.adjustAnchor.refCalDistance);
        var refMin = refcal*0.9, refMax = refcal*1.1;

        if( refMin > this.adjustAnchor.refRealDistance || refMax < this.adjustAnchor.refRealDistance){
            return ME.vm.showError(lang['adjustAnchorStepTwoNote']);
        }

        var err = Math.abs(parseFloat(this.adjustAnchor.refErrorDistance));
        if(err > 10){
            var self = this;
            this.$confirm(lang['adjustAnchorStepTwoNote2']+err+lang['adjustAnchorStepTwoNote3'], lang['prompt'], {}).then(function () {
                self.adjustAnchorStepTwoThen(self);
            }).catch(function () {
            });
        }else {
            this.adjustAnchorStepTwoThen(this);
        }
    },

    adjustAnchorStepTwoThen: function (self) {
        //计算各个其它基站到参考基站的距离
        //基站， 当前坐标， 参考基站1， 参考基站2，校准坐标
        self.adjustAnchor.datas = [];

        var r0 = self.adjustAnchor.selects[0];
        var r1 = self.adjustAnchor.selects[1];
        for (var i=0;i<self.anchor.data.length;i++){
            var a = self.anchor.data[i];
            if(a.mac == r0.mac || a.mac == r1.mac) continue;
            var c = UBIT.deepCopy(a);
            c.calcDistance0 = UBIT.getDistance(c,r0);
            c.calcDistance1 = UBIT.getDistance(c,r1);
            c.xy = c.x +','+c.y;
            self.adjustAnchor.datas.push(c);
        }
        self.adjustAnchor.activeName = '3';
    },


    adjustAnchorSelectionChange:function(rows){
        this.adjustAnchor.selects = rows;
    },


    adjustAnchorDo:function(row, event){
        console.log(row);
        var source = row.mac;
        var r0 = this.adjustAnchor.selects[0];
        var r1 = this.adjustAnchor.selects[1];
        var anchorList = [];
        anchorList.push({source:source, target:r0.mac});
        anchorList.push({source:source, target:r1.mac});

        ME.vm.$http.post('super/anchor/getListAnchorsDistance', {anchorList:anchorList}).then(function (res) {
            var result = res.body;
            console.log(result);

            var dis0, dis1;
            for(var i=0;i<result.length;i++){
                var t = result[i];
                if(t.target == r0.mac){
                    dis0 = t.distance * 100;//Math.round(,2);
                }else if(t.target == r1.mac){
                    dis1 = t.distance * 100;//,2);
                }
            }
            if(!dis0 || !dis1) {
                ME.vm.showTip(lang['showTipNote6']);
                return;
            }

            row.calcDistance0 += '&'+ dis0;
            row.calcDistance1 += '&'+ dis1;

            //计算校准坐标
            r0.r = Math.sqrt(dis0 * dis0 - Math.pow(r0.z - row.z, 2));
            r1.r = Math.sqrt(dis1 * dis1 - Math.pow(r1.z - row.z, 2));
            var point = UBIT.getIntersectionPoints(r0, r1, row);

            if(point){
                row.adjust_x = point.x;
                row.adjust_y = point.y;
                row.adjust_xy = point.x +','+ point.y;
            }

            delete r0['r'];
            delete r1['r'];
        });

        // this.$prompt('请顺序输入基站（'+row.code+'）与参考基站1、2之间的距离(cm)，并与以英文逗号“,”隔开', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        // }).then(function (obj) {
        //     var value = obj.value;
        //     if(value.indexOf(',')<0){
        //         this.$message({
        //             type: 'error',
        //             message: '请顺序输入基站（'+row.code+'）与参考基站1、2之间的距离，并与以英文逗号“,”隔开'
        //         });
        //         return ;
        //     }
        //
        // }).catch(function (){
        //
        // });
    },

    updateFenceInnerTags: function updateFenceInnerTags(isIn, tag, fence) {
        if (fence.innerTags[tag.code]) {
            if (!isIn) {
                delete fence.innerTags[tag.code];
            }
        } else {
            if (isIn) {
                fence.innerTags[tag.code] = tag;
            }
        }
    },

    freshAllFenceInnerTags: function freshAllFenceInnerTags(type) {
        for (var i = 0; i < this[type].data.length; i++) {
            var f = this[type].data[i];
            this.freshFenceInnerTags(f);
        }
    },
    freshFenceInnerTags: function freshFenceInnerTags(fence) {
        if (!fence.polygonPoints) {
            return;
        }
        for (var j in ME.tags) {
            var tag = ME.tags[j];
            var isIn = util.isInPolygon2D({x: tag.screenX, y: tag.screenY}, fence.polygonPoints);
            this.updateFenceInnerTags(isIn, tag, fence);
        }
    },

    /*
    * 历史记录操作相关方法（new）
    * 2018_03_17
    * */

    //获取历史数据
    historyBegin:function (){
        var params = this.history;
        //组装查询参数
        var timeSpan = this.historyTimeRange();
        if (!timeSpan) {
            return;
        }

        //请选择标签
        if (!this.history.tags || this.history.tags.length < 1) {
            this.showTip(lang['selectTag']);
            return;
        }
        this.history.isLoading = true;
        DataManager.historyPlayGetDatas(this.mapId, this.history.tags, timeSpan[0], timeSpan[1], this, this.checkHistoryData);
    },
    checkHistoryData:function(datas){
        //判断有无数据
        if (!datas || _.isEmpty(datas)) {
            this.showTip(lang['historyNullData']);
            this.historyClear();
            this.history.isShow = false;
        }else {
            //将数据保存，后续操作取数据
            var params = this.history;
            params.intervalTime = 1000;

            //停止websocket
            ubiMap.lockTag = true;
            //隐藏所有的allMarker
            this.markerLogClear();
            this.history.isShow = true;
            //clear laste play
            this.historyClear();
            //存储历史记录数据，按照时间分组
            var newDatas = {};

            for (var code in datas.datas) {
                if(!code) continue;

                var paths = datas.datas[code].paths;
                if (paths && paths.length > 0) {
                    var tag = this.getNodeByCode('tag', code);
                    if(tag){
                        var positions = this.historyPlayGo(tag, paths);
                        //sort data
                        for (var i = 0; i < positions.length; i++) {
                            var pos = positions[i];
                            var t = pos.createTime;
                            if (!newDatas[t]) {
                                newDatas[t] = [];
                            }
                            newDatas[t].push(pos);
                        }
                    }
                }
            }
            this.history.datas = newDatas;

            this.history.slider = this.history.min = new Date(datas.minTime).getTime();
            this.history.max = new Date(datas.maxTime).getTime();

            this.historyPlay('play')
        }
        this.history.isLoading = false;
    },



    historyTimeRange: function historyTimeRange() {
        var range = this.history.datetimeRange;
        if (!range[0] || !range[1]) {
            this.showTip(lang['selectDateRange']);
            return false;
        }

        //更新 slider max and min
        this.history.slider = this.history.min = range[0].getTime();
        this.history.max = range[1].getTime();
        var span = this.history.max - this.history.min;
        //时间范围 1秒 -  7天;
        if (span < 1) {
            this.showTip(lang['showTipNote']);
            return false;
        } else {
            if (span > 7 * 24 * 3600 * 1000) {
                this.showTip(lang['showTipNote2']);
                return false;
            }
        }
        var start = range[0].Format('yyyy-MM-dd hh:mm:ss');
        var end = range[1].Format('yyyy-MM-dd hh:mm:ss');
        return [start, end];
    },


    historySlider: function historySlider(num) {
    },
    historyPlay: function historyPlay(type) {
        var params = this.history;
        if (type == 'play') {
            params.intervalTime = Math.round(params.intervalTime );/// 4
            if (this.history.model == 'pause') {
                this.historyReStartAnimate();
            }else {
                this.historyStartAnimate();
            }
        } else if (type == 'pause') {

            this.historyStopAnimate();
        } else if (type == 'stop') {
            //开启websocket
            ubiMap.lockTag = false;
            //显示所有的allMarker
            if(ubiMap.toggleCamera) ubiMap.toggleCamera(true);
            ubiMap.toggleTag(true);
            ubiMap.toggleAnchor(true);
            //清除历史轨迹，隐藏历史标签
            this.historyClear();
            // this.history.isFirst=true;
            this.history.isShow = false;
        } else if (type == 'backward') {
            if (params.intervalTime < params.max) {
                params.intervalTime = Math.round(params.intervalTime * 2);
            }
            this.historyReStartAnimate();
        } else if (type == 'forward') {
            if (params.intervalTime > 0) {
                params.intervalTime = Math.round(params.intervalTime / 2);
            }
            this.historyReStartAnimate();
        }

        this.history.model = type;
    },
    historySliderMsg: function historySliderMsg(val) {
        var date = new Date(val);
        return date.Format('yyyy-MM-dd hh:mm:ss');
    },


    historyStartAnimate: function historyStartAnimate() {
        ME.vm.intervalID = setInterval(function () {
            ME.vm.historyAnimate();
        }, ME.vm.history.intervalTime);
    },
    historyReStartAnimate: function historyReStartAnimate() {
        this.historyStopAnimate();
        this.historyStartAnimate();
    },
    historyStopAnimate: function historyStopAnimate() {
        //停止动画
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = 0;
        }
    },

    // // },
    //type: tag, anchor
    handleCheckAllChange: function (type, isShow) {
        var isShowAll;
        if(isShow === true || isShow === false){
            isShowAll = isShow;
        }else {
            isShowAll = !this[type].showAll;
        }
        this[type].showAll = isShowAll;
        this[type].data.forEach(function (item) {
            ME.vm.handleCheckChange(type, item, isShowAll);
        });
    },

    showTagByTypesAndCats: function (isShow) {
        var type = 'tag';
        var tagTypes = this.switchData.isShowTagTypes;
        var cats = this.switchData.isShowTagCats;
        this[type].showAll = false;
        this[type].data.forEach(function (item) {
            if(tagTypes.indexOf(parseInt(item.typeId))>-1 && cats.indexOf(parseInt(item.catId))>-1){
                ME.vm.handleCheckChange(type, item, isShow);
            }
        });
    },

    onlyShowActiveTag:function (flag) {
        if(flag){
            //tagle isShow, and hide all
            this['tag'].data.forEach(function (item) {
                ME.vm.handleCheckChange('tag', item, false);
            });
        }
    },

    fenceShowAllTaggle:function(ftype){
        var isShowAll = ME.vm.fence[ftype].showAll = !ME.vm.fence[ftype].showAll;
        var ftypeId;
        if(ftype=='pollingEdit'){
            ftypeId = UBIT.fenceType.pollingId;
        }else if(ftype=='attendanceEdit'){
            ftypeId = UBIT.fenceType.attendanceId;
        }else if(ftype=='specialZone'){
            ftypeId = UBIT.fenceType.specialZoneId;
        }
        if(!ftypeId) return;
        ubiMap.toggleFence(isShowAll, ftypeId);
    },

    fenceShowTaggle:function(f, def){
        if (def != void 0) {
            f.isShow = def;
        }
        if (f && f.fenceDrawing && f.fenceDrawing.entireSet) {
            f.isShow ? f.fenceDrawing.entireSet.show() : f.fenceDrawing.entireSet.hide();
        }
    },

    handleCheckChange: function handleCheckChange(type, item, def) {
        if (def != void 0) {
            item.isShow = def;
        }
        ubiMap.toggleNode(item.markerId, item.isShow);
    },

    selectOne:function(key,item){
        if(this.switchData.isShowActiveTag){
            item.isShow = !item.isShow;
            return;
        }
        ubiMap.toggleNode(item.markerId, item.isShow);
    },

    handSelect:function(data){
    },
    //根据id 获取节点数据
    getNodeByCode:function(key, code){
        var datas = this[key].data;
        for(var i=0;i<datas.length;i++){
            if(datas[i].code+'' === code+''){
                return datas[i];
            }
        }
        return null;
    },

    //根据id 获取节点数据
    getNodeById:function(key, id){
        var datas = this[key].data;
        for(var i=0;i<datas.length;i++){
            if(datas[i].id+'' === id+''){
                return datas[i];
            }
        }
        return null;
    },









    projectManage: function projectManage() {
        top.location.href = ME.selfHost + "/super/index/";
    },


    // 设置对象值
    setValue: function setValue(setData, getData, keyList, int2str) {
        for (var key of Object.keys(setData)) {
            if (_typeof(setData[key]) === 'object') {
                var callee = this.setValue;
                callee(setData[key], getData, callee.keyList ? callee.keyList.push(key) : [key]);
            } else {
                if (keyList) {
                    var prevKey = keyList.join('.');
                    if(prevKey === '_tagCat' || prevKey === 'tagCat'){
                        continue;
                    }
                    setData[key] = getData[prevKey][key];
                } else {
                    if (int2str) {
                        setData[key] = getData[key] + '';
                    } else {
                        setData[key] = getData[key];
                    }
                }
            }
        }
    },
    //验证不能为空
    judgeValue: function judgeValue(data, filterArr, flag) {
        flag = flag || true;

        if (!data) {
            ME.vm.showTip(lang['showTipNote17']);
            return flag;
        }
        // debugger;
        if (parseInt(data.type) === 2) {
            for (var key in data) {
                if (filterArr.indexOf(key) > -1) continue; //判断是否有id,结束单次循环
                if (_typeof(data[key]) !== 'object' && data[key] === "") {
                    ME.vm.showTip(lang['showTipNote17']);
                    flag = false;
                    break;
                }
            }
            return flag;
        } else {
            for (var key in data) {
                if (filterArr.indexOf(key) > -1) continue; //判断是否有id,结束单次循环
                if (_typeof(data[key]) === 'object') {
                    flag = this.judgeValue(data[key], filterArr, flag);
                } else {
                    if (key !== 'filePath' && key !== 'pixelLength' && data[key] === "") {
                        //key!=='map' && key!=='pixelLength' &&
                        ME.vm.showTip(lang['showTipNote17']);
                        flag = false;
                        break;
                    }
                }
            }
            return flag;
        }
    },
    dtClickHandle: function dtClickHandle(index, event) {
        this.posActive === index ? this.posActive = '' : this.posActive = index;
        if (index === 3) {
            event.currentTarget.parentNode.classList.add('no-radius');
        } else {
            var dom = document.querySelector('.tab-list .no-radius');
            if (dom) dom.classList.remove('no-radius');
        }
    },
    dtMouseHandle: function dtMouseHandle(event) {
        var dt = event.currentTarget.parentNode.nextElementSibling;
        if (!dt) return;
        dt = dt.querySelector('.pos-dt');
        if (event.type === 'mouseenter') {
            dt.style.borderTopColor = 'transparent';
        } else {
            dt.style.borderTopColor = '';
        }
    },
    changeMap: function changeMap(a) {
        if (a == this.mapId) {
            return;
        }
        return UBIT.openMap(a, 'self');
    },
    changeUnderStyle: function changeUnderStyle(i,id) {
        
        if (id == this.currentUnderStyle.id) {
            return;
        }else{
            //
            $('body').removeClass(this.currentUnderStyle.bodyClass);
            $('body').addClass(this.underStyles[i].bodyClass);
            $("#right_menus").removeClass(this.currentUnderStyle.menuClass);
            $("#right_menus").addClass(this.underStyles[i].menuClass);
            this.currentUnderStyle=this.underStyles[i];
        }
    },
    // 退出全屏
    fullScreenOutHandle: function fullScreenOutHandle() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
            document.mozCancelFullScreen || //Chrome等
            document.webkitExitFullscreen || //FireFox
            document.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
        } else if (typeof window.ActiveXObject !== "undefined") {
            //for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }

        this.fullScreen = true;
    },
    // 全屏
    fullScreenHandle: function fullScreenHandle() {
        // debugger;
        if (!this.fullScreen) {
            // debugger;
            var html = document.documentElement;
            html.webkitRequestFullScreen && html.webkitRequestFullScreen();
            html.mozRequestFullScreen && html.mozRequestFullScreen();
            html.requestFullscreen && html.requestFullscreen();
            this.fullScreen = true;
        }
    },




    //取消搜索
    searchCancel: function searchCancel() {
        var oldMarker = this.search.prevData;
        if (oldMarker !== null) {
            ubiMap.changeColor(false, oldMarker);
            this.search.prevData = null;
        }
    },
    //搜索
    searchHandle: function searchHandle(e) {
        // e.stopPropagation();
        //css controller 检查是否显示
        var self = this;
        if ($('#right_menus').hasClass('m-left')) {
            if (!$('.m-left .search input').hasClass('active')) {
                $('.m-left .search input').addClass('active');
                return true;
            }
        }

        var searchName = this.search.value;
        if (!searchName) {
            ME.vm.showTip(lang['showTipNote14']);
            return;
        }
        var url = ME.host + '/personnel/getCode?tag=' + searchName;
        $.ajax({
            method:"get",
            url:url,
            success:function(res){
                if(res.isOk){
                    searchName = res.data;
                }
                if (searchName.length < 2 || searchName.length > 8) {
                    ME.vm.showTip(lang['searchRule']);
                    return
                }

                //先在当前地图进行查找
                var searchData = self.searchMarkerByName(self.search.value);
                if (searchData) {
                    self.positionCoord(searchData)
                    return;
                }

                //到后台进行查找
                DataManager.searchMarkers(searchName, function(datas){
                    if(!datas.isOk){
                        ME.vm.showTip(datas.msg);
                        return ;
                    }

                    var markers = datas.markers;
                    var markerType = datas.markerType;

                    for(var i=0;i<markers.length;i++){
                        markers[i].markerType = markerType;
                    }

                    if(markers.length == 1){
                        searchData = markers[0];
                        if (searchData.mapId != ME.currentMapId) {
                            var msg = lang['searchMarkersNotePre']+ searchName +lang['searchMarkersNoteAfter'];
                            if(searchData.mapId) {
                                var map = ME.vm.getMapById(searchData.mapId);
                                if (map && searchData.time) {
                                    var lastPosTime = (new Date(parseInt(searchData.time))).Format("yyyy-MM-dd hh:mm:ss");
                                    msg += lang['searchMarkersNotePre2'] + map.cname + lang['searchMarkersNoteAfter2']+lastPosTime+"）";
                                }
                            }
                            ME.vm.showTip(msg);
                            return;
                        }

                        ME.vm.positionCoord(searchData)
                        return;
                    }

                    for(var i=0;i<markers.length;i++){
                        var m = markers[i];
                        m.mapCname = lang['unknown2'];
                        if(m.mapId>0){
                            var map = ME.vm.getMapById(m.mapId);
                            if (map) {
                                m.mapCname = map.cname;
                            }
                        }

                        if(m.power){
                            m.powerLevel = UBIT.getPower(m.power) + '%';
                        }
                        if(m.x || m.x==0){
                            m.coord = '('+(m.x/100).toFixed(2)+','+(m.y/100).toFixed(2)+')';
                        }
                    }

                    ME.vm.search[markerType].markers = markers;
                    ME.vm.search[markerType].dialogVisible = true;
                    return;
                });
            },
            error:function(){}
        });
    },
    searchTagLink:function (row) {
        window.open(ME.selfHost + '/map/map2d/svg/follow/?tag=' + row.code);
    },
    searchMapLink:function (row) {
        return UBIT.openMap(row.mapId);
    },

    positionCoord:function(searchData){
        // debugger;
        if(searchData.markerType === 'tag' && location.href.indexOf('canvas') !== -1){
            var marker = ubiMap.getMarker('tag_' + searchData.id);
            MarkerTool.showSearch(marker);
        }else{
            if (this.search.prevData === null) {
                ubiMap.changeColor(searchData, false);
            }else if(this.search.prevData.code !== searchData.code){
                ubiMap.changeColor(searchData, this.search.prevData);
            }else{
                this.search.prevData = searchData;
            }
        }
        // if (this.search.prevData === null) {
        //     if(location.href.indexOf('canvas') !== -1){
        //         var marker = ubiMap.getMarker('tag_' + searchData.id);
        //         MarkerTool.showSearch(marker);
        //     }else{
        //         ubiMap.changeColor(searchData, false);
        //     }
        // } else if (this.search.prevData.code !== searchData.code) {
        //     if(location.href.indexOf('canvas') !== -1){
        //         var marker = ubiMap.getMarker('tag_' + searchData.id);
        //         MarkerTool.showSearch(marker);
        //     }else{
        //         ubiMap.changeColor(searchData, this.search.prevData);
        //     }
        //     // // ubiMap.changeColor(searchData, this.search.prevData);
        //     // var marker = ubiMap.getMarker('tag_' + searchData.id);
        //     // marker.showSearch();
        // }
        // this.search.prevData = searchData;
    },


    searchMarkerByName: function searchMarkerByName(name) {
        var val = name.toLowerCase();
        var keys = ['anchor'];
        for (var i = 0; i < keys.length; i++) {
            var datas = this[keys[i]].data;
            for (var k = 0; k < datas.length; k++) {
                var data = datas[k];

                if (data.alias && (data.alias + '').toLowerCase() == val) {
                    return data;
                }

                if (data.code && (data.code + '').toLowerCase() == val) {
                    return data;
                }

                if (data.mac && (data.mac + '').toLowerCase() == val) {
                    return data;
                }
            }
        }
        return false;
    },
    //排序
    sortIcon: function sortIcon(dataType, type) {
        if (!dataType) {
            return;
        }
        if (this[dataType].arrowIcon.type !== type) {
            this[dataType].arrowIcon.sort = false;
        }
        this[dataType].arrowIcon.type = type;
        this[dataType].arrowIcon.sort = !this[dataType].arrowIcon.sort;
    },
    //排序分组
    sortGroup: function sortGroup(a, b) {
        return a.typeId > b.typeId;
    },
    catGroup: function catGroup(a, b) {
        return a.catId > b.catId;
    },
    nodeSort: function nodeSort(type, data) {
        // node 基站 or 标签
        var nodes = this[data];
        var datas = nodes.data;

        // 置空其他
        for (i in nodes.filterData) {
            if (i !== type) {
                nodes.filterData[i] = "";
            }
        }
        switch (nodes.filterData[type]) {
            case "":
            case false:
                nodes.filterData[type] = true;
                var list = _.orderBy(datas, type, ['desc']);
                this[data].data = list;
                break;
            case true:
                nodes.filterData[type] = false;
                var list = _.orderBy(datas, type, ['asc']);
                this[data].data = list;
                break;
        }
        this.sortIcon(data, type);
    },


    isShowTagPower: function isShowTagPower(tagPower, tagIsShow) {
        if(tagIsShow===false) return false;

        if (this.switchData.power) {
            if (this.switchData.powerAuto) {
                //显示电量低于30%的电量
                if (tagPower <= 30) {
                    return true;
                } else {
                    return false;
                }
            } else {
                //显示电量
                return true;
            }
        } else {
            //隐藏电量
            return false;
        }
    },

    // 编辑
    editHandle: function editHandle(id, key, event) {
        event.stopPropagation();
        this[key].visible = true;
        this[key].deleteBtn = true;
        var findData = _.find(this[key].data, ['id', id]);
        // 设置编辑值
        //
        if (key == 'fence') {
            this.setValue(this[key].edit, findData, null, true);
        } else {
            this.setValue(this[key].edit, findData);
        }

        if (key === 'map') {
            this.clearUpload();
            var upload = document.getElementById("upload");
            // console.log(upload.value);
            // console.log(upload.files);
            //upload.files=this.map.edit.map;
        } else if (!this[key].edit.color) {
            this[key].edit.color = "#3c72df";
        }
    },
    exit: function exit() {
        UBIT.logout();
        window.location.href = '../../../index.html';
    },
    //确定提交方法
    submit: function submit(id, key, data, callback) {
        // debugger;
        var vm = this;
        var postData = util.deepCopy(data);

        if (!id) {
            delete postData.id;
            // 添加操作
            service(key).add(postData).then(util.jsonFunc).then(function (json) {
                if (json.isOk) {

                    if (callback) callback(key, 'add', postData, json);

                    util.emptyObj(vm[key].edit);
                    data = null;
                } else {
                    // debugger;
                    ubiMap.clearInterimMarker();
                    ME.vm.showTip(json.msg);
                }
                //添加id重复时的弹框
            });
        } else {
            // 更新操作
            service(key).update(postData).then(util.jsonFunc).then(function (json) {
                if (json.isOk) {
                    if (callback) callback(key, 'update', postData, json);
                    util.emptyObj(vm[key].edit);
                    data = null;
                } else {
                    ME.vm.showTip(json.msg);
                }
            });
        }
    },


    editItem: function editItem(item, event) {
        //改变样式
        // 判断触发类型
        if(event.type=='dblclick'){
            var obj = event.currentTarget;
            $(obj).parent().find('tr').each(function (i, e) {
                $(e).removeClass('current-row');
            });
            $(obj).addClass('current-row');
        }
        MarkerTool.marekerEditPanel(item);
    },

    selectItem: function selectItem(item, event, column) {
        this.$refs.adjustAnchorMultipleTable.toggleRowSelection(item);
    },

    //tag
    tagSave: function tagSave(event) {
        var _this = this;

        this.$confirm(lang['tagSaveNote'], lang['prompt'], {}).then(function () {
            event.preventDefault();
            var key = 'tag';
            var edit = _this[key].floatEdit;
            var data = edit.data;

            //检查数据
            if (!data.sourceId) {
                edit.visible = true;
                _this.showTip(lang['selectTag']);
                return;
            }
            if (data.code == '') {
                edit.visible = true;
                _this.showTip(lang['showTipNote13']);
                return;
            }
            if (data.alias == '') {
                edit.visible = true;
                _this.showTip(lang['showTipNote12']);
                return;
            }
            if (data.catId == '') {
                edit.visible = true;
                _this.showTip(lang['selectCat']);
                return;
            }
            if (data.typeId == '') {
                edit.visible = true;
                _this.showTip(lang['selectType']);
                return;
            }
            _this.submit(data.sourceId, key, data, _this.nodeSubmitAfter);
        }).catch(function () {
        });
    },






    anchorClean: function anchorClean(event) {
        event.preventDefault();
        util.emptyObj(this['anchor'].edit);
    },

    fenceEdit: function (row,event) {
        if(event&&event.type=='dblclick'){
            var obj = event.currentTarget;
            $(obj).parent().find('tr').each(function (i, e) {
                $(e).removeClass('current-row');
            });
            $(obj).addClass('current-row');
        }

        // this['fence'].allTagsData=ME.vm.tag.data;
        // 设置编辑值

        var fenceType = 'edit';
        if(row.ftypeId == UBIT.fenceType.attendanceId){
            fenceType = 'attendanceEdit';

        }else if(row.ftypeId == UBIT.fenceType.pollingId){
            fenceType = 'pollingEdit';

        }else if(row.ftypeId == UBIT.fenceType.specialZoneId){
            fenceType = 'specialZone';
        }

        this.fence[fenceType].visible = true;
        // setValue之前先清空
        this.fence[fenceType].baseValidity=[];
        ME.vm.fence.edit.fenceValidities=[];
        this.setValue(this.fence[fenceType], row, false, true);
        if(fenceType=='edit'){
            if(!row.tagCat){
                this.fence[fenceType].tagCat=[];
            }else{
                this.fence[fenceType].tagCat=row.tagCat.split(',').map(function(cat){
                    return Number(cat)
                });
            }
            if(row.validity){
                var validity=row.validity.split(',');
                this.setValidity(validity,this.fence[fenceType].baseValidity,ME.vm.fence.edit.fenceValidities);
            }
        }

        // if(row.trif_tags){
        // //     row.trif_tags=row.trif_tags.split(',');
        //     var trif_tags=[];
        //     for(var i=0;i<row.trif_tags.length;i++){
        //         var trifTag=row.trif_tags[i];
        //         trif_tags.push(Number(trifTag));
        //     }
        //     this.fence.edit.trif_tags=trif_tags;
        // }
    },

    //维度编辑
    dimensionEdit: function dimensionEdit(row,event) {
        if(event&&event.type=='dblclick'){
            var obj = event.currentTarget;
            $(obj).parent().find('tr').each(function (i, e) {
                $(e).removeClass('current-row');
            });
            $(obj).addClass('current-row');
        }
        this['dimension'].visible = true;
        // 设置编辑值
        this.setValue(this.dimension.edit, row, null, true);
    },
    //多人互监
    moreMonitorSave:function moreMonitorSave(event){
        event.preventDefault();
        var key = 'moreMonitor';
        var data = this[key].edit;
        if (!data.cname) {
            this[key].visible = true;
            this.showTip(lang['showTipNote22']);
            return;
        }
        if (!data.tags||data.tags.length<2) {
            this[key].visible = true;
            this.showTip(lang['showTipNote10']);
            return;
        }
        if(!data.model){
            this[key].visible = true;
            // this.showTip(lang['showTipNote10']);
            this.showTip('请选择监管模式');
            return;
        }

        switch(data.model){
            case 'moreMonitorOne':
            if (!data.watchman) {
                this[key].visible = true;
                this.showTip(lang['showTipNote26']);
                return;
            };
            break;
            case 'moreMonitorAll':
            if(!data.datetimeRange||data.datetimeRange.length<1){
                data.datetimeRange=[new Date(0),new Date(0)];
                   //有效期
                // var validDate = new Date();
                // validDate.setTime(source.validity?source.validity:0);
                // params.validity=validDate.Format('yyyy-MM-dd hh:mm:ss');    //默认
            };
            data.datetimeRange=[new Date(data.datetimeRange[0]).getTime(),new Date(data.datetimeRange[1]).getTime()];
            break;
        }
       
        var tags=[];
        for(var i=0;i<data.tags.length;i++){
            var item=data.tags[i];
            if(item.mac){
                var tag={};
                tag.id=item.sourceId;
                tag.code=item.code;
                tag.mac=item.mac;
                tags.push(tag);
            }
        }
        data.tags=tags;

        //存放冲突标签
        var conflict=new Set();
        //获取当前项目下所有组成员，防止破坏其他组,更新时检查冲突
      if(ME.vm.moreMonitor.data&&ME.vm.moreMonitor.data.length>0){
          for(var moreMonitor of ME.vm.moreMonitor.data){
            if(!moreMonitor.tags||moreMonitor.tags.length<1||moreMonitor.id==data.id){continue}
            for(var haveTag of moreMonitor.tags){
                for(var tag of data.tags){
                    if(haveTag.mac==tag.mac){
                        conflict.add({'moreMonitor':moreMonitor.cname,'mac':tag.mac});
                    }
                }
            }
          }
      }
      if(conflict.size>0){
            var conflictTags=Array.from(conflict);
            this.$confirm(conflictTags[0].mac+lang['moreMonitorSaveNotePre']+conflictTags[0].moreMonitor+lang['moreMonitorSaveNote'], lang['prompt'], {}).then(function () {
                ME.vm.submit(data.id, key, data, ME.vm.moreMonitorSubmitAfter);
                ME.vm.moreMonitor.visible = false;
                ME.vm.moreMonitor.boxisActive=false;
            }).catch(function(e){

            })
      } else{
          ME.vm.submit(data.id, key, data, ME.vm.moreMonitorSubmitAfter);
          ME.vm.moreMonitor.visible = false;
          ME.vm.moreMonitor.boxisActive=false;
      }

    },
    checkMoreModel:function(row,col){
        if(!row.model) return;
        var showText='';
        switch(row.model){
            case 'moreMonitorOne':showText='主监';
            break;
            case 'moreMonitorAll':showText='互监';
            break;
        }
        return showText;
    },
    //多人互监组删除
    moreMonitorDelete: function moreMonitorDelete(event, moreMonitor) {
        //鉴权：超管和项目管理员
        if(ME.user.userType!='super'&&ME.user.userType!='proj_user'){
            this.showTip(lang['noPrivilegeNote2']);
            return
        }
        var _this4 = this;
        var id = moreMonitor.id;
        if(!id){
            this.showTip(lang['selectOne']);
            return;
        }
        this.$confirm(lang['deleteMoreMonitorNote'], lang['prompt'], {}).then(function () {
            event.preventDefault();
            if (!_this4.moreMonitor.edit) {
                return;
            }
            var vm = _this4;

            if (!id) {
                return;
            }
            service('moreMonitor').delete({id: id}).then(util.jsonFunc).then(function (json) {
                if (json.isOk) {
                    //删除组后删除对应marker上halo
                    for(var i=0;i<moreMonitor.tags.length;i++){
                        var item=moreMonitor.tags[i];
                        var marker= ME.vm.findMakerByMac(item.mac);
                        if(!marker){continue}
                        var monitorHalo=ubiMap.findInMarker(marker,'moreMonitor');
                        // if(monitorHalo){monitorHalo.remove()}
                        if(monitorHalo){monitorHalo.hide()}
                        // if(ME.moreMonitorHalos.has(item.mac)){ME.moreMonitorHalos.delete(item.mac)}
                    }
                    //删除连线
                    var lineKey=ME.projectCode+'_'+ME.currentMapId+'_'+moreMonitor.id;
                    if(paper.hasOwnProperty(lineKey)){
                        paper[lineKey].remove();
                        delete paper[lineKey];
                    }

                    // var goPoints=[];
                    // ubiMap.drawStrLine('moreMonitor',goPoints,moreMonitor.cname+'_'+moreMonitor.id);
                    util.emptyObj(vm.moreMonitor.edit);
                    var index = _.findIndex(vm.moreMonitor.data, ['id', id]);
                    var delData = vm.moreMonitor.data.splice(index, 1);
                    vm.moreMonitor.visible = false;

                }
            }).catch(function (e) {
                console.dir(e);
            });
        }).catch(function () {
        });
    },
    moreMonitorSubmitAfter:function moreMonitorSubmitAfter(key, type, data, res){

        if (key != 'moreMonitor') {
            return;
        }
        if (type == 'add') {
            ME.vm[key].data.push(res.data);

        } else {
            for(var i=0;i<ME.vm[key].data.length;i++){
                var item=ME.vm[key].data[i];
                if(res.data.id==item.id){
                    for(k in res.data){
                        item[k]=res.data[k];
                    }
                    ME.vm[key].data.splice(i, 1, item); //替换
                    return
                }
            }

        }

        ME.vm.moreMonitor.macs=[];
        ME.vm.moreMonitor.allTagsData=[];
    },

    //互监组成员选择搜索
    searchMonitorTag:function(){
        var query=ME.vm.moreMonitor.searchValue.trim();
        if (query != '') {
        // if (query) {
        //     ME.vm.moreMonitor.allTagsData = ME.vm.tag.data.filter(function(item) {
            ME.vm.moreMonitor.allTagsData = ME.vm.moreMonitor.allData.filter(function(item) {
                return item.mac.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1||item.code.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1||(item.alias&&item.alias.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1);
            })
        }else {
            // ME.vm.moreMonitor.allTagsData = ME.vm.tag.data;
            ME.vm.moreMonitor.allTagsData = ME.vm.moreMonitor.allData;
        }
        ME.vm.moreMonitor.boxisActive=true;
    },

    getMoreMonitorById:function(id){
        for(var i in ME.vm.moreMonitor.data){
            if(ME.vm.moreMonitor.data[i].id === id){
                return ME.vm.moreMonitor.data[i];
            }
        }
        return false;
    },

    //多人互监，展现样式 
    showMoreMonitorStyle:function showMoreMonitorStyle(data){
            if(!data.distance){return}

            var dis=data.distance;
            //根据isLeapOver判断是否显示样式或删除,越界dis为mac1_mac2,否则mac清除样式
        //存储将要绘制连线点，二维数组，所有线段端点
            var goPoints=[];

        for(var key in dis){
            // key:01000000_02000000
            //一条线段两端点
            var itemPoints=[];
            var macs=key.split('_');
            //为对应marker添加光环
            //为每个成员添加底部光环
            for(var i=0;i<macs.length;i++){
                var item=macs[i];
                var marker=this.findMakerByMac(item);
                if(marker){
                    var pos={x:marker.x,y:marker.y,z:marker.z};
                    itemPoints.push(pos);
                    //dis为mac1_mac2则绘制，否则删除
                    var haloItem=SysAlert.drawHalo('moreMonitor',marker, data,item, i==0);
                    var lineKey=data.map+'_'+data.monitorId;
                    haloItem.lineKey=lineKey;
                }
            }
            goPoints.push(itemPoints);
        }
        //    绘制连接线
        ubiMap.drawStrLine('moreMonitor',goPoints, lineKey, data.moreMonitor.color);
    },

    findMakerByMac:function findMakerByMac(mac){
        for(var t in ME.tags){
            var item=ME.tags[t];
            // if(mac==item.mac){
                if(mac==item.mac&&item.isShow){
                var marker=ubiMap.getMarker(item.markerId);
                // return ME.tags[t];
                return marker;
            }
        }
        return false;
    },


    //地图旋转方法
    mapRotate:function mapRotate(type){
        //获取到svg元素
        // var paperSvg=$('#mapSvg svg');
        var paperSvg=$(paper.canvas);
        // var paperSvg=paper.all;
        // console.log(paperSvg,'ppppppppppppppppppppp');
        // paperSvg.rotate(45);
        // return
        //得到旋转角度，为矩阵
        var tran=paperSvg.css('transform');
        if(tran=='none'){tran='matrix(0,0,0,0,0,0)'};
        // 处理矩阵获取到旋转角度
        var initDeg=eval('this.get'+tran);


        paperSvg.css({
            // background:'red',
            // 'transform-origin':rotateOrigin.x+'px '+ rotateOrigin.y+'px',
            'transform-origin':'50% 50%',
        });
        switch(type){
            case 'up':break;
            case 'right':paperSvg.css({
                transform:'rotate('+(initDeg+=5)+'deg)'
            });break;
            case 'bottom':break;
            case 'origin':paperSvg.css({
                transform:'rotate(0deg)'
            });break;
            case 'left':paperSvg.css({
                transform:'rotate('+(initDeg-=5)+'deg)'
            });break;
        }
    //    设置中心指针样式，偏转角度
       if(type=='origin'){
           $('.button_rotate_origin').css({transform:'translate(-50%,-50%) rotate(0deg)'})
       }else{
           $('.button_rotate_origin').css({transform:'translate(-50%,-50%) rotate('+initDeg+'deg)'})
       }
    },
    //通过矩阵获取角度
    getmatrix:function getmatrix(a,b,c,d,e,f){
        var aa=Math.round(180*Math.asin(a)/ Math.PI);
        var bb=Math.round(180*Math.acos(b)/ Math.PI);
        var cc=Math.round(180*Math.asin(c)/ Math.PI);
        var dd=Math.round(180*Math.acos(d)/ Math.PI);
        var deg=0;
        if(aa==bb||-aa==bb){
            deg=dd;
        }else if(-aa+bb==180){
            deg=180+cc;
        }else if(aa+bb==180){
            deg=360-cc||360-dd;
        }
        return deg>=360?0:deg;
        //return (aa+','+bb+','+cc+','+dd);
    },
    //围栏触发标签搜索
    // searchTrifTag:function(){
    //     var query=ME.vm.fence.searchTrifTag;
    //     if (query !== '') {
    //         ME.vm.fence.allTagsData = ME.vm.tag.data.filter(function(item) {
    //             return item.mac.toLowerCase()
    //                 .indexOf(query.toLowerCase()) > -1||item.code.toLowerCase()
    //                 .indexOf(query.toLowerCase()) > -1||(item.alias&&item.alias.toLowerCase()
    //                 .indexOf(query.toLowerCase()) > -1);
    //         })
    //     }else {
    //         ME.vm.fence.allTagsData = ME.vm.tag.data;
    //     }
    // },
    //围栏触发全选、反选,批量全选、批量反选（按照搜索）
    // handleCheckAllTrifTag:function() {
    //     // if(ME.vm.fence.edit.trif_tags&&ME.vm.fence.allTagsData){
    //     if(Object.prototype.toString.call(ME.vm.fence.edit.trif_tags) === "[object Array]"&&
    //         Object.prototype.toString.call(ME.vm.fence.allTagsData) === "[object Array]"){
    //         //已勾选的所有标签
    //         var trif_length=ME.vm.fence.edit.trif_tags.length;
    //         var allLength=ME.vm.fence.allTagsData.length;
    //         //搜索后，显示里面已被勾选标签，存在且部分选中，则全选，否则全部取消
    //         var count=0;
    //          for(var j=0;j<trif_length;j++){
    //              var selectedTag=ME.vm.fence.edit.trif_tags[j];
    //              for(var k=0;k<allLength;k++){
    //                  var tagData=ME.vm.fence.allTagsData[k];
    //                if(selectedTag==tagData.sourceId){
    //                    count++
    //                }
    //              }
    //          }
    //         // var allLength=ME.vm.tag.data.length;
    //         if(count>=0&&count<allLength){
    //         //全选
    //             for(var i=0;i<allLength;i++){
    //                 var item=ME.vm.fence.allTagsData[i];
    //                 if(!ME.vm.fence.edit.trif_tags.find(function(v){return v==item.sourceId})){
    //                     ME.vm.fence.edit.trif_tags.push(item.sourceId);
    //                 }
    //             }
    //             ME.vm.fence.isIndeterminate = true;
    //         }else{
    //         //反选
    //             for(var i=0;i<allLength;i++){
    //                 var item=ME.vm.fence.allTagsData[i];
    //                     // ME.vm.fence.edit.trif_tags.pop(item.sourceId);
    //                 for(m=0;m<trif_length;m++){
    //                     var trifItem= ME.vm.fence.edit.trif_tags[m];
    //                     if(item.sourceId==trifItem){
    //                         ME.vm.fence.edit.trif_tags.splice(m,1);
    //                     }
    //                 }
    //             }
    //             ME.vm.fence.isIndeterminate = false;
    //         }
    //     }
    // },
    tagTypeChangeImg: function tagTypeChangeImg() {
        this.tag.floatEdit.typeIconShow = false;
        var type = this.getTagType(this.tag.floatEdit.data.typeId);
        if (!type) return;
        ME.vm.tag.floatEdit.typeIcon = UBIT.getImgSrc('tagTypes', type.icon);
        this.tag.floatEdit.typeIconShow = true;
    },

    getTag: function getTag(data) {
        return this.getNodeByCode('tag', data.code)
    },
    getMapById: function getMapById(mapId) {
        return this.getNodeById('map', mapId);
    },
    getAnonyTag: function getAnonyTag(data) {
        data.code = data.mac;
        data.sourceId = data.id;
        var map = ME.vm.getMapById(data.mapId);
        if (map) data.mapName = map.cname;
        data.markerType = 'tag';
        data.markerId = 'tag_' + data.code;
        data.alias = 'ay' + data.mac;
        data.status = 'online';
        data.time = data.time;
        data.isShow = true;
        return data;
    },
    getTagDisappear:function(tag){
        if(!tag||!tag.typeId) return;
        var item=ME.vm.tagType.data.find(function(type){
            return tag.typeId==type.id;
        });
        var disappearTime=(item&&parseFloat(item.tagDisappear))?parseFloat(item.tagDisappear):ME.tagDisappear;
        return disappearTime;
    },
    setTag: function setTag(tag, data) {
        tag.x = parseFloat(data.x).toFixed(2);
        tag.y = parseFloat(data.y).toFixed(2);
        tag.z = data.z;
        if (tag.mapId != data.mapId) {
            tag.mapId = data.mapId;
            var map = ME.vm.getMapById(data.mapId);
            if (map) tag.mapName = map.cname;
        }
        tag.screenX = parseFloat(data.screenX).toFixed(2);
        tag.screenY = parseFloat(data.screenY).toFixed(2);
        tag.power = data.power;
        tag.status = 'online';
        tag.time = data.time;
    },
    //地图切换
    changeBuild: function changeBuild(type, index) {
        //e.preventDefault();
        //e.stopPropagation();
        this.historyClear();

        if (type == 'map') {
            if (this.mapId == this.map.data[index].id) return;
            this.mapId = this.map.data[index].id;
            if (this.mapId == undefined) return;
        }
        var id = this.mapId;
        if (!window.localStorage) {
            ME.vm.showTip(lang['supportLocalstorage']);
        } else {
            var storage = window.localStorage;
            storage.setItem("mapId", this.mapId);
            //console.log(storage.mapId);
        }
        var data = _.find(this.map.data, ['id', id]);
        this.curRealLength = data.realLength;
        ubiMap.paperClear();
        this.setNodeData(data, true);
        this.sortIcon('');
        this.map.visible = false;
        this.nodes.visible = false;
    },
    //显示数据
    dataShow: function dataShow() {
        this.dataActive = !this.dataActive;
    },
    //清除报警
    clearSiren: function clearSiren() {
        $("#jqxFenceNotification").jqxNotification("closeAll");
        $("#jqxSosNotification").jqxNotification("closeAll");
        $("#jqxForceRemoveNotification").jqxNotification("closeAll");
        ME.sos = {};
        ME.forceRemove = {};
    },
    adminManage:function(){
        // var row = this.selectproject();
        // if(!row) return;

        this.$confirm(lang['changeUserType'],lang['prompt'],{ }).then(function(){

            var params = {api_token:ME.api_token};
            ME.vm.$http.post('super/user/changeAdmin2Super', params).then(function(res){
                var result = res.body;
                if(result.isOk){
                    //更改cookie中的用户信息
                    var userData = result.entity;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    //跳转
                    top.location.href = "../../../super/index/";

                }else {
                    this.$alert(lang['changeUserFail']+result.msg, lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                }
            });
        }).catch(function(){

        });
    },
    showPromptBox:function(msg,callBackFun){
        this.$prompt(msg, lang['prompt'], {
            confirmButtonText: lang['calibration'],
            cancelButtonText: lang['cancel'],
            inputType:'number',
            inputPattern: /^\d+(\.\d+)?$/,
            inputErrorMessage: lang['showPromptBoxNote'],
            callback:function(action,instance){
                switch(action){
                    case 'confirm':callBackFun.success(instance,callBackFun.succDate);break;
                    case 'cancel':break;
                }
            }
        })
    },
    //地图校准
    mapCorrect:function(value,data){
        var scale=value.inputValue*100/data.dis;
        var params={
            id:ME.vm.currentMap.id,
            realLength:scale*ME.vm.currentMap.pixelLength,
            realWidth:scale*ME.vm.currentMap.pixelWidth,
        };
        var url = 'super/map/save/';
        ME.vm.$http.post(url, params).then(function (res) {
            var result = res.body;
            if (result.isOk) {
                this.$alert(lang['successfulCalibration'], lang['prompt']);
                location.reload();
            } else {
                this.$alert( lang['calibrationFail'] + result.msg, lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
            }
        });
    },
    //历史记录，热力图穿梭框搜索方法（支持alias,code,mac）
    searchTags:function(query,item){
        if(!query){
            return true;
        }else{
            return (item.key&&item.key.indexOf(query)>-1)||
                (item.label&&item.label.indexOf(query) > -1);
        }
    },
    //标签跟随公共方法
    //确认跟随地图
    follow_map:function(){
        console.log('follow');
        var clickTagCode=ME.vm.tag.qrcode.code;
        ME.vm.tag.qrcode.followMap=true;
        console.log(clickTagCode);
        if(clickTagCode){
            //设置跟随标签，跳转后跟随
            window.open(ME.selfHost + '/map/map2d/svg/follow/?tag=' + clickTagCode);
            // if(location.href.indexOf('canvas') !== -1){
            //     window.open(ME.selfHost + '/map/map2d/svg/follow/?tag=' + clickTagCode);
            // }else{
            //     window.open(ME.selfHost + '/map/map2d/canvas/follow/?tag=' + clickTagCode);
            // }

                    // window.open(ME.host.split(':')[1] + '/map/map2d/canvas/?tag=' + clickTagCode + '&anony=1&follow=anony');
            // if(UBIT.enableCamera)this.followTagVideo();
        }
    },

    down_alert:function(){
        var mac=ME.vm.tag.floatEdit.data.mac;

        var url = 'tag/downAlert';//, anchor:'9000014c'
        ME.vm.$http.post(url, {mac:mac}).then(function (res) {
            var result = res.body;
            if (result.isOk) {
                this.$alert(lang['cammandSendSuccess'], lang['prompt']);
            } else {
                this.$alert( lang['cammandSendFail'] + result.msg, lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
            }
        });

    },
    changeStep:function(lastPoint,newPoint,goTime,rate,type){
    //   传入起始点，和时间计算单位时间x，y移动距离
        switch(type){
            case "screen":var stepX=((newPoint.screenX-lastPoint.x)/goTime)*goTime/rate,stepY=((newPoint.screenY-lastPoint.y)/goTime)*goTime/rate;break;
            case "rel":var stepX=((newPoint.x-lastPoint.x)/goTime)*goTime/rate,stepY=((newPoint.y-lastPoint.y)/goTime)*goTime/rate;break;
        }
        return {stepX:stepX,stepY:stepY}

    },
    //查找标签
    findTagByMac:function(code){
        var datas;
        if(ME.vm.tag.data&&ME.vm.tag.data.length>0){
            datas=ME.vm.tag.data;
        }else {
            datas=ME.vm.currentTags.data;
        }
        for(var i=0;i<datas.length;i++){
            var data=datas[i];
            if(data.code==code){
                return data;
            }
        }
    },
    moreMonitorEdit:function moreMonitorEdit(row,event) {
        if(ME.user.userType!='super'&&ME.user.userType!='proj_user'){
        this.showTip(lang['noPrivilegeNote2']);
        return
    }
    if(event&&event.type=='dblclick'){
        var obj = event.currentTarget;
        $(obj).parent().find('tr').each(function (i, e) {
            $(e).removeClass('current-row');
        });
        $(obj).addClass('current-row');
    }
        // util.emptyObj(ME.vm.moreMonitor.edit);
        ME.vm.moreMonitor.edit.datetimeRange=[];

       //更新时数据源为所有标签，将tag.data拷贝
       //  ME.vm.moreMonitor.allData=Array.from(new Set(ME.vm.tag.data));
        ME.vm.moreMonitor.allData=ME.vm.tag.data.concat([]);

        ME.vm.moreMonitor.edit.id=row.id?row.id:'';
        ME.vm.moreMonitor.edit.cname=row.cname?row.cname:'';
        ME.vm.moreMonitor.edit.distance=row.distance?row.distance:'';
        ME.vm.moreMonitor.edit.watchman=row.watchman?row.watchman:'';
        ME.vm.moreMonitor.edit.model=row.model?row.model:'';
        ME.vm.moreMonitor.edit.datetimeRange.push(row.startTime);
        ME.vm.moreMonitor.edit.datetimeRange.push(row.endTime);
        // 设置编辑值
        // watch监听，修改tags
        if(row.tags&&row.tags.length>0){
            ME.vm.moreMonitor.macs=[];
            for(var i=0;i<row.tags.length;i++){
                var item=row.tags[i];
                  ME.vm.moreMonitor.macs.push(item.mac);
            }
        }
        this['moreMonitor'].visible = true;

},

    moreMonitorClean:function(event){
        event.preventDefault();
        util.emptyObj(ME.vm.moreMonitor.edit);
        ME.vm.moreMonitor.macs=[];
        ME.vm.moreMonitor.allData=[];
        ME.vm.moreMonitor.visible=false;

    },
    // 标签、基站搜索
    searchData:function(type){
        if(!type) return;
        var searchVal=this[type].searchVal;
        if(searchVal){
            searchVal=searchVal.toLowerCase();
            var filterData=ME.vm[type].data.filter(function(item){
                if(item&&item instanceof Object){
                    for(var i in item){
                        if(String(item[i]).toLowerCase().indexOf(searchVal)>-1){
                            return true;
                        }
                    }
                }
            });
         ME.vm[type].filterData=filterData;
        }
    },
    fenceAttendance:function(e,row){
        var self = this;
        var flag = this.attendance.initTables(row);
        this.attendance.dialogVisible = flag;
    },
    attendanceChangeSize:function(size,key){
        this.attendance.setPageSize(size,key);
    },
    attendanceChangePage:function(pageNum,key){
        this.attendance.setPageNum(pageNum,key)
    },
    attendanceShowDetails:function(code){
        this.attendance.showDetails(code);
    },
    attendanceHideDetails:function(code){
        this.attendance.hideDetails(code);
    },
    attendanceCheckTab:function(){
        var id = this.attendance.selectTabId;
        var arr = ['totalAttendees','attendees','absentee'];
        arr.forEach((value) => {
            if(id === value){
                this.attendance.datas[id].show = true;
            }else{
                this.attendance.datas[value].show = false;
            }
        })
    },



    
    addFenceValiItem:function(){
        // TODO 限制时间段个数
        var onlyKey=UBIT.uuid(6);
        var item={onlyKey:onlyKey,validity:[new Date(), new Date()]};
        ME.vm.fence.edit.fenceValidities.push(item);

    },
    delFenceValiItem:function(onlyKey){
        if(!onlyKey)return;
        var firstIndex=ME.vm.fence.edit.fenceValidities.findIndex(function(item){
            return item.onlyKey==onlyKey;
        });
        if(firstIndex<0) return;
        ME.vm.fence.edit.fenceValidities.splice(firstIndex,1);
    },

    // 提交数据前获取围栏有效期
    getFenceValidities:function(){
        var fenceValidities=[];
        // var baseVali=ME.vm.fence.baseValidity[0].getTime()+'_'+ME.vm.fence.baseValidity[1].getTime();
        if(ME.vm.fence.edit.baseValidity&&ME.vm.fence.edit.baseValidity.length>1){
            var baseVali=ME.vm.fence.edit.baseValidity[0].Format('hh:mm:ss')+'_'+ME.vm.fence.edit.baseValidity[1].Format('hh:mm:ss');
            fenceValidities.push(baseVali);
        }
       
        if(ME.vm.fence.edit.fenceValidities&&ME.vm.fence.edit.fenceValidities.length>0){
            for(var i=0;i<ME.vm.fence.edit.fenceValidities.length;i++){
                var item=ME.vm.fence.edit.fenceValidities[i];
                // var validity=item.validity[0].getTime()+'_'+item.validity[1].getTime();
                var validity=item.validity[0].Format('hh:mm:ss')+'_'+item.validity[1].Format('hh:mm:ss');
                fenceValidities.push(validity);
            }
        }
        return fenceValidities.join(',');
    },
    // 时间回显
    setValidity:function(validity,baseValidity,otherValidities){
        if(!validity||validity.length<1) return;
        for(var i=0;i<validity.length;i++){
            var subArr=validity[i].split('_');
            var startArr=this.dateToPicker(subArr[0]);
            var endArr=this.dateToPicker(subArr[1]);
            // if(i==0){
            //     baseValidity=[
            //         new Date(1971,0,0,startArr[0],startArr[2],startArr[2]),
            //         new Date(1971,0,0,endArr[0],endArr[2],endArr[2]),
            //     ];
            // }else{
            var onlyKey=UBIT.uuid(6);
            var item={onlyKey:onlyKey,validity:[
                new Date(1971,0,0,startArr[0],startArr[2],startArr[2]),
                new Date(1971,0,0,endArr[0],endArr[2],endArr[2]),]};
            otherValidities.push(item);
            // }
        }
    },
    dateToPicker:function(date){
        if(!date||typeof date!='string')return [0,0,0];
        return date.split(':').map(function(v){
            return parseInt(v);
        });
    },
    realTimeStatistics:function(pos){
        if(!this.switchData.realTimeStatistics||!pos)return;
        if(!this.statisticsPoint||Object.keys(this.statisticsPoint).length<1) {
            this.statisticsPoint=pos;
        }else{
            // 开始统计
            this.statisticsListData(this.statisticsPoint,pos);
            // if(paper.statistics){
            //     paper.statistics.remove();
            // }
            this.statisticsListShow=true;
            this.statisticsPoint={};
        }
    },
    statisticsShow:function(e){
        if(!ME.vm.switchData.realTimeStatistics||!ME.vm.statisticsPoint||Object.keys(ME.vm.statisticsPoint).length<1) return;
        var pos=ubiMap.getPosition(e);
        ubiMap.drawAriaByTwo(ME.vm.statisticsPoint,pos);
    },
    statisticsListData:function(p1,p2){
        this.statisticsList=[];
        var tagCodes=Object.keys(ME.tags);
        if(tagCodes.length<1) {
            return;
        }
        var ariaVertex={};
        if(parseFloat(p1.relX)<=parseFloat(p2.relX)){
            ariaVertex.minReaX=parseFloat(p1.relX);
            ariaVertex.maxReaX=parseFloat(p2.relX);
        }else{
            ariaVertex.minReaX=parseFloat(p2.relX);
            ariaVertex.maxReaX=parseFloat(p1.relX);
        }

        if(parseFloat(p1.relY)<=parseFloat(p2.relY)){
            ariaVertex.minReaY=parseFloat(p1.relY);
            ariaVertex.maxReaY=parseFloat(p2.relY);
        }else{
            ariaVertex.minReaY=parseFloat(p2.relY);
            ariaVertex.maxReaY=parseFloat(p1.relY);
        }
        for(var i=0;i<tagCodes.length;i++){
            var item=ME.tags[tagCodes[i]];
            if(
                item.mapId==ME.vm.currentMap.id&&item.status=='online'&&
                parseFloat(item.x)>=ariaVertex.minReaX&&parseFloat(item.x)<=ariaVertex.maxReaX&&
                parseFloat(item.y)>=ariaVertex.minReaY&&parseFloat(item.y)<=ariaVertex.maxReaY
            ){
                var dff = Date.now() - item.time;
                if(dff > item.tagDisappear )continue;
                this.statisticsList.push(item);
            }
        }
    },
    cancelStatistics:function(){
        this.statisticsListShow=false;
        this.statisticsList=[];
        if(paper.statistics){
            paper.statistics.remove();
        }
    },
    getStartP:function(p1,p2){
        var startPoint={
            x:parseFloat(p1.x)<=parseFloat(p2.x)?parseFloat(p1.x):parseFloat(p2.x),
            y:parseFloat(p1.y)<=parseFloat(p2.y)?parseFloat(p1.y):parseFloat(p2.y)
        }
        startPoint.w=Math.abs(parseFloat(p1.x)-parseFloat(p2.x));
        startPoint.h=Math.abs(parseFloat(p1.y)-parseFloat(p2.y));
        return startPoint;
    },
    getMapCof:function(cfgName){
            var map = ME.vm.currentMap;
            var cofValue='';
            if(map && map.cfgMap){
                var cfg = JSON.parse(map.cfgMap);
                for(var i in cfg){
                    if( cfg[i].key == cfgName ){
                        cofValue=cfg[i].value;
                    }
                }
            }
            return cofValue;
    },
    getCoordBorder:function(){
        var mapAppear=this.getMapCof('disappear_limit');
        var appear=parseFloat(mapAppear);
        if(appear&&Math.abs(appear)>0){
            this.mapAppear=appear;
            var map = ME.vm.currentMap;
            this.coordBorderMinX =appear;
            this.coordBorderMaxY=parseFloat(map.realWidth)-appear;
            this.coordBorderMinY =appear;
            this.coordBorderMaxX=parseFloat(map.realLength)-appear;
        }
    },
    checkInBorderCoord:function(data){
        var isEffArea=true;
        if(this.mapAppear&&data.hasOwnProperty('x')&&data.hasOwnProperty('y')){
            if(
                parseFloat(data.x)<this.coordBorderMinX||
                parseFloat(data.x)>this.coordBorderMaxX||
                parseFloat(data.y)<this.coordBorderMinY||
                parseFloat(data.y)>this.coordBorderMaxY
            ){
                isEffArea=false;
            }
        }
        return isEffArea;
    },
    checkFenceIsShowByglobal:function(){
        var allFence=ME.vm.fence.data;
        if(!allFence||allFence.length<1) return;
        for(var i=0;i<allFence.length;i++){
            var fence=allFence[i];
            var isShow=fence.hasOwnProperty('hide')&&fence.hide?false:true;
            if(isShow){
                isShow = fence.isShow;
            }
            ubiMap.toggleFenceById(isShow,fence.id);
        }
    }

//     createShortcut:function createShortcut(sUrl,sName) {
//     try{
//         debugger;
//         var fso = new ActiveXObject("Scripting.FileSystemObject");
//
//         var shell = new ActiveXObject("WScript.Shell");
//         var tagFolder = shell.SpecialFolders("Desktop");
//         if(!fso.FolderExists(tagFolder )) {
//             fso.CreateFolder(tagFolder);
//         }
//         if(!fso.FileExists(tagFolder + "\\"+sName+".lnk")) {
//             var WshSysEnv = shell.Environment("Process");
//             iLocal = (WshSysEnv.Item("SystemRoot") +"\\favicon.ico"); //下载到C:\windows\1.ico
//             iRemote = (路径名+"/favicon.ico"); //先下载图标文件，再用自定义图标把首页的图标地址替换
//             var xPost = new ActiveXObject("Microsoft.XMLHTTP");
//             xPost.Open("GET", iRemote, 0);
//             xPost.Send();
//             var sGet = new ActiveXObject("ADODB.Stream");
//             sGet.Mode = 3;
//             sGet.Type = 1;
//             sGet.Open();
//             sGet.Write(xPost.ResponseBody );
//             sGet.SaveToFile( iLocal,2);
//             var link = shell.CreateShortcut(tagFolder + "\\"+sName+".lnk");
//             link.Description = "";
//             link.Hotkey = "Ctrl+Alt+e";
//             link.TargetPath = sUrl;
//             link.IconLocation=iLocal;
//             link.WindowStyle = 3;
//             link.WorkingDirectory = "c:\\blah";
//             link.Save();
//             alert("恭喜！快捷方式创建成功！");
//         }else{
//             alert("该快捷方式已经存在");
//         }
//     }
//     catch(ex){
//
//         alert("快捷方式创建失败，可能浏览器不支持！"+ex);
//     }
// },

};


//公共计算属性
var comWatch={
    'rangeData.value': function rangeDataValue(newVal) {
        ubiMap.setLen(newVal);
    },
    'fullScreen': function fullScreen(newVal) {
        if (!newVal) {
            //设置样式
            // $('#wrapper_paper').removeClass('paper-fullScreen');
        }
    },
    'search.value': function searchValue(newVal) {
        if (!newVal) {
            this.searchCancel();
        }
    },
    'tag.searchVal':function(newVal){
        this.searchData('tag');
    },
    'anchor.searchVal':function(newVal){
        this.searchData('anchor');
    },
    'moreMonitor.macs':function(macs){
        //    选项值改变时找到对应标签
        var onlyTags=new Set();
        // if(!ids||ids.length<1){return}
        for(var i=0;i<macs.length;i++){
            for(var j=0;j<ME.vm.tag.data.length;j++){
                var item=ME.vm.tag.data[j];
                if(item.mac==macs[i]){
                    onlyTags.add(item);
                }
            }
        }
        ME.vm.moreMonitor.edit.tags=Array.from(onlyTags);
    },
    'currentMap.northAngle':function(){
        ME.vm.rotate=lang['northAngle']+ME.vm.currentMap.northAngle+lang['degree'];
    }

};
