/**
 * Created by LiuTao on 2017/7/03 0028.
 */



$(function(){
    init();
});

function init(){
    vueInit();
}

function pageInit(){

    $('#heartRateLogtable').bootstrapTable({
        url:ME.host+'/heartRateLog/list',
        method:'get',
        queryParams:function(params){
            //组装查询参数
            var timeSpan = ME.vm.timeRange();
            if(!timeSpan){
                return;
            }
            var searchParams = ME.vm.searchform;
            params.timeStart = timeSpan[0];
            params.timeEnd = timeSpan[1];
            params.tag=searchParams.tag;
            // if(searchParams.mapId>0) params.map = ME.user.projectCode+'_'+searchParams.mapId;
            if(searchParams.mapId>0) params.mapId = searchParams.mapId;
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
        sortName:'status',
        sortOrder:'asc',
        pagination:true,
        pageSize:25,
        pageList:[10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#heartRatetoolbar',
    columns: [
        // {field: 'id',title: 'ID', width:'4%', sortable:true, searchable:true},
        {field: 'tag',title: '标签',width:'10%', sortable:true,searchable:true},
        {field: 'anchor',title: '基站',width:'10%', sortable:true, searchable:true},
        {field: 'mapId',title: '地图',width:'16%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                    var map = ME.vm.getEntity(value, 'maps');
                // return '<a href="javascript:void(0);" onclick="UBIT.openMap('+map.id+');"  target="_blank" >' +map.cname+"("+map.id+") </a>" ;
                    if(!map){
                        return value;
                    }
                    return map.cname;
            },
        },
        {field: 'heartRate',title: '心率',width:'6%', sortable:true, searchable:true},
        {field: 'status',title: '心率状态',width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var showText=''
                switch(value){
                    case 'normal':showText='<span style="color:green;">正常</span>';break;
                    case 'abnormal':showText='<span style="color:red;">异常</span>';break;
                }
                return showText;
            }
        },
        {field: 'time',title: '记录时间',width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var date = new Date(value);
                return date.toLocaleString();
            }
        },
    ]

});

}

function vueInit(){

    ME.vm = new Vue({
        el:'#app',
        data:{
            maps : [],
            heartRateBtnDisable :false,
            clearTableDisable:false,
            tags : [],
            searchform: {
            //   timespan : [new Date((new Date()).getTime()-3600 * 1000 * 24), new Date((new Date()).getTime()+3600 * 1000 * 24)],
              timespan : [new Date((new Date()).getTime()-3600 * 2000), new Date((new Date()).getTime()+ 3600 * 1000 * 24)],
              mapId : '',
              tag : ''
            },
            formLabelWidth: '120px',
            pickerOptions:{
                shortcuts: [
                    {
                        text: '最近一天',
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近两天',
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三天',
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                    text: '最近一周',
                    onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                    {
                        text: '最近30天',
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
                this.maps = res.body;
                this.$http.get(ME.host+'/project/tag/list').then(function(res){
                    this.tags = res.body;
                    pageInit();
                })
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
            timeRange:function(){
                var range = this.searchform.timespan;
                var span =  range[1].getTime() - range[0].getTime();
                //时间范围 1秒 -  7天;
                if(span<1){
                    this.showTip('起始时间需要小于结束时间，请选择合理的时间范围！');
                    return false;
                }else {
                    if(span>30*24*3600*1000){
                        this.showTip('时间范围不能大于30天，请选择合理的时间范围！');
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
            clearTable:function(){
                var form = this.searchform;
                this.$confirm("确认清除掉所有的原始数据么？","提示",{ }).then(function() {
                    ME.vm.clearTableDisable = true;
                    var start = form.timespan[0];
                    var end = form.timespan[1];
                    var mapId = form.mapId;
                    var tag = form.tag;
                    var url = ME.host+'/heartRateLog/clearTable?tag=' + tag + '&mapId=' + mapId + '&start=' + start + '&end=' + end;
                    ME.vm.$http.get(url).then(function(res){
                        ME.vm.clearTableDisable = false;
                        var result = res.body;
                        if(result.isOk){
                            this.refresh();
                            this.$alert("清除成功！", '提示');
                        }else {
                            this.$alert("清除失败！", '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    });
                }).catch(function (){  ME.vm.clearTableDisable = false;});
            },
            refresh:function(){
                $('#heartRateLogtable').bootstrapTable('refresh');
            },
            resetForm:function(formName) {
                this.$refs[formName].resetFields()
              },
        },
    });

}
