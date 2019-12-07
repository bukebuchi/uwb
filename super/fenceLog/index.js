/**
 * Created by LiuTao on 2017/7/03 0028.
 */



$(function(){
    init();
});

function init(){
    vueInit();
}

function checks (rule, value, callback) {
        if (value === '') {
          callback(new Error(lang['checksNote']));
          return;
        }

        var fenceLogs = $('#fenceLogtable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        fenceLogs.forEach(function(fenceLog){
            if(value == fenceLog.cname && id!=fenceLog.id){
                callback(new Error(lang['checksNote2Pre']+fenceLog.cname+lang['checksNote2After']));
                return;
            }
        });
        if(!flag) return;
        callback();
}


function pageInit(){

    $('#fenceLogtable').bootstrapTable({
        url:ME.host+'/super/fenceLog/list',
        method:'get',
        queryParams:function(params){
            
            var timeSpan = ME.vm.timeRange();
            if(!timeSpan){
                return;
            }
            var searchParams = ME.vm.searchform;
            params.timeType = searchParams.timeType;
            params.timeStart = timeSpan[0];
            params.timeEnd = timeSpan[1];
            if(searchParams.mapId>0) params.mapId = searchParams.mapId;
            if(searchParams.fenceId>0) params.fenceId = searchParams.fenceId;
            if(searchParams.tagId>0) params.tagId = searchParams.tagId;
            return params;
        },
        search:false,
        showRefresh:true,
        idField:'id',
        uniqueId:'id',
        clickToSelect:true,
        singleSelect:true,
        sortable:true,
        striped:true,
        showColumns:true,
        sortName:'id',
        sortOrder:'desc',
        pagination:true,
        pageSize:50,
        pageList:[10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#fenceLogtoolbar',
    columns: [
        
        
        {field: 'fenceId',title: lang['fenceId'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var entity = ME.vm.getEntity(value, 'fences');
                if(entity){
                    return entity.cname;
                }
                return value;
            },
        },
        {field: 'mapId',title: lang['mapId'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var fence = ME.vm.getEntity(row.fenceId, 'fences');
                if(fence){
                    var map = ME.vm.getEntity(fence.mapId, 'maps');
                    
                    return map.cname;
                }
                return value;
            },
        },
        {field: 'tagSourceId',title: lang['tagId'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                if(value){
                    for(var i=0;i<ME.vm.tags.length;i++){
                        var tag = ME.vm.tags[i];
                        if(value==tag.sourceId){
                            if(tag.alias) return tag.alias;
                            return tag.code;
                        }
                    }
                }
                return value;
            },
        },
        {field: 'inTime',title: lang['inTime'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                if(value){
                    return new Date(value).toLocaleString();
                }
                return value;
            },
        },
        {field: 'outTime',title: lang['outTime'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                if(value){
                    return new Date(value).toLocaleString();
                }
                return lang['noOut'];
            },
        },
        {
            field: 'stopTime', title: lang['stopTime'], width: '30%', sortable: true, searchable: true,
            formatter: function (value, row, index) {
                var mss=value;
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = (mss % (1000 * 60)) / 1000;
                return days + lang['day'] + hours + lang['hour'] + minutes + lang['minute'] + seconds + lang['second'];
            }
        }
    ]

});

}

function vueInit(){

    ME.vm = new Vue({
        el:'#app',
        data:{
            maps : [],
            fences : [],
            map_fences:{},
            selectMapFences:[],
            fenceLogBtnDisable :false,
            clearTableDisable :false,
            tags : [],
            searchform: {
              timeType: 'in',
              timespan : [new Date((new Date()).getTime()-3600 * 1000 * 24), new Date((new Date()).getTime()+3600 * 1000 * 24)],
              mapId : '',
              fenceId : '',
              tagId : ''
            },
            modefiyPwdRule: {
               
            },
            formLabelWidth: '120px',
            pickerOptions:{
                shortcuts: [
                    {
                        text: lang['shortcutsNote'],
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: lang['shortcutsNote2'],
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: lang['shortcutsNote3'],
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                    text: lang['shortcutsNote4'],
                    onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                    {
                        text: lang['shortcutsNote5'],
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
        },
        created:function(){
            this.$http.get(ME.host+'/model/listBase?model=map').then(function(res){
                // if(!res.body.isOk){
                //     return console.log(res.body.msg)
                // }
                this.maps = res.body;
                // console.log(this.maps);
                this.maps.unshift({id:'',cname:lang['all']});

                this.$http.get(ME.host+'/model/listBase?model=fence').then(function(res){
                    this.fences = res.body;

                    this.map_fences = {};
                    this.fences.forEach(function(f){
                        ME.vm.maps.forEach(function(m){
                            if(m.id == f.mapId){
                                if(!ME.vm.map_fences[m.id]){
                                    ME.vm.map_fences[m.id] = [{id:'',cname:lang['all']}];
                                }
                                ME.vm.map_fences[m.id].push(f);
                            }
                        });
                    });

                    this.$http.get(ME.host+'/model/list?model=tag').then(function(res){
                        this.tags = res.body;
                        this.tags.unshift({id:'',sourceId:'',alias:lang['all']});
                        pageInit();
                    });
                });
            });
        },
        methods:{
            search:function(){
                this.refresh();
            },
            clearTable:function(){
                this.$confirm(lang['clearTableNote'],lang['prompt'],{ }).then(function() {
                    ME.vm.$http.get(ME.host+'/super/fenceLog/clearTable').then(function(res){
                        ME.vm.clearTableDisable = false;
                        var result = res.body;
                        if(result.isOk){
                            this.refresh();
                            this.$alert(lang['clearSuccess'], lang['prompt']);
                        }else {
                            this.$alert(lang['clearFail']+result.msg, lang['prompt'], {
                                confirmButtonText: lang['confrim']
                            });
                        }
                    });
                }).catch(function(){
                    ME.vm.clearTableDisable = false;
                });
                ME.vm.clearTableDisable = true;
            },
            getEntity:function(id,key){
                var datas = this[key];
                for(var i=0;i<datas.length;i++){
                    if(id == datas[i].id){
                        return datas[i];
                    }
                }
                return null;
            },
            timeRange:function(){
                var range = this.searchform.timespan;
                var span =  range[1].getTime() - range[0].getTime();
                
                if(span<1){
                    this.showTip(lang['timeRangeNote']);
                    return false;
                }else {
                    if(span>30*24*3600*1000){
                        this.showTip(lang['timeRangeNote2']);
                        return false;
                    }
                }
                var start = range[0].Format('yyyy-MM-dd hh:mm:ss');
                var end = range[1].Format('yyyy-MM-dd hh:mm:ss');
                return [start, end];
            },
            selectMap:function(mapId){
                this.searchform.fenceId = '';
                this.selectMapFences = this.map_fences[mapId];
            },
            showTip:function(msg){
                this.$message({
                    showClose: true,
                    message: msg
                });
            },
            refresh:function(){
                $('#fenceLogtable').bootstrapTable('refresh');
            },
            resetForm:function(formName) {
                this.$refs[formName].resetFields()
              },

        },
    });

}
