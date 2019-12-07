/**
 * Created by LiuTao on 2017/7/7 0028.
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
          callback(new Error(lang['enterContent']));
          return;
        }

        var users = $('#usertable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        users.forEach(function(user){
            if(value.toLowerCase() == user.code.toLowerCase() && id!=user.id){
                callback(new Error(lang['checksNotePre']+user.cname+lang['checksNoteAfter']));
                return;
            }
        });
        if(!flag) return;
        
        callback();
}




function pageInit(){

    $('#usertable').bootstrapTable({
        url:ME.host+'/super/projUser/list',
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
        toolbar:'#usertoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.userUpdate();
        },

    columns: [
        {radio:true,width:'2%'},
        {field: 'id',title: 'ID', width:'2%', searchable:true, sortable:true},
        {field: 'code', title: lang['code'], width:'5%', sortable:true, searchable:true},
        {field: 'cname',title: lang['cname'],width:'5%', sortable:true, searchable:true},
        {field: 'isActive',title: lang['isActive'],width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                    return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'cellphone',title: lang['cellPhone'],width:'10%', sortable:true, searchable:true},
        {field: 'email',title: lang['email'],width:'10%', sortable:true, searchable:true},
        {field: 'birthDate',title: lang['birthDate'],width:'8%', sortable:true, searchable:true},
        {field: 'address',title: lang['address'],width:'28%', sortable:true, searchable:true},
        {field: 'img',title: lang['img'],width:'10%', sortable:true, searchable:true},
        {field: 'addTime',title: lang['addTime'],width:'6%', sortable:true, searchable:true},
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
            projUserBtnDisable:false,
            userDeleteBtnDisable:false,
            form: {
              title : lang['addInfo'],
              code: '',
              id: '',
              cname: '',
              isActive : 1,
              cellphone : '',
              email : '',
              birthDate : '',
              address: '' ,
              img  : '',
            },
            modefiyPwdRule: {
                  code: [
                      { required: true, message: lang['codeRule'], trigger: 'blur' },
                      { min: 3, max: 25, message: lang['codeRule2'], trigger: 'blur' },
                      { validator: checks, trigger: 'blur' }
                  ],
                  cname: [
                        { required: true, message: lang['cnameRule'], trigger: 'blur' },
                        { min: 1, max: 6, message: lang['cnameRule2'], trigger: 'blur' },
                  ],
                  cellphone : [
                    { min: 0, max: 15, message: lang['cellPhoneRule'], trigger: 'blur' },
                  ],
                email : [
                    { min: 0, max: 64, message: lang['emailRule'], trigger: 'blur' },
                ],
                address : [
                    { min: 0, max: 127, message: lang['addressRule'], trigger: 'blur' },
                ]
            },
            formLabelWidth: '120px',
        },
        created:function(){
        },
        methods:{
            selectUser:function(){
                var a = $('#usertable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a[0];
            },
            refresh:function(){
                $('#usertable').bootstrapTable('refresh');
            },
            userAdd:function(){
                util.emptyObj(ME.vm.form);
                this.dialogFormVisible = true;
                this.form.title = lang['addInfo'];
                this.form.isActive = "1";
            },
            userDelete:function(){
                var row = this.selectUser();
                if(!row) return;
                this.$confirm(lang['userDeleteNotePre']+row.cname+lang['userDeleteNoteAfter'],lang['prompt'],{ }).then(function() {

                    ME.vm.$http.post('super/projUser/delete', row).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                        ME.vm.userDeleteBtnDisable = false;

                    });
                    ME.vm.userDeleteBtnDisable = true;

            }).catch(function(){

                });

            },
            userUpdate:function(){
                var row = this.selectUser();
                if(!row) return;
                this.dialogFormVisible = true;
                this.form.title = lang['updateInfo'];
                util.deepCopy(row,ME.vm.form,true);
            },
            resetPwd : function(){
                var row = this.selectUser();
                if(!row) return;
                this.$confirm(lang['resetPwdPre']+row.cname+lang['resetPwdMid']+row.code+lang['userDeleteNoteAfter'],lang['prompt'],{ }).then(function() {
                    var params = {id:row.id,newPassword:row.code};
                    ME.vm.$http.post('super/projUser/resetPwd', params).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            this.$alert(lang['resetPwdSuccess'], lang['prompt']);
                        }else {
                            this.$alert(lang['resetPwdFail']+result.msg, lang['prompt'], {
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
                      var url = 'super/projUser/save';
                      var msg = (ME.vm.form.id>0?lang['update']:lang['add']);
                      ME.vm.form.id>0?'':ME.vm.form.pswd=ME.vm.form.code;

                      var params = {};
                      util.deepCopy(ME.vm.form,params);
                      
                      if(ME.vm.form.birthDate){
                          var date = new Date(ME.vm.form.birthDate);
                          params.birthDate = date.Format('yyyy-MM-dd');
                      }

                      ME.vm.$http.post(url, params).then(function(res){
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
                          ME.vm.projUserBtnDisable = false;
                      });
                      ME.vm.projUserBtnDisable = true;
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
