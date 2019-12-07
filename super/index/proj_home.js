(function(){
    vueInit();
})();


function vueInit(){
    ME.vm = new Vue({
        el:'#container',
        data: Object.assign({
            enableMoreMonitor:true,
            enableHeartRate:true,
            enableAggregate:true,
            enableStillness:true,
            enableOutlier:true,
            enableAttendance:true,

            total:{
                tag:0,
                anchor:0,
                fence:0,
                map:0
            },
        },allChart),
        created:function(){
            this.getTotalCount();
            this.getTagLine();
            this.getAnchorLine();
            this.getHeartRate();
            this.getTotalAlert();

            this.getAggregateAbnormal();
            this.getStillnessAbnormal();

            // this.getPolices();
            // this.getVistor();
            // this.tagChart();


            this.outlierChart();

        },

        mounted:function(){
            this.getAttendance();
        },
        methods:{
            getTotalCount:function () {
                this.$http.get(ME.host+'/statistics/getTotalCount').then(function(res){
                    if(res.body.hasOwnProperty('isOk') && !res.body.isOk){
                        console.error(res.body.msg);return;
                    }
                    this.total = res.body;
                })
            },

            getTagLine:function(){
                this.$http.get(ME.host+'/statistics/getTagByProj').then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.chartTag.series[0].data=this.chartTag.series[1].data=result.data.online;
                        this.chartTag.yAxis.max=result.data.total;
                    }
                    var chart=Highcharts.chart('chartTag', this.chartTag);
                })
            },

            getAnchorLine:function(){
                this.$http.get(ME.host+'/statistics/getBaseAnchorsByProj').then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.chartAnchor.yAxis.max=result.data.total;
                        this.chartAnchor.series[0].data=this.chartAnchor.series[1].data=result.data.online;
                    }
                    Highcharts.chart('chartAnchor', ME.vm.chartAnchor);
                })
            },

            getTimeSpan:function () {
                var nowDate = new Date();
                var timeStart = new Date();
                timeStart.setMonth(nowDate.getMonth()-1);

                var params={
                    timeStart: Math.ceil(timeStart.getTime()/1000),
                    timeEnd: Math.ceil(nowDate.getTime()/1000),
                };
                return params;
            },

            getHeartRate:function(){
                var params = this.getTimeSpan();

                this.$http.post(ME.host+'/statistics/getHeartRate', params).then(function(res){
                    var result = res.body;
                    if(result.isOk){

                        this.heartRate.series[0].data=result.data;
                        this.heartRate.drilldown.series=result.drilldown;

                        this.setClumnColors('heartRate');
                    }
                    Highcharts.chart('heartRate', ME.vm.heartRate);
                })
            },

            getTotalAlert:function(){
                var params = this.getTimeSpan();
                this.$http.post(ME.host+'/statistics/getTotalAlert', params).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        var cates = [];
                        var datas = [];
                        for(var data of result.data){
                            cates.push(data.name);
                            datas.push(data.value);
                        }
                        this.chartAlert.xAxis.categories=cates;
                        this.chartAlert.series[0].data=datas;
                    }
                    Highcharts.chart('chartAlert', ME.vm.chartAlert);
                })
            },

            getAggregateAbnormal:function(){
                var params = this.getTimeSpan();
                this.$http.post(ME.host+'/statistics/aggregateAbnormal', params).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.aggregateAbnormal.series[0].data=result.data; //地图
                        this.aggregateAbnormal.drilldown.series=result.drilldown; //标签

                        this.setClumnColors('aggregateAbnormal');
                    }
                    Highcharts.chart('aggregateAbnormal', ME.vm.aggregateAbnormal);
                })
            },
            getStillnessAbnormal:function(){
            var params = this.getTimeSpan();
            this.$http.post(ME.host+'/statistics/stillnessAbnormal', params).then(function(res){
                var result = res.body;
                if(result.isOk){
                    this.stillnessAbnormal.series[0].data=result.data; //地图
                    this.stillnessAbnormal.drilldown.series=result.drilldown; //标签

                    this.setClumnColors('stillnessAbnormal');
                }
                Highcharts.chart('stillnessAbnormal', ME.vm.stillnessAbnormal);
            })
            },

            outlierChart:function(){
                var params = this.getTimeSpan();
                this.$http.post(ME.host+'/statistics/moreMonitor', params).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.outlier.series[0].data=result.data; //地图
                        this.outlier.drilldown.series=result.drilldown; //标签
    
                        this.setClumnColors('outlier');
                    }
                    Highcharts.chart('outlier', ME.vm.outlier);
                })
            },

            setClumnColors:function(type){
                if(this[type].series[0].data.length<10){
                    this[type].plotOptions.column.pointWidth=30;
                }
                var maxNum=0;
                for(var i=0;i<this[type].series[0].data.length;i++){
                    var item=this[type].series[0].data[i];
                    if(maxNum<item.y) maxNum=item.y;
                }
                var full=Math.ceil(maxNum/0.8);
                var colors=[];
                for(var j=0;j<this[type].series[0].data.length;j++){
                    var item=this[type].series[0].data[j];
                    var willColor=Math.ceil((item.y/full)*100);
                    // fillData.push(full-willColor);
                    if(willColor<25){
                        colors.push('#b2d8f1')
                    }else if(willColor<50){
                        colors.push('#8fcaf5')
                    }else if(willColor<75){
                        colors.push('#6abcf8')
                    }else{
                        colors.push('#42adfc')
                    }
                }
                this[type].colors=colors;
            },
            getAttendance:function(){
                $('#attendance_chart').bootstrapTable({
                    url:ME.host+'/statistics/getAttendanceData',
                    method:'post',
                    queryParams:function(params){
                        return params;
                    },
                    search:true,
                    showRefresh:true,
                    idField:'attName',
                    uniqueId:'attName',
                    clickToSelect:true,
                    singleSelect:false,
                    sortable:true,
                    striped:true,
                    showColumns:true,
                    sortOrder:'desc',
                    pagination:true,
                    pageSize:10,
                    pageList:[2, 10, 25, 50, 100, 200],
                    sidePagination:'client',
                    columns:[
                        {field: 'attName',title: '考勤区', width:'2%', sortable:true,  searchable:true},
                        {field: 'shouldNum', title: '应到', width:'5%', sortable:true, searchable:true}, 
                        {field: 'actualNum',title: '实到',width:'6%', sortable:true, searchable:true},
                        {field: 'noNum',title: '未到',width:'6%', sortable:true, searchable:true},
                    ]
                })
            },
        }
    })
};