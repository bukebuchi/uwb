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

        var forceRemoveData = $('#forceRemovetable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        forceRemoveData.forEach(function(forceRemove){
            if(value == forceRemove.cname && id!=forceRemove.id){
                callback(new Error(lang['checksNote2Pre']+forceRemove.cname+lang['checksNote2After']));
                return;
            }
        });
        if(!flag) return;
        callback();
}


function pageInit(){

    $('#forceRemovetable').bootstrapTable({
        url:ME.host+'/super/forceRemove/list',
        method:'get',
        queryParams:function(params){
            
            var timeSpan = ME.vm.timeRange();
            if(!timeSpan){
                return;
            }
            var searchParams = ME.vm.searchform;
            params.timeStart = timeSpan[0];
            params.timeEnd = timeSpan[1];
            if(searchParams.mapId>0) params.mapId = searchParams.mapId;
            if(searchParams.tagId>0) params.tagId = searchParams.tagId;
            return params;
        },
        search:true,
        showRefresh:true,
        idField:'id',
        uniqueId:'id',
        clickToSelect:true,
        singleSelect:false,
        sortable:true,
        striped:true,
        showColumns:true,
        sortName:'id',
        sortOrder:'desc',
        pagination:true,
        pageSize:25,
        pageList:[2,5,10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#forceRemovetoolbar',
    columns: [
        // {field: 'id',title: lang['id'], width:'4%', sortable:true, searchable:true},
        {field: 'tag',title: lang['tagId'], width:'4%', sortable:true, searchable:true},
        {field: 'anchor',title: lang['anchor'],width:'10%', sortable:true, searchable:true
        },
        {field: 'mapId',title: lang['mapId'],width:'16%', sortable:true, searchable:true,
            formatter:function(value,row,index){
                return ME.vm.id2name(value,'map');
            }
        },
        {field: 'forceRemoveType',title: lang['forceRemoveType'],width:'20%', sortable:true, searchable:true},
        {field: 'time',title: lang['addTime'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var date = new Date(value);
                return date.toLocaleString();
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
            tags : [],
            tagSourceId:'0',
            selectMapFences:'',
            mapId:'0',

            forceRemoveBtnDisable :false,
            clearTableDisable:false,
            searchform: {
              timespan : [new Date((new Date()).getTime()-3600 * 1000 * 24), new Date((new Date()).getTime()+ 3600 * 1000 * 24)],
              mapId : '',
              tagId : ''
            },
            formLabelWidth: '120px',
            pickerOptions:{
                shortcuts: [
                    {
                        text: lang['note1'],
                        onClick:function onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: lang['note2'],
                        onClick:function onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: lang['note3'],
                        onClick:function onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: lang['note4'],
                        onClick:function onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                    {
                        text: lang['note5'],
                        onClick:function onClick(picker) {
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
                this.maps = res.body;
                this.$http.get(ME.host+'/model/listBase?model=tag').then(function(res){
                    this.tags = res.body;
                    pageInit();
                });
            });
        },
        methods:{
            search:function(){
                this.refresh();
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
            id2name:function(id,type){
                switch(type){
                    case 'tag': var tags=ME.vm.tags;
                        for(var i=0;i<tags.length;i++){
                        if(id==tags[i].id){
                            return tags[i].alias;
                        };
                    }break;
                    case 'map':var maps=ME.vm.maps;
                    for(var i=0;i<maps.length;i++){
                        if(id==maps[i].id){
                            return maps[i].cname;
                        }
                    };break;
                }
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
            showTip:function(msg){
                this.$message({
                    showClose: true,
                    message: msg
                });
            },
            selectRows:function(){
                var a = $('#forceRemovetable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                        ME.vm.$alert(lang['selectRowsNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            clearTable:function(){
                var form = this.searchform;
                this.$confirm(lang['clearTableNote'],lang['prompt'],{ }).then(function() {
                    ME.vm.clearTableDisable = true;
                    var start = form.timespan[0];
                    var end = form.timespan[1];
                    var mapId = form.mapId;
                    var tag = form.tagId;
                    var url = ME.host+'/super/forceRemove/clearTable?tag=' + tag + '&mapId=' + mapId + '&start=' + start + '&end=' + end;
                    ME.vm.$http.get(url).then(function(res){
                        ME.vm.clearTableDisable = false;
                        var result = res.body;
                        if(result.isOk){
                            this.refresh();
                            this.$alert(lang['clearSuccess'], lang['prompt']);
                        }else {
                            this.$alert(lang['clearFail']+result.msg, lang['prompt'], {
                                confirmButtonText: lang['confirm']
                            });
                        }
                    });
                }).catch(function (){  ME.vm.clearTableDisable = false;});
            },
            refresh:function(){
                $('#forceRemovetable').bootstrapTable('refresh');
            },
            resetForm:function(formName) {
                this.$refs[formName].resetFields()
              },

        },
    });

}
