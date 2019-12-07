var attendanceFenceTypeId = 4;

$(function () {
    init();
});

function init() {
ME.vm = new Vue({
    el: "#app",
    data: {
        attendanceFences: null,
        maps: {},
        tagCat: {},
        tags: {},
        selectRow: null,
        dialogVisible: false,
        title: lang['report'],
        reportsIsInit: false
    },
    methods: {
        remove: function () {
            var self = this;
            if (!self.selectRow) {
                return self.$alert(lang['selectOne']);
            }
            this.$confirm(lang['removeNote'], lang['prompt'], {}).then(function () {
                ME.vm.fenceDeleteBtnDisable = true;
                ME.vm.$http.post('fence/delete', { id: self.selectRow.id }).then(function (res) {
                    ME.vm.fenceDeleteBtnDisable = false;
                    var result = res.body;
                    if (result.isOk) {
                        self.refresh();
                        self.$alert(lang['deleteSuccess'], lang['prompt']);
                    } else {
                        self.$alert(lang['deleteFail'] + result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }

                });
            })
        },
        getReport: function () {
            var self = this;
            if (!self.selectRow) {
                return self.$alert(lang['selectOne']);
            }
            this.dialogVisible = true;
            $('#tableContent').html(`<table id='reports'></table>`);
            initReportsTable.apply(this);
        },
        refresh:function () {
            $('#list').bootstrapTable('refresh');
        },
        dialogOpen: function () {
            console.log(this, $('#reports'));
        },
        closeDialog: function () {
            this.dialogVisible = false;
        }
    },
    created: function () {
        initData.apply(this).then(() => {
            initTable.apply(this);
        });
    }
})
}


function initData() {
    var self = this;
    var arr = [];
    var urls = {
        map: ME.host + '/super/map/list',
        tagCat: ME.host + '/model/list?model=tag_category',
        tag: ME.host + '/project/tag/list?projectId=' + ME.user.projectId
    }
    Object.values(urls).forEach((url) => {
        arr.push(self.$http.get(url));
    })
    return Promise.all(arr).then((res) => {
        var maps, tagCat, tags;
        res.forEach((value) => {
            if (value.url === urls.map) {
                maps = value.body
            }

            if (value.url === urls.tagCat) {
                tagCat = value.body
            }

            if (value.url === urls.tag) {
                tags = value.body;
            }
        })
        maps.forEach((value) => {
            self.maps[value.id] = value;
        })
        tagCat.forEach((value) => {
            self.tagCat[value.id] = value
        })
        tags.forEach((value) => {
            self.tags[value.sourceId] = value;
        })
        return Promise.resolve();
    })

}
function initTable() {
    var self = this;
    $('#list').bootstrapTable({
        
        url: ME.host + '/model/list?model=fence',
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
        pageList: [10, 25, 50, 100, 200],
        sidePagination: 'client',
        toolbarAlign: 'left',
        toolbar: '#projectAttendanceListtoolbar',
        onDblClickRow: function (row, $element) {
        },
        onCheck: function (row) {
            self.selectRow = row;
        },
        responseHandler: function (res) {
            self.attendanceFences = res.filter((value) => {
                return value.ftypeId === attendanceFenceTypeId;
            });
            return self.attendanceFences;
        },
        columns: [
            { radio: true, width: '4%' },
            { field: 'id', title: 'ID', width: '10%', searchable: true, sortable: true },
            { field: 'cname', title: lang['cname'], width: '10%', searchable: true, sortable: true },
            {
                field: 'mapId', title: lang['mapId'], width: '10%', searchable: true, sortable: true, formatter: function (value, row, index) {
                    return self.maps[value].cname;
                }
            },
            {
                field: 'tagCat', title: lang['tagCat'], width: '10%', searchable: true, sortable: true, formatter: function (value, row, index) {
                    if (value === '') {
                        return lang['allTag'];
                    }
                    return value.split(',').map((value) => {
                        return self.tagCat[value].cname;
                    }).join(',');
                }
            }
        ]
    })
}

function initReportsTable() {
    var self = this;
    $('#reports').bootstrapTable({
        
        url: ME.host + '/project/attendance/getReports',
        method: 'post',
        queryParams: function (query) {
            return Object.assign(query, {
                tagCat: self.selectRow.tagCat,
                fenceId: self.selectRow.id
            });
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
        pageList: [10, 25, 50, 100, 200],
        sidePagination: 'client',
        toolbarAlign: 'left',
        toolbar: '#bar',
        onDblClickRow: function (row, $element) {
        },
        responseHandler: function (res) {
            function getFormatTime(time){
                time = Math.round(time);
                var second = time % 60;
                var minue = Math.floor((time / 60));
                var hour = Math.floor(minue / 60);
                minue = minue % 60;
                return `${hour}`+lang['hour']+`${minue}`+lang['minue']+`${second}`+lang['second'];
            }
            var arr = [];
            for (var sourceId in res.data) {
                var data = Object.assign({
                    id: sourceId
                }, res.data[sourceId]);

                var tag = self.tags[sourceId];
                if(tag){
                    data.code = tag.code;
                    data.alias = tag.alias;
                    data.totalTime = getFormatTime(data.totalTime);
                    arr.push(data);
                }
            }
            return arr;
        },
        columns: [
            
            
            {
                field: 'code', title: lang['code'], width: '10%', searchable: true, sortable: true
            },
            {
                field: 'alias', title: lang['alias'], width: '10%', searchable: true, sortable: true
            },
            {field: 'totalTime', title: lang['totalTime'], width: '10%', searchable: true, sortable: true},
            { field: 'firstInTime', title: lang['firstInTime'], width: '10%', searchable: true, sortable: true },
            { field: 'lastOutTime', title: lang['lastOutTime'], width: '10%', searchable: true, sortable: true },
            
        ]
    })

}