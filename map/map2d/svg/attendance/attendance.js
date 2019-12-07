var Attendance = function () {
    var vm = this;
    var _attendance = {
        dialogVisible: false,
        selectTabId:'totalAttendees',
        mapCname:'',
        fenceCname:'',
        fenceData:'',
        totalAttendeesDatas: [],
        get attendeesDatas(){
            var datas = _attendance.totalAttendeesDatas;
            if(datas.length < 1){
                return [];
            }
            return datas.filter((value) => {
                return value.status === lang['arrived'];
            })
        },
        get absenteeDatas(){
            var datas = _attendance.totalAttendeesDatas;
            if(datas.length < 1){
                return [];
            }
            return datas.filter((value) => {
                return value.status !== lang['arrived'];
            })
        },
    }
    _attendance.datas = {
        totalAttendees: {
            id: "totalAttendees",
            show:true,
            data: [],
            number: 100,
            pageSize: 10,
            pageNum: 1,
            get start() {
                return (this.pageNum - 1) * this.pageSize;
            },
            get end() {
                return this.pageNum * this.pageSize;
            },
            text: lang['totalAttendees']
        },
        attendees: {
            id: 'attendees',
            show:false,
            data: [],
            number: 80,
            text: lang['attendees'],
            pageSize: 10,
            pageNum: 1,
            get start() {
                return (this.pageNum - 1) * this.pageSize;
            },
            get end() {
                return this.pageNum * this.pageSize;
            }
        },
        absentee: {
            id: 'absentee',
            show:false,
            data: [],
            number: 20,
            text: lang['absentee'],
            pageSize: 10,
            pageNum: 1,
            get start() {
                return (this.pageNum - 1) * this.pageSize;
            },
            get end() {
                return this.pageNum * this.pageSize;
            }
        }
    }
    _attendance.initDatas = function (fenceData, cb) {
        _attendance.totalAttendeesDatas = [];
        var allTags = ME.tags;
        var codes = [];
        var fencePoly = fenceData.points.split(',').map((value) => {
            var obj = {}
            var coord = value.split(/\s/);
            obj.x = Number(coord[0]);
            obj.y = Number(coord[1]);
            return obj;
        })
        _attendance.fenceCname = fenceData.cname;
        _attendance.fenceData = fenceData;
        ME.vm.map.data.forEach((value) => {
            if(value.id == ME.currentMapId){
                _attendance.mapCname = value.cname;
            }
        })
        if (!fenceData.tagCat || fenceData.tagCat === '0') {
            codes = ME.vm.tag.data.map((value) => {
                if(!value.alias || value.alias.indexOf('ay')!=0){
                    return value.code
                }
            });
        } else {
            var tagCats = fenceData.tagCat.split(',').map((value) => { return value; });
            codes = Object.values(allTags).filter((value) => {
                return tagCats.includes(value.catId)
            }).map((value) => {
                return value.code
            });
        }
        if(codes.length<=0){
            ME.vm.$alert(lang['attendanceArea']+fenceData.cname+lang['attendanceInitDataNote'], lang['dataError'], {
                confirmButtonText: lang['confirm'],
            });
            return false;
        }
        vm.$http.post(ME.host + '/project/attendance/start', {codes}).then((res) => {
            var allPersonNum = codes.length,
                attendeesNum = 0;
            if(res.body.isOk){
                var datas = res.body.data;
                for(var code in datas){
                    var data = datas[code];
                    data.x = Number(data.x);
                    data.y = Number(data.y);

                    if(data.time) data.time = Number(data.time);

                    data.showDetails = false;
                    ME.vm.tagCat.data.forEach((value) => {
                        if(value.id == data.catId){
                            data.tagCat = value.cname;
                        }
                    })

                    data.tagDisappear = 60000;
                    ME.vm.tagType.data.forEach((value) => {
                        if(value.id == data.typeId){
                            data.tagDisappear = value.tagDisappear;
                        }
                    })

                    var tag = ME.tags[code];
                    if(!tag) {
                        // console.log(code + ' not in ME.tags ');
                        // data.cname = 'T'+code.substr(4);
                        continue;

                    }else {
                        data.cname = tag.alias;
                    }

                    if(!data.time){
                        data.status = lang['offline'];
                    }else{
                        if(moment().subtract('second',data.tagDisappear/1000).isAfter(moment(data.time))){
                            data.status = lang['offline'];
                        }else{
                            var flag = false;
                            if(data.map.split('_')[1] == ME.currentMapId){
                                flag = UBIT.isInPolygon2D({x:data.x,y:data.y},fencePoly);
                            }
                            data.status = flag?lang['arrived']:lang['notArrived'];
                            if(flag){
                                attendeesNum++;
                            }
                        }
                    }
                    _attendance.totalAttendeesDatas.push(data);
                }
                _attendance.datas['totalAttendees'].number = allPersonNum;
                _attendance.datas['attendees'].number = attendeesNum;
                _attendance.datas['absentee'].number = allPersonNum - attendeesNum;
                return cb();
            }
        })
        return true;
    };
    _attendance.initTables = function (row) {
        var self = this;
        this.pageNum = 1;
        return this.initDatas(row, function () {
            self.setAllData();
        });
    };
    _attendance.setAllData = function () {
        Object.keys(this.datas).forEach((key) => {
            this.setData(key);
        })
    }
    _attendance.setData = function (id) {
        this.datas[id].data = this[`${id}Datas`].slice(this.datas[id].start, this.datas[id].end);
    };
    _attendance.setPageNum = function (pageNum, id) {
        this.datas[id].pageNum = pageNum;
        this.setData(id);
    }
    _attendance.setPageSize = function (pageSize, id) {
        this.datas[id].pageSize = pageSize;
        this.setData(id);
    }
    _attendance.getDetails = function(code,cb){
        var end = moment().format('YYYY-MM-DD HH:mm:ss');
        var start = moment().format('YYYY-MM-DD 00:00:00');
        var sourceId = '';
        ME.vm.tag.data.forEach((value) => {
            if(value.code === code){
                sourceId = value.id;
            }
        })
        vm.$http.post(ME.host + '/super/fenceLog/byCodes',{
            codes:[sourceId],
            fenceId:_attendance.fenceData.id,
            end,
            start
        }).then((res) => {
            var fences = {};
            ME.vm.fence.data.map((value) => {
                fences[value.id] = value.cname;
            })

            //filter datas
            var logs = res.body.data.filter(function (value) {
                if(fences[value.fenceId]) return true;
                return false;
            });

            var details = [];
            logs.sort(function(a,b){
                return a.inTime > b.inTime;
            }).forEach((value) => {
                var str1 = `${moment(value.inTime).format('YYYY-MM-DD HH:mm:ss')} 进入${fences[value.fenceId]}`;
                details.push(str1);
                if(value.outTime){
                    var str2 = `${moment(value.outTime).format('YYYY-MM-DD HH:mm:ss')} 离开${fences[value.fenceId]}`;
                    details.push(str2);
                }
            })
            if(details.length < 1){
                details.push(lang['noDate']);
            }
            return cb(null,details);
        });
    }
    _attendance.showDetails = function(code){
        _attendance.getDetails(code,(err,details) => {
            _attendance.totalAttendeesDatas = _attendance.totalAttendeesDatas.map((value) => {
                if(value.code === code){
                    value.showDetails = true;
                    value.details = details;
                }
                return value;
            })
        });
    }
    _attendance.hideDetails = function(code){
        _attendance.totalAttendeesDatas = _attendance.totalAttendeesDatas.map((value) => {
            if(value.code === code){
                value.showDetails = false;
            }
            return value;
        })
    }
    return _attendance;
}