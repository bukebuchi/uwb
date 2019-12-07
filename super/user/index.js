/**
 * Created by LiuTao on 2017/6/30 0028.
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
          callback(new Error('请输入内容'));
          return;
        }

        var users = $('#usertable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        users.forEach(function(user){
            if(value == user.code && id!=user.id){
                callback(new Error('您的账号和'+user.cname+'冲突，请确保唯一'));
                return;
            }
        });
        if(!flag) return;
        callback();
}




function pageInit(){

    $('#usertable').bootstrapTable({
        url:ME.host+'/super/user/list',
        method:'get',
        queryParams:function(params){
            return params;
        },
        search:true,
        showRefresh:true,
        idField:'id',
        uniqueId:'id',
        clickToSelect:true,
        // height:700,
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
        {radio:true},
        {field: 'id',title: 'ID', width:'2%', sortable:true, searchable:true},
        {field: 'code', title: '账号', width:'4%', sortable:true, searchable:true},
        {field: 'cname',title: '姓名',width:'6%', sortable:true, searchable:true},
        {field: 'userType',title: '用户类型',width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                    if(value == 'super'){
                        return '超级管理员'
                    }
                    if(value == 'manager'){
                        return '项目管理员'
                    }
                    if(value == 'self'){
                        return '内部职员'
                    }
                    if(value == 'proj_user'){
                        return '项目用户'
                    }
            },
        },
        {field: 'isActive',title: '是否激活',width:'5%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                    return value>0?'是':'否';
            },
        },
        {field: 'cellphone',title: '电话',width:'10%', sortable:true, searchable:true},
        {field: 'email',title: '邮箱',width:'10%', sortable:true, searchable:true},
        {field: 'birthDate',title: '出生日期',width:'8%', sortable:true, searchable:true},
        {field: 'address',title: '住址',width:'40%', sortable:true, searchable:true},
        {field: 'img',title: '头像',width:'10%', sortable:true, searchable:true},
        {field: 'projectId',title: '项目',width:'6%', sortable:true, searchable:true, 
            formatter:function(value, row, index){
                if(value>0){
                    return row.projectName+"("+row.projectCode+")";
                }
                return '';
            },
        },
        {field: 'addTime',title: '添加时间',width:'6%', sortable:true, searchable:true},

    ]

});

}

function vueInit(){

    ME.vm = new Vue({
        el:'#app',
        data:{
            projects : [],
            userType : [
                {
                    code : "super",
                    cname : "超级管理员"
                },
                {
                    code : "manager",
                    cname : "项目管理员"
                },
                {
                    code : "self",
                    cname : "内部职员"
                },
                {
                    code : "proj_user",
                    cname : "项目用户"
                }
            ],
            dialogFormVisible:false,
            userBtnDisable:false,
            userDeleteBtnDisable:false,
            form: {
              title : '添加信息',
              code: '',
              id: '',
              cname: '',
              userType : '',
              isActive : 1,
              cellphone : '',
              email : '',
              birthDate : '',
              address: '' ,
              img  : '',
              projectId : ''
            },
            modefiyPwdRule: {
                  code: [
                      { required: true, message: '请输入用户账号', trigger: 'blur' },
                      { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' },
                      { validator: checks, trigger: 'blur' }
                  ],
                  userType : [
                    { required: true, message: '请输入用户类型', trigger: 'change' },
                  ],
                  cname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
                  ],
                cellphone : [
                    { min: 0, max: 15, message: '长度在 0 到 15个字符', trigger: 'blur' },
                ],
                email : [
                    { min: 0, max: 64, message: '长度在 0 到 64个字符', trigger: 'blur' },
                ],
                address : [
                    { min: 0, max: 127, message: '长度在 1 到 127个字符', trigger: 'blur' },
                ]

            },
            formLabelWidth: '120px',
        },
        created:function(){
            this.$http.get('project/list').then(function(res){
                this.projects = res.body;
                this.projects.unshift({id:0,cname:'无'});
            });
        },
        methods:{
            selectUser:function(){
                var a = $('#usertable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert('请选择一行记录！', '提示', {
                        confirmButtonText: '确定'
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
                this.form.title = "添加信息";
                this.form.isActive = "1";
            },
            userDelete:function(){
                var row = this.selectUser();
                if(!row) return;
                this.$confirm("确认删除用户“"+row.cname+"”？","提示",{ }).then(function() {

                    ME.vm.$http.post('super/user/delete', row).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert("删除成功！", '提示');
                    }else {
                        this.$alert("删除失败！"+result.msg, '提示', {
                            confirmButtonText: '确定'
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
                this.form.title = "修改信息";
                util.deepCopy(row,ME.vm.form,true);
            },
            resetPwd : function(){
                var row = this.selectUser();
                if(!row) return;
                this.$confirm("确认重置密码?确认之后，用户“"+row.cname+"”的密码将直接重置为“"+row.code+"”","提示",{ }).then(function()  {
                    var params = {id:row.id,newPassword:row.code};
                    ME.vm.$http.post('super/user/resetPwd', params).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            this.$alert("密码重置成功！", '提示');
                        }else {
                            this.$alert("密码重置失败！"+result.msg, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    });
                }).catch(function(){

                });
            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                      var url = 'super/user/';
                      url+= (ME.vm.form.id>0?'update':'add');
                      var msg = (ME.vm.form.id>0?'修改':'添加');
                      ME.vm.form.id>0?'':ME.vm.form.pswd=ME.vm.form.code;
                      var params = {};
                      util.deepCopy(ME.vm.form,params);

                      //生日转换
                      if(ME.vm.form.birthDate){
                          var date = new Date(ME.vm.form.birthDate);
                          params.birthDate = date.Format('yyyy-MM-dd');
                      }

                      ME.vm.$http.post(url, params).then(function(res){
                          var result = res.body;
                          if(result.isOk){
                              this.refresh();
                              this.dialogFormVisible = false;
                              this.$alert(msg+"成功！", '提示');
                          }else {
                              this.$alert(msg+"失败！"+result.msg, '提示', {
                                  confirmButtonText: '确定'
                              });
                          }
                          ME.vm.userBtnDisable = false;
                      });
                      ME.vm.userBtnDisable = true;
                  } else {
                    ME.vm.$alert('您输入的有错误，请注意查看！', '提示', {
                      confirmButtonText: '确定'
                    }); 
                    return false;
                  }
                })
              },

        },
    });

}

