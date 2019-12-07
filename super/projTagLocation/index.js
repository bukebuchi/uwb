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

    $('#tagLocation').bootstrapTable({
        url:ME.host+'/super/tag/listTagLocation',
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
            ME.vm.update();
        },

    columns: [
        {radio:true},
        {field: 'id',title: 'ID', width:'8%',sortable:true, searchable:true},
        {field: 'code',title: lang['code'],width:'10%', sortable:true, searchable:true},
        {field: 'keyword',title: lang['keyword'],width:'10%', sortable:true,searchable:true},
        {field: 'map',title: lang['map'],width:'20%', sortable:true, searchable:true ,formatter:function(value){
            if(!window.maps){
                window.maps = {};
                ME.vm.maps.forEach((map) => {
                    window.maps[map.id] = map;
                })
            }
            return window.maps[value].cname;
        }},
        {field: 'x',title: 'x',width:'10%', sortable:true, searchable:true},
        {field: 'y',title: 'y',width:'10%', sortable:true, searchable:true},
        {field: 'z',title: 'z',width:'10%', sortable:true, searchable:true},
        {field: 'addTime',title: lang['addTime'],width:'40%', sortable:true, searchable:true},
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
            dialogTitle:lang['dialogTitle'],
            tag:null,
            map:null,
            x:null,
            y:null,
            z:0,
            keyword:null,
            tags:[],
            maps:[],
            commitType:null,
            id:null
        },
        created:function(){
            var self = this;
            this.$http.get(ME.host + '/project/tag/list').then((res) => {
                self.tags = res.body;
            })
            this.$http.get(ME.host + "/super/map/list").then((res) => {
                self.maps = res.body;  
                pageInit();
            })
        },
        methods:{
            select:function(){
                var a = $('#tagLocation').bootstrapTable('getSelections');
                if (!a || a.length<1){
                    this.$alert(lang['selectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                return a;
            },
            refresh:function(){
                $('#tagLocation').bootstrapTable('refresh');
            },
            add:function(e){
                this.dialogFormVisible = true;
                this.tag = null;
                this.map = null;
                this.x = null,
                this.y = null,
                this.z = 0;
                this.keyword = null;
                this.dialogTitle = lang['dialogTitle'];
                this.commitType = 'add';
            },
            update:function(e){
                var rows = this.select();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['onlySelectOne'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                this.dialogFormVisible = true;
                this.dialogTitle = lang['dialogTitle2'];
                var selectRow = rows[0];
                this.tag = selectRow.code;
                this.map = selectRow.map;
                this.keyword = selectRow.keyword;
                this.x = selectRow.x;
                this.y = selectRow.y;
                this.z = selectRow.z;
                this.id = selectRow.id;
                this.commitType = 'update';
            },
            deleteTagLocation:function(e){
                var self = this;
                var rows = this.select();
                if(!rows) return;
                if(rows.length>1){
                     this.$alert(lang['deleteTagLocationNote'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
                self.$confirm(lang['deleteTagLocationNote2'],lang['prompt'],{ }).then(function()  {
                    var id = rows[0].id;
                    self.$http.post(ME.host + '/super/tag/deleteTagLocation',{id}).then((res) => {
                        if(res.body.isOk){
                            location.reload();
                        }else{
                            self.$message.warning(res.body.err);
                        }
                    })
                })
            },
            commit:function(e){
                if(this.commitType === 'add'){
                    this.$http.post(ME.host + '/super/tag/addTagLocation',{
                        code:this.tag,
                        map:this.map,
                        x:this.x,
                        y:this.y,
                        z:this.z,
                        keyword:this.keyword
                    }).then((res) => {
                        if(res.body.isOk){
                            location.reload();
                        }else{
                            this.$message.warning(res.body.err);
                        }
                    })
                }else{
                    this.$http.post(ME.host + '/super/tag/updateTagLocation',{
                        id:this.id,
                        code:this.tag,
                        map:this.map,
                        x:this.x,
                        y:this.y,
                        z:this.z,
                        keyword:this.keyword
                    }).then((res) => {
                        if(res.body.isOk){
                            location.reload();
                        }else{
                            this.$message.warning(res.body.err);
                        }
                    })
                }

            },
            cancel:function(e){
                this.dialogFormVisible = false;
            }
        },
    });
}
