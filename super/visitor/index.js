/**
 * Created by LiuTao on 2017/7/03 0028.
 */



$(function(){
    init();
});

function init(){
    vueInit();
    pageInit();
}

function checks (rule, value, callback) {

}




function pageInit(){

    $('#visitorTable').bootstrapTable(Object.assign({
        url:ME.host+'/super/visitor/list',
        method:'get',
        queryParams:function(params){
            return params;
        },
    },ME.vm.tableCf));
}

function vueInit(){

    ME.vm = new Vue({
        el:'#app',
        data:{
            visitorBtnDisable:false,
            visitorDeleteBtnDisable:false,
            visitorAddBtnDisable:false,
            visitorSearchBtnDisable:false,
            isShowAll:'',
            howTo:'binding',
            searchform: {
                timespan : [new Date((new Date()).getTime()-3600 * 1000 * 24), new Date((new Date()).getTime()+3600 * 1000 * 24)],
                searchform : '',
            },
            form: {
              title : lang['formTitle'],
              id:0,
              tagCode: '',
              tagId : '',
              tagAlias : '',
              tagMac : '',
              status:'',
              cname:'',
              phone:'',
              company:'',
              responser:'',
              identification:'',
              memo:'',
            },
            regBindData:[],
            modefiyPwdRule: {
                cname: [
                    { required: true, message: lang['cnameRule'], trigger: 'blur' },
                    { min: 1, max: 32, message: lang['cnameRule2'], trigger: 'blur' },
                ],
                tagCode:[
                    { required: true, message: lang['tagCodeRule'], trigger: 'blur' },
                    { min: 8, max: 8, message: lang['tagCodeRule2'], trigger: 'blur' },
                ]
            },
            formLabelWidth: '120px',

            tableCf:{
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
                sortOrder:'memo',
                pagination:true,
                pageSize:10,
                pageList:[5, 10, 25, 50, 100, 200],
                sidePagination:'client',
                toolbarAlign:'left',
                toolbar:'#visitortoolbar',
                onDblClickRow:function(row, $element){
                    ME.vm.visitorUpdate();
                },
                onLoadSuccess:function(data){
                    ME.regBindData=data;
                },

                columns: [
                    {checkbox:true},
                    
                    {field: 'tagCode',title: lang['tagCode'],width:'7%', sortable:true, searchable:true},
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    {field: 'cname',title: lang['cname'],width:'6%', sortable:true, searchable:true,
                        formatter: function (value, row, index) {
                            if (value) {
                               if(row&&row.tagCode&&row.regStatus=='binding'){
                                   return `<a href='javascript:0' onclick="(function(){
                                    var url= UBIT.selfHost + '/map/map2d/svg/follow/?tag=${row.tagCode}';
                                    window.open(url);
                                })()">${value}</a>`;
                               }else{
                                   return value;
                               }
                            }
                        }
                    },

                    {field: 'addTime',title: lang['addTime'],width:'17%', sortable:true, searchable:true,
                        formatter: function (value, row, index) {
                            if (value) {
                                var date = new Date(value);
                                return date.toLocaleString();
                            }
                            return value;
                        }
                    },
                    
                    
                    
                    
                    
                    
                    
                    
                    {field: 'closeTime',title: lang['closeTime'],width:'17%', sortable:true, searchable:true,
                        formatter: function (value, row, index) {
                            if (value) {
                                var date = new Date(value);
                                return date.toLocaleString();
                            }
                            return value;
                        }
                    },


                    {field: 'phone',title: lang['phone'],width:'15%', sortable:true, searchable:true},

                    {field: 'identification',title: lang['identification'],width:'20%', sortable:true, searchable:true},
                    {field: 'company',title: lang['company'],width:'20%', sortable:true, searchable:true},

                    {field: 'responser',title: lang['responser'],width:'6%', sortable:true, searchable:true},

                    {field: 'memo',title: lang['memo'],width:'20%', sortable:true, searchable:true},
                    {field: 'upTime',title: lang['upTime'],width:'6%', sortable:true, searchable:true},
                    {field: 'upUser',title: lang['upUser'],width:'6%', sortable:true, searchable:true},
                ]
            }
        },
        created:function(){
        },
        methods:{
            selectVisitor:function(){
                var a = $('#visitorTable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            refresh:function(){
                $('#visitorTable').bootstrapTable('refresh');
            },

            cancelChange:function(){
                util.emptyObj(ME.vm.form);
                ME.vm.howTo='binding';
            },
            visitorShowAll:function(){
                $('#visitorTable').bootstrapTable('load',ME.regBindData);
                ME.vm.isShowAll='';
            },
            visitorUpdate:function(){
                
                if(ME.vm.isShowAll=='show') return;
                var rows = this.selectVisitor();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['onlySelectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                if(rows[0].regStatus=='closed'){
                    this.$alert(lang['visitorUpdateNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                util.emptyObj(ME.vm.form);
                util.deepCopy(rows[0],ME.vm.form,1);
                ME.vm.howTo='closed';


                
            },
            visitorDelete:function(){
                var rows = this.selectVisitor();

                if(!rows) return;
                this.$confirm(lang['visitorDeleteNote'],lang['prompt'],{ }).then(function()  {

                    var ids=[];
                    for(var i=0;i<rows.length;i++){
                        ids.push(rows[i].id);
                    }
                    ME.vm.$http.post('super/visitor/del', {ids:ids}).then(function(res){
                    var result = res.body;
                        if(result.isOk){
                            this.$alert(lang['deleteSuccess'], lang['prompt']);
                            this.refresh();
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                        ME.vm.visitorDeleteBtnDisable = false;

                    });
                        ME.vm.visitorDeleteBtnDisable = true;

            }).catch(function(){

                });

            },
            followMap:function(code){
                if(code){return}
                var url='/map/map2d/svg/follow/'+code;
                window.open(url);
            },
            
            getDetail:function(){
            
                if(!ME.vm.form.tagCode) return;
            var params={tagCode:ME.vm.form.tagCode};
            var url='super/visitor/getTagDetailsBycode';
                ME.vm.$http.post(url, params).then(function (res) {
                    var resoult=res.data;
                    if(resoult.isOk){
                    
                        ME.vm.form.id=resoult.res.id;
                        ME.vm.form.tagId=resoult.res.tagId;
                        ME.vm.form.tagMac=resoult.res.mac;
                        ME.vm.form.tagAlias=resoult.res.alias;
                    
                        if(resoult.res.hasOwnProperty('regStatus')&&resoult.res.regStatus=='binding'){
                        
                            ME.vm.howTo='closed';
                            ME.vm.form.cname=resoult.res.cname;
                            ME.vm.form.phone=resoult.res.phone;
                            ME.vm.form.company=resoult.res.company;
                            ME.vm.form.responser=resoult.res.responser;
                            ME.vm.form.identification=resoult.res.identification;
                            ME.vm.form.memo=resoult.res.memo;
                            ME.vm.form.status=lang['status'];
                        }else{
                            ME.vm.howTo='binding';
                            ME.vm.form.status=lang['status3'];
                        }
                    }else{
                        this.$alert(resoult.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                })

            },

            getLog:function(){
                var url='super/visitor/getLog';
                var params={};
                var timeSpan = ME.vm.timeRange();
                if(timeSpan&&timeSpan.length>1){
                    params.timeStart = timeSpan[0];
                    params.timeEnd = timeSpan[1];
                }
                if(ME.vm.searchform.searchValue){
                    params.searchValue=ME.vm.searchform.searchValue;
                }
                ME.vm.$http.post(url, params).then(function (res) {
                    ME.vm.visitorBtnDisable = false;
                    var result = res.body;
                    if (result.isOk) {
                        $('#visitorTable').bootstrapTable('load',result.res);
                        ME.vm.isShowAll='show';
                        ME.vm.searchform.searchValue='';
                    } else {
                        this.$alert(lang['getLog'], lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                });


                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
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
            submitForm:function (formName,action) {
                var _this=this;
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                      var url = 'super/visitor/';
                      var msg = '';
                      var params = {};
                      params.id = ME.vm.form.id;
                      params.tagCode = ME.vm.form.tagCode;
                      params.tagId = ME.vm.form.tagId;
                      switch(action){
                          case 'add':
                              delete params.id;
                              params.cname=ME.vm.form.cname;
                              params.phone=ME.vm.form.phone;
                              params.company=ME.vm.form.company;
                              params.identification=ME.vm.form.identification;
                              params.responser=ME.vm.form.responser;
                              params.memo=ME.vm.form.memo;
                              url+='add';
                              msg=lang['action'];
                              break;
                          case 'update':
                              params.cname=ME.vm.form.cname;
                              params.phone=ME.vm.form.phone;
                              params.company=ME.vm.form.company;
                              params.identification=ME.vm.form.identification;
                              params.responser=ME.vm.form.responser;
                              params.memo=ME.vm.form.memo;
                              url+='update';
                              msg=lang['update'];
                              break;
                          case 'unReg':
                              params.alias='T'+ME.vm.form.tagCode.slice(4);
                              url+='unReg';
                              msg= lang['status3'] ;
                              break;
                      }
                      

                          ME.vm.$http.post(url, params).then(function (res) {
                              ME.vm.visitorBtnDisable = false;

                              var result = res.body;
                              if (result.isOk) {
                                  this.refresh();
                                  this.dialogFormVisible = false;
                                  util.emptyObj(ME.vm.form);

                                  
                              } else {
                                  this.$alert(msg + lang['fail'] + result.msg, lang['prompt'], {
                                      confirmButtonText: lang['confirm']
                                  });
                              }
                          });

                      
                  } else {
                    
                    
                    
                    return false;
                  }
                })
              },

        }
    });

}
