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

        if (value.length > 6) {
            callback(new Error(lang['checksNote2']));
            return;
        }

        var tagTypes = $('#tagTypetable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        tagTypes.forEach(function(tagType){
            if(value == tagType.cname && id!=tagType.id){
                callback(new Error(lang['checksNote3Pre']+tagType.cname+lang['checksNote3After']));
                return;
            }
        });
        if(!flag) return;
        callback();
}




function pageInit(){

    $('#tagTypetable').bootstrapTable({
        url:ME.host+'/model/list?model=tag_type',
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
        toolbar:'#tagTypetoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.tagTypeUpdate();
        },

    columns: [
        {radio:true},
        {field: 'id',title: 'ID', width:'6%', sortable:true, searchable:true},
        {field: 'cname',title: lang['cname'],width:'20%', sortable:true, searchable:true},

        {field: 'icon',title: lang['icon'],width:'20%', sortable:true, 
            formatter:function(value, row, index){
                    var html = '<img src="'+ME.imgHost + 'tagTypes_' + row.icon+'" width="40px" height="40px"/>' ;
                    return html;
            },
        searchable:true},
        {field: 'isActive',title: lang['isActive'],width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['true']:lang['false'];
            },
        },
        {field: 'sort',title: lang['sort'],width:'10%', sortable:true, searchable:true},
        {field: 'memo',title: lang['memo'],width:'32%', sortable:true, searchable:true},
        {field: 'tagDisappear',title: lang['tagDisappear'],width:'32%', sortable:true, searchable:true,
            formatter:function(value){
                return parseFloat(value)/1000
            }
        },
        {field: 'addTime',title: lang['addTime'],width:'18%', sortable:true, searchable:true},
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
            projTagTyBtnDisable:false,
            tagTypeDeleteBtnDisable:false,
            isCheckedOk:false,  
            iconName:{
                icon:''    
            },
            iconIndata:'',  
            imgUpload:{
                disabled:false,
                url:ME.host + '/tagType/uploadIcon',
                headers:{
                    api_token:ME.api_token,
                },
                auto:true,
            },

            form: {
              title : lang['addTag'],
              id: '',
              cname : '',
              isActive : 1,
              tagDisappear:600,
              sort : '',
              memo : '',
              icon : '',
              typeIcon:'',
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
            selecttagType:function(){
                var a = $('#tagTypetable').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                for(var i=0;i<a.length;i++){
                    a[i].tagDisappear=parseFloat(a[i].tagDisappear)/1000;
                }
                return a;
            },
            refresh:function(){
                $('#tagTypetable').bootstrapTable('refresh');
            },

            
            checkImgSize:function(file){
                    this.isCheckedOk=false;
                    
                    var _this = this;
                    return new Promise(function(resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            var image = new Image();
                            image.onload = function () {
                                var width = this.width;
                                var height = this.height;
                                // if (width>128 || width < 40||height >128||height< 40){
                                //     ME.vm.isCheckedOk=true;
                                //     reject();
                                // }
                                
                                
                                if(ME.vm.form.icon&&ME.vm.form.icon.length>0){
                                    _this.iconName.icon=ME.vm.form.icon;

                                }
                                resolve();
                            };
                            image.src = event.target.result;
                        }
                        reader.readAsDataURL(file);
                    });
            },
            handleImgUpload:function(response){
                if(response.isOk){
                    ME.vm.form.icon = response.fileName;
                    ME.vm.form.typeIcon=ME.imgHost + 'tagTypes_' +ME.vm.form.icon;

                }
            },

            tagTypeAdd:function(){
                util.emptyObj(ME.vm.form);
                this.dialogFormVisible = true;
                this.form.title = lang['addInfo'];
                this.form.isActive = "1";
                this.form.sort = 1;
                this.form.tagDisappear=600;
            },
            tagTypeUpdate:function(){
                var rows = this.selecttagType();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['tagTypeUpdateNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }

                this.dialogFormVisible = true;
                this.form.title = lang['updateInfo'];
                util.deepCopy(rows[0],ME.vm.form,1);
                // ME.vm.form.icon='';
                ME.vm.form.typeIcon = ME.imgHost + 'tagTypes_' + rows[0].icon;
                this.iconIndata=rows[0].icon;
            },
            tagTypeDelete:function(){
                var rows = this.selecttagType();
                if(!rows) return;
                var row = rows[0];
                if (row.id<=100){
                    this.$alert(lang['tagTypeDeleteNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return;
                }
                this.$confirm(lang['tagTypeDeleteNote2'],lang['prompt'],{ }).then(function(){
                   ME.vm.$http.post('tagType/del', {id:row.id,icon:row.icon}).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                        ME.vm.tagTypeDeleteBtnDisable = false;

                    });
                    ME.vm.tagTypeDeleteBtnDisable = true;

            }).catch(function(){});

            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                      var url = 'model/save/';
                      var msg = (ME.vm.form.id>0?lang['update']:lang['add']);
                      ME.vm.form.model = 'tag_type';

                      var params = {};
                      params.model = 'tag_type';
                      params.id = ME.vm.form.id;
                      params.cname = ME.vm.form.cname;
                      params.sort = ME.vm.form.sort;
                      params.memo = ME.vm.form.memo;
                      params.tagDisappear = parseFloat(ME.vm.form.tagDisappear)*1000;
                      params.icon = ME.vm.form.icon;
                      params.isActive = ME.vm.form.isActive;



                      ME.vm.$http.post(url, params).then(function(res){
                          var result = res.body;
                          if(result.isOk){
                              
                              if(ME.vm.iconIndata&&ME.vm.iconIndata!==params.icon){
                                  ME.vm.$http.post('tagType/delByIcon', {iconName:ME.vm.iconIndata}).then(function(res){

                                  })
                              }
                              this.refresh();
                              this.dialogFormVisible = false;
                              this.$alert(msg+lang['success'], lang['prompt']);
                          }else {
                              this.$alert(msg+lang['fail']+result.msg, lang['prompt'], {
                                  confirmButtonText: lang['confirm']
                              });
                          }
                          ME.vm.projTagTyBtnDisable = false;
                      });
                      ME.vm.projTagTyBtnDisable = true;
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
