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

        var tagCates = $('#tagCatetable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        tagCates.forEach(function(tagCate){
            if(value == tagCate.cname && id!=tagCate.id){
                callback(new Error(lang['checksNote2Pre']+tagCate.cname+lang['checksNote2After']));
                return;
            }
        });
        if(!flag) return;
        callback();
}




function pageInit(){

    $('#tagCatetable').bootstrapTable({
        url:ME.host+'/model/list?model=tag_category',
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
        toolbar:'#tagCatetoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.tagCateUpdate();
        },

    columns: [
        {radio:true},
        {field: 'id',title: 'ID', width:'8%', sortable:true},
        {field: 'cname',title: lang['cname'],width:'20%', sortable:true, searchable:true},
        {field: 'color',title: lang['color'],width:'20%', sortable:true, 
          cellStyle:function(value, row, index, field){
                if(value){
                    return {css:
                      {'color':value}
                    };
                }
                 return {css:
                      {'color':'#333'}
                    };
            },

        searchable:true},
        {field: 'sort',title: lang['sort'],width:'20%', sortable:true, searchable:true},
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
            projTagCaBtnDisable:false,
            tagCateDeleteBtnDisable:false,
            predefineColor:['#0000ff','#00ff00','orange','yellow'],
            form: {
              title : lang['addTag'],
              id: '',
              cname : '',
              sort : '',
              color : '#0000ff',
            },
            styleObj: {},
            modefiyPwdRule: {
                 cname: [
                      { validator: checks, trigger: 'blur' },
                      { required: true, message: lang['cnameRule'], trigger: 'blur' },
                     { min: 1, max: 25, message: lang['cnameRule2'], trigger: 'blur' },
                 ]
            },
            formLabelWidth: '120px',
        },
        created:function(){
            
        },
        methods:{
            selecttagCate:function(){
                var a = $('#tagCatetable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            refresh:function(){
                $('#tagCatetable').bootstrapTable('refresh');
            },
            tagCateAdd:function(){
                util.emptyObj(ME.vm.form);
                this.dialogFormVisible = true;
                this.form.title = lang['addInfo'];
                this.form.sort = "1";
            },
            tagCateUpdate:function(){
                var rows = this.selecttagCate();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['onlySelectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                this.dialogFormVisible = true;
                this.form.title = lang['updateInfo'];
                util.deepCopy(rows[0],ME.vm.form,1);

            },
            tagCateDelete:function(){
                var rows = this.selecttagCate();
                if(!rows) return;
                var row = rows[0];
                if (row.id<100){
                    this.$alert(lang['tagCateDeleteNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return;
                }
                this.$confirm(lang['delete'],lang['prompt'],{ }).then(function()  {

                    ME.vm.$http.post('model/delete', {model:'tag_category',id:row.id}).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                        ME.vm.tagCateDeleteBtnDisable = false;

                    });
                        ME.vm.tagCateDeleteBtnDisable = true;

            }).catch(function(){

                });

            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                      var url = 'model/save/';
                      var msg = (ME.vm.form.id>0?lang['update']:lang['add']);
                      ME.vm.form.model = 'tag_category';

                      var params = {};
                      params.model = 'tag_category';
                      params.id = ME.vm.form.id;
                      params.cname = ME.vm.form.cname;
                      params.sort = ME.vm.form.sort;
                      params.color = ME.vm.form.color;

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
                          ME.vm.projTagCaBtnDisable = false;
                      });
                      ME.vm.projTagCaBtnDisable = true;
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
