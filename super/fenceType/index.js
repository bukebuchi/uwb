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
        if (value === '') {
          callback(new Error(lang['checksNote']));
          return;
        }

        var fenceTypes = $('#fenceTypetable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        fenceTypes.forEach(function(fenceType){
            if(value == fenceType.cname && id!=fenceType.id){
                callback(new Error(lang['checksNote2Pre']+fenceType.cname+lang['checksNote2After']));
                return;
            }
        });
        if(!flag) return;
        callback();
}




function pageInit(){

    $('#fenceTypetable').bootstrapTable({
        url:ME.host+'/model/list?model=fence_type',
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
        pageList:[5, 10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#fenceTypetoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.fenceTypeUpdate();
        },

    columns: [
        {radio:true},
        {field: 'id',title: 'ID', width:'2%', sortable:true},
        {field: 'cname',title: lang['cname'],width:'8%', sortable:true, searchable:true},
        {field: 'memo',title: lang['memo'],width:'25%', sortable:true, searchable:true},
        {field: 'wlevel',title: lang['wlevel'],width:'2%', sortable:true,searchable:true},
        {field: 'sort',title: lang['sort'],width:'2%', sortable:true, searchable:true},
        {field: 'isActive',title: lang['isActive'],width:'2%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                    return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'color',title: lang['color'],width:'8%', sortable:true,searchable:true,
          cellStyle:function(value, row, index, field){
                if(value){
                    return {css:
                      {'color':value}
                    };
                }
                return {css:
                      {'color':'#333'}
                    };
            }
        },
        {field: 'opacity',title: lang['opacity'],width:'2%', sortable:true, searchable:true},
        {field: 'audio',title: lang['audio'],width:'10%', sortable:true, searchable:true},

        {field: 'addTime',title: lang['addTime'],width:'20%', sortable:true, searchable:true},
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
            fenceTypeDeleteBtnDisable:false,
            fenceTypeBtnDisable:false,
            have: true,
            form: {
              title : lang['formTitle'],
              id: '',
              cname : '',
              isActive : 1,
              sort : '',
              memo : '',
              wlevel : '',
              color:'',
              opacity : '',
              audio : ''
            },
            modefiyPwdRule: {
                cname: [
                    { validator: checks, trigger: 'blur' },
                    { required: true, message: lang['cnameRule'], trigger: 'blur' },
                    { min: 1, max: 25, message: lang['cnameRule2'], trigger: 'blur' },
                ],
                memo : [
                    { min: 0, max: 50, message: lang['memoRule'], trigger: 'blur' },

                ],
            },
            formLabelWidth: '120px',
        },
        created:function(){
            
        },
        methods:{
            selectfenceType:function(){
                var a = $('#fenceTypetable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            refresh:function(){
                $('#fenceTypetable').bootstrapTable('refresh');
            },
            fenceTypeAdd:function(){
                util.emptyObj(ME.vm.form);
                this.dialogFormVisible = true;
                this.form.title = lang['formTitle2'];
                this.form.isActive = "1";
                this.form.sort = "1";
                this.form.opacity = "0.6";
                this.form.wlevel = "1";
            },
            fenceTypeUpdate:function(){
                var rows = this.selectfenceType();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['fenceTypeUpdateNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                this.dialogFormVisible = true;
                this.form.title = lang['formTitle3'];
                util.deepCopy(rows[0],ME.vm.form,1);
                
                ME.vm.form.typeIcon = ME.iconPath + ME.vm.form.icon; 
            },
            fenceTypeDelete:function(){
                var rows = this.selectfenceType();
                if(!rows) return;
                var row = rows[0];
                if (row.id<100){
                    this.$alert(lang['fenceTypeDeleteNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return;
                }
                this.$confirm(lang['fenceTypeDeleteNote2'],lang['prompt'],{ }).then(function() {

                    ME.vm.$http.post('model/delete', {model:'fence_type',id:row.id}).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                        ME.vm.fenceTypeDeleteBtnDisable = false;
                });
                        ME.vm.fenceTypeDeleteBtnDisable = true;
            }).catch(function(){

                });

            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                      var url = 'model/save/';
                      var msg = (ME.vm.form.id>0?lang['update']:lang['add']);
                      ME.vm.form.model = 'fence_type';

                      var params = {};
                      params.model = 'fence_type';
                      params.id = ME.vm.form.id;
                      params.cname = ME.vm.form.cname;
                      params.sort = ME.vm.form.sort;
                      params.memo = ME.vm.form.memo;
                      params.wlevel = ME.vm.form.wlevel;
                      params.isActive = ME.vm.form.isActive;
                      params.color = ME.vm.form.color;
                      params.opacity = ME.vm.form.opacity;
                      params.audio = ME.vm.form.audio;

                      ME.vm.fenceTypeBtnDisable = true;

                      ME.vm.$http.post(url, params).then(function(res){
                          ME.vm.fenceTypeBtnDisable = false;

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
            resetForm:function(formName) {
                this.$refs[formName].resetFields()
              },

        },
    });

}
