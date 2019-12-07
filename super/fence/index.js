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
          callback(new Error(lang['enterContent']));
          return;
        }

        var fences = $('#fencetable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        fences.forEach(function(fence){
            if(value == fence.cname && id!=fence.id){
                callback(new Error(lang['checksNotePre']+fence.cname+lang['checksNoteAfter']));
                return;
            }
        });
        if(!flag) return;
        callback();
}




function pageInit(){

    $('#fencetable').bootstrapTable({
        url:ME.host+'/model/list?model=fence',
        method:'get',
        queryParams:function(params){
            return params;
        },
        search:true,
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
        pageSize:10,
        pageList:[2, 10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#fencetoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.fenceUpdate();
        },

    columns: [
        {radio:true},
        {field: 'id',title: 'ID', width:'20%', sortable:true, searchable:true},
        {field: 'cname',title: lang['cname'],width:'20%', sortable:true, searchable:true},
        {field: 'mapId',title: lang['mapId'],width:'20%', sortable:true, searchable:true,
            formatter:function(value, row, index){
              for (var i=0;i<ME.vm.maps.length;i++){
                var u = ME.vm.maps[i];
                 if(value==u.id){
                     var html = '<a href="javascript:void(0);" onclick="UBIT.openMap('+value+');"  target="_blank" >' +u.cname+"("+u.id+") </a>" ;
                     return html;
                }
              } 
              return value;
            },
        },
        {field: 'ftypeId',title: lang['ftypeId'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                for (var i=0;i<ME.vm.fenceTypes.length;i++){
                    var u = ME.vm.fenceTypes[i];
                    if(value==u.id){
                        return u.cname+"("+u.id+")";
                    }
                }
                return value;
            },
        },

        {field:'tagCat',title:lang['tagCat'],width:'30%',sortable:true,searchable:true,formatter:function(value,row,index){
            var str = value.split(',').map(function(value){
                return ME.vm.tagCatCname[value];
            }).join(',')
            return str;
        }},
        {field: 'trif',title: lang['trif'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                if(value=='i') return lang['trifI'];
                if(value=='o') return lang['trifO'];
                if(value=="io") return lang['trifIo'];
                if(value=="in") return lang['trifIn'];
                return value;
            },
        },
        {field: 'isRecord',title: lang['isRecord'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'isEmail',title: lang['isEmail'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'isSMS',title: lang['isSMS'],width:'20%', sortable:true,searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['true']:lang['false'];
            },
        },

        {field: 'points',title: lang['points'],width:'20%', sortable:true, searchable:true},
        {field: 'isActive',title: lang['isActive'],width:'6%', sortable:true, searchable:true, 
            formatter:function(value, row, index){
                    return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'addTime',title: lang['addTime'],width:'8%', sortable:true, searchable:true},
        {field: 'addUser',title: lang['addUser'],width:'8%', sortable:true, searchable:true},
        {field: 'upTime',title: lang['upTime'],width:'6%', sortable:true, searchable:true},
        {field: 'upUser',title: lang['upUser'],width:'6%', sortable:true, searchable:true},
    ]

});

}

function vueInit(){

    ME.vm = new Vue({
        el:'#app',
        data:{
            dialogFormVisible:false,

            fenceDeleteBtnDisable:false,
            fenceBtnDisable:false,
            have: true,
            maps : [],
            fenceTypes:[],
            tagCatCname:'',
            form: {
              title : lang['addFence'],
              id: '',
              cname : '',
              isActive : 1,
              mapId : '',
              ftypeId : '',
              points : '',
              trif: 'io',
              isRecord : 1,
              isEmail : 0,
              isSMS : 0,
            },
            modefiyPwdRule: {
                cname: [
                    { validator: checks, trigger: 'blur' },
                    { required: true, message: lang['cnameRule'], trigger: 'blur' },
                ]
            },
            formLabelWidth: '120px',
        },
        created:function(){
            var self = this;
            this.$http.get(ME.host+'/model/listBase?model=map').then(function(res){
                this.maps = res.body;

            });
            this.$http.get(ME.host+'/model/listBase?model=fence_type').then(function(res){
                this.fenceTypes = res.body;
                self.$http.get(ME.host + '/model/list?model=tag_category').then(function(res) {
                    self.tagCatCname = {};
                    res.body.forEach(function(value){
                        self.tagCatCname[value.id] = value.cname;
                    });
                    pageInit();
                })
            });

        },
        methods:{
            selectfence:function(){
                var a = $('#fencetable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            refresh:function(){
                $('#fencetable').bootstrapTable('refresh');
            },
            fenceAdd:function(){
                util.emptyObj(ME.vm.form);
                this.dialogFormVisible = true;
                this.form.title = lang['addInfo'];
            },
            fenceUpdate:function(){
                var rows = this.selectfence();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['fenceUpdateNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                this.dialogFormVisible = true;
                this.form.title = lang['updateInfo'];
                util.deepCopy(rows[0],ME.vm.form,1);
                
                ME.vm.form.typeIcon = ME.iconPath + ME.vm.form.icon; 

            },
            fenceDelete:function(){
                var rows = this.selectfence();

                if(!rows) return;
                var row = rows[0];
                this.$confirm(lang['fenceDeleteNote'],lang['prompt'],{ }).then(function() {

                    ME.vm.fenceDeleteBtnDisable = true;

                    ME.vm.$http.post('fence/delete', {id:row.id}).then(function(res){
                        ME.vm.fenceDeleteBtnDisable = false;

                        var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }

                    });

            }).catch(function(){

                });

            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                    
                      var url = 'fence/save/';
                      var msg = (ME.vm.form.id>0?lang['update']:lang['add']);
                      ME.vm.form.model = 'fence';

                      var params = {};
                      params.model = 'fence';
                      params.id = ME.vm.form.id;
                      params.cname = ME.vm.form.cname;
                      params.mapId = ME.vm.form.mapId;
                      params.ftypeId = ME.vm.form.ftypeId;
                      params.points = ME.vm.form.points;
                      params.isActive = ME.vm.form.isActive;
                      params.trif = ME.vm.form.trif;
                      params.isRecord = ME.vm.form.isRecord;
                      params.isEmail = ME.vm.form.isEmail;
                      params.isSMS = ME.vm.form.isSMS;

                      ME.vm.fenceBtnDisable = true;

                      ME.vm.$http.post(url, params).then(function(res){

                          ME.vm.fenceBtnDisable = false;

                          var result = res.body;
                          if(result.isOk){
                              this.refresh();
                              this.dialogFormVisible = false;
                              this.$alert(msg+lang['success'], lang['prompt']);
                          }else {
                              this.$alert(msg+lang['fail']+result.msg, lang['prompt'], {
                                  confirmButtonText: lang['confirm']
                              });
                          }
                      });

                  } else {
                    ME.vm.$alert(lang['enterError'], lang['prompt'], {
                      confirmButtonText: lang['confirm']
                    }); 
                    return false;
                  }
                })
              },
        },
    });

}
