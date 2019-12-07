$(function () {
    init();
});


function init() {

ME.vm = new Vue({
    el: '#app',
    data() {
        return {
            start: null,
            dialogVisible: false,
            end: '18:00',
            start: '06:00',
            maps: [],
            selectMaps: "",
            members: [],
            fences: [],
            fencesData: [],
            member: 1,
            fence: [],
            startDate: '',
            endDate:'',
            taskList: [],
            selectRow: null,
            update: false,
            addTaskButtonText: lang['add'],
            addTaskButtonDisable: false,
            history:{},
            currentHistory:[],
            currentAllHistory:[],
            dateRange:'',
            historyVisible:false,
            _historyDate:null,
            get historyDate(){
                if(this._historyDate){
                    return moment(this._historyDate).format('YYYY-MM-DD');
                }else{
                    return moment().format('YYYY-MM-DD');
                }
            },
            set historyDate(value){
                this._historyDate = value;
            }
        }
    },
    methods: {
        add: function () {
            this.end = '18:00';
            this.start = '06:00'
            this.date = "";
            this.member = null;
            this.startDate = '';
            this.endDate = '';
            
            this.selectMaps = "";
            this.fence = [];
            this.dialogVisible = true;
            this.update = false;
            this.addTaskButtonDisable = false;
            this.addTaskButtonText = lang['add'];
        },
        addTask: function () {
            var sourceId = this.member;
            var start = this.start;
            var end = this.end;
            var date = this.date;
            var fence = this.fence.join(',');
            var startDate = moment(this.startDate).format('YYYY-MM-DD');
            var endDate = moment(this.endDate).format('YYYY-MM-DD');
            var self = this;
            var mapId = this.selectMaps;
            if (!sourceId) {
                return this.$message({
                    type: 'warning',
                    message: lang['sourceIdRule']
                });
            }
            if (!end) {
                return this.$message({
                    type: 'warning',
                    message: lang['endRule']
                });
            }

            if (this.fence.length <= 0) {
                return this.$message({
                    type: 'warning',
                    message: lang['fenceRule']
                });
            }
            var url;
            if (!this.update) {
                url = ME.host + '/project/polling/addTask';
                this.$http.post(url, { sourceId, start, end, fence,startDate,endDate,mapId}).then((result) => {
                    self.dialogVisible = false;
                    refreshTable();
                });
            } else {
                var id = self.selectRow.id;
                var taskId = self.selectRow.taskId;
                url = ME.host + '/project/polling/updateTask';
                this.$http.post(url, { sourceId, start, end, fence, id, taskId,mapId }).then((result) => {
                    self.dialogVisible = false;
                    refreshTable();
                });
            }
        },
        getTaskList: function () {
            var url = ME.host + '/project/polling/taskList';
            this.$http.get(url).then((result) => {
                console.log(result);
            })
        },
        deleteTask: function () {
            var taskId = this.selectRow.taskId;
            var id = this.selectRow.id;
            var url = ME.host + '/project/polling/deleteTask?taskId=' + taskId + '&id=' + id;
            this.$confirm(lang['deleteTaskNote'], lang['prompt'], {
                confirmButtonText: lang['confirm'],
                cancelButtonText: lang['cancel'],
                type: 'warning'
            }).then(() => {
                this.$http.get(url).then((result) => {
                    refreshTable();
                    this.$message({
                        type: 'success',
                        message: lang['deleteSuccess']
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: lang['deleteCancel']
                });
            })
        },
        updateTask: function () {
            var self = this;
            var row = this.selectRow;
            if (!this.selectRow) {
                return self.$alert(lang['prompt'], {
                    type: 'message',
                    message: lang['selectOne']
                });
            }
            if (row.status !== 1) {
                self.addTaskButtonDisable = true;
            }
            self.update = true;
            self.dialogVisible = true;
            self.member = ME.tags[row.sourceId].sourceId;
            self.end = row.end;
            self.start = row.start;
            self.fence = [];
            self.addTaskButtonText = lang['updateTask'];
        },
        selectMap: function(event){
            var self = this;
            this.fences = this.fenceData.filter((value) =>{
                return self.selectMaps === value.mapId;
            })
        },
        historyDateChange:function(e){
            if(e === moment().format('YYYY-MM-DD')){
                this.currentHistory = this.currentAllHistory;
            }else{
                this.currentHistory = this.currentAllHistory.filter(function(value){
                    return moment(value.inTime).format('YYYY-MM-DD') === e;
                })
            }

        },
        getFence:function (fenceId) {
            for(var i=0;i<this.fenceData.length;i++){
                var f = this.fenceData[i];
                if(f.id == fenceId){
                    return f;
                }
            }
            return null;
        }

    },
    mounted: function () {
        var projectId = ME.user.projectId;
        var self = this;

        this.$http.get(ME.host + '/super/map/list').then((result) => {
            self.maps = result.body;
        });

        this.$http.get(ME.host + '/pollingFence/list').then((result) => {
                this.fenceData = result.body;
                this.$http.get(ME.host + '/project/tag/list?projectId=' + projectId + '&sort=id&order=desc&offset=0&limit=10').then(function (result) {
                    var self = this;
                    result.body.forEach((value) => {
                        ME.tags[value.sourceId] = value;
                    })
                    this.members = result.body;
                    $('#projectPolling').bootstrapTable({
                        url: ME.host + '/project/polling/taskList',
                        method: 'get',
                        queryParams: function (params) {
                            return params;
                        },
                        search: true,
                        showRefresh: true,
                        idField: 'id',
                        uniqueId: 'id',
                        clickToSelect: true,
                        singleSelect: true,
                        sortable: true,
                        striped: true,
                        showColumns: true,
                        sortName: 'id',
                        sortOrder: 'desc',
                        pagination: true,
                        pageSize: 10,
                        pageList: [5, 10, 25, 50, 100, 200],
                        sidePagination: 'client',
                        toolbarAlign: 'left',
                        toolbar: '#projectPollingtoolbar',









                        onCheck: function (row) {
                            self.dateRange = row.startDate + ' >>> ' + row.endDate;
                            self.selectRow = row;
                        },
                        onPostBody:function(){
                            $('.history').click(function(e){
                                var id = this.id;
                                if(self.history[id].length <= 0){
                                    self.$alert(lang['prompt'],{
                                        type:'warning',
                                        message:lang['onPostBodyNote']
                                    });
                                    return;
                                }
                                self.currentAllHistory =  self.currentHistory = self.history[id].map(function(value){
                                    var alias = ME.tags[value.tagSourceId].alias;
                                    var cname = '';
                                    self.fenceData.forEach(function(fence){
                                        if(value.fenceId === fence.id){
                                            cname = fence.cname;
                                        }
                                    })
                                    return {
                                        alias:alias,
                                        fence:cname + '(' + value.fenceId + ')',
                                        inTime:moment(value.inTime).format('YYYY-MM-DD hh:mm:ss'),
                                        outTime:moment(value.outTime).format('YYYY-MM-DD hh:mm:ss')
                                    };
                                });
                                self.historyVisible = true;
                            })
                        },
                        columns: [
                            { radio: true, width: '4%' },
                            {
                                field: 'sourceId', title: lang['sourceId'], width: '8%', sortable: true, searchable: true, formatter: function (value, row, index) {
                                    if (!ME.tags[value]) {
                                        return self.$alert(lang['prompt'], {
                                            type: 'warning',
                                            message: lang['sourceIdRule2']
                                        })
                                    }
                                    return ME.tags[value].alias;
                                }
                            },
                            { field: 'start', title: lang['start'], width: '4%', sortable: true, searchable: true },
                            { field: 'end', title: lang['end'], width: '4%', sortable: true, searchable: true },
                            {
                                field: 'fenceIds', title: lang['fenceIds'], width: '8%', formatter: function (value, row, index) {
                                    var fenceData = self.fenceData;
                                    var str = '';
                                    for (var i = 0; i < fenceData.length; i++) {
                                        var fence = fenceData[i];
                                        for (var j = 0; j < value.split(',').length; j++) {
                                            var val = value.split(',')[j];
                                            if (fence.id == val) {
                                                str += fence.cname + '(' + val + ')</br>';
                                            }
                                        }
                                    }
                                    return str;
                                }
                            },
                            {
                                field:'mapId',title:lang['mapId'],width:'4%',sortable: true, searchable: true,
                                formatter: function (value, row, index) {
                                    var maps = self.maps;
                                    for (var i = 0; i < maps.length; i++) {
                                        var map = maps[i];
                                        if(value==map.id){
                                            return map.cname;
                                        }
                                    }
                                    return value;
                                }
                            },
                            {
                                field: 'status', title: lang['status'], width: '8%', sortable: true, searchable: true, formatter: function (value, row, index) {
                                    var arr = ['<span class="devare">'+lang['status1']+'</span>', '<span class="doing">'+lang['status2']+'</span>', '<span class="finish">'+lang['status3']+'</span>', '<span class="warning">'+lang['status4']+'</span>']
                                    return arr[value];
                                }
                            },
                            {
                                field: 'startDate', title: lang['startDate'], width: '4%', sortable: true, searchable: true
                            },
                            {
                                field: 'endDate', title: lang['endDate'], width: '4%', sortable: true, searchable: true
                            },
                            {
                                field: 'addTime', title: lang['addTime'], width: '8%', sortable: true, searchable: true, formatter: function (value, row, index) {
                                    return moment(value).format('YYYY-MM-DD hh:mm:ss');
                                }
                            },
                            {
                                field: 'history', title: lang['history'],width: '4%',formatter:function(value,row,index){







                                    var flag = new Date().getTime();
                                    self.history[flag] = value;
                                    return `<button class='history el-button el-button--primary el-button--small' id=${flag}>`+lang['history']+`</button>`;
                                }
                            },
                            {
                                field: 'taskInfo', title: lang['taskInfo'], formatter:function(value,row,index){
                                    if(value){
                                        var html = '';
                                        for(var i=0;i<value.done.length;i++){
                                            var val = value.done[i];
                                            var f = self.getFence(val.fenceId);
                                            if(!f) continue;

                                            html += '<span class="finish">'+lang['area']+'('+f.cname+')' + lang['taskInfoStatus'];
                                            html += (new Date(val.inTime)).Format("yyyy-MM-dd hh:mm:ss") +lang['taskInfoStatus2'];
                                            html += (new Date(val.outTime)).Format("yyyy-MM-dd hh:mm:ss") +lang['out'];
                                            html += '</span></br>';
                                        }

                                        for(var i=0;i<value.undo.length;i++){
                                            var val = value.undo[i];
                                            var f = self.getFence(val.fenceId);
                                            if(!f) continue;

                                            html += '<span class="warning">'+lang['area']+'('+f.cname+')' + lang['taskInfoStatus4'];
                                            html += '</span></br>';
                                        }
                                        return html;
                                    }
                                }
                            },
                            {field: 'upTime',title: lang['upTime'],width:'6%', sortable:true, searchable:true},
                            {field: 'upUser',title: lang['upUser'],width:'6%', sortable:true, searchable:true},
                        ]
                    })
                })
        })

    }
});


}


function refreshTable() {
    $('#projectPolling').bootstrapTable('refresh');
}