/**
 * conf method
 * Created by zwt on 2018/12/10.
 */

//'super/tag/updateCfg/'

function getCfgData(conf) {
    return {
        cfFormVisible:false,            //控制配置参数表单修改
        cfForm:{
            title:lang['cfFormTitle'],
            id:'',
            ids:[],
            cfg:[],
            key:'',
            value:'',
            desc:''
        },
        cfConf:conf,   //配置参数配置信息
        filterCfconf:[],   //
    }
}


var CONF_VUE_METHODS = {
//配置参数修改提交
    cfSubmit:function (formName, url) {
        this.$refs[formName].validate(function(valid){
            if (valid) {
                if(!ME.vm.cfForm.ids||ME.vm.cfForm.ids.length<1){
                    alert(lang['selectRowNote'], lang['prompt']);
                    return;
                }
                //拼接第一行参数配置
                if(ME.vm.cfForm.key){
                    var firstCf=ME.vm.cfForm.cfg.find(function(v){return v.key==ME.vm.cfForm.key});
                    if(!firstCf){
                        var cfOthor={};
                        cfOthor.key=ME.vm.cfForm.key;
                        cfOthor.value=ME.vm.cfForm.value;
                        cfOthor.desc=ME.vm.cfForm.desc;
                        ME.vm.cfForm.cfg.push(cfOthor);
                    }
                }
                //过滤掉未做修改的无用项,去除无效/重复数据
                if(!ME.vm.cfForm.cfg)return;
                var cfgMapData=ME.vm.cfForm.cfg.filter(function(item){
                    if(item.key){
                        return true;
                    }
                });
                var params = {};
                params.ids = ME.vm.cfForm.ids;
                params.cfg = JSON.stringify(cfgMapData);

                ME.vm.$http.post(url, params).then(function(res){
                    ME.vm.mapBtnDisable = false;
                    var result = res.body;
                    if(result.isOk){
                        this.refresh();
                        this.cfFormVisible = false;
                        UBIT.emptyObj(ME.vm.cfForm);
                        ME.vm.cfForm.cfg=[];
                        this.$alert(lang['updateCfgSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['updateCfgFail']+result.msg, lang['prompt'], {
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

    setCf:function(){
        var rows = this.selectRows();
        if(!rows) return;
        UBIT.emptyObj(ME.vm.cfForm);
        ME.vm.cfForm.cfg=[];
        this.cfForm.title = "配置参数信息";
        this.cfFormVisible=true;
        // UBIT.deepCopy(rows[0],ME.vm.cfForm,1);
        //回显配置参数
        ME.vm.cfForm.id=rows[0].id;
        for(var i=0;i<rows.length;i++){
            ME.vm.cfForm.ids.push(rows[i].id);
        }
        var cfg = rows[0].cfg ? rows[0].cfg:rows[0].cfgMap;
        if(cfg){
            var rowCfconf=JSON.parse(cfg);
            ME.vm.cfForm.cfg=rowCfconf.filter(function(item){
                if(item.key){
                    return true;
                }
            });
        }
        this.filterSelectedCfconf();
    },

    showDes:function(v){
        var cfItem=ME.vm.cfConf.find(function(it){return it.key==v});
        if (!cfItem) return;
        ME.vm.cfForm.value=cfItem.value;
        ME.vm.cfForm.desc=cfItem.des;
        this.filterSelectedCfconf();

    },
    showNewItemDes:function(v){
        if(!v.value){
            var cfItem=ME.vm.cfConf.find(function(it){return it.key==v.key});
            if (!cfItem) return;
            v.value=cfItem.value;
            v.desc=cfItem.des;
        }
        this.filterSelectedCfconf();
    },
    filterSelectedCfconf:function(){
        var selectedCfconf=[];
        selectedCfconf=selectedCfconf.concat(ME.vm.cfForm.cfg);
        if(ME.vm.cfForm.key){
            var firstCf=selectedCfconf.find(function(v){return v.key==ME.vm.cfForm.key});
            if(!firstCf){
                var cfOthor={};
                cfOthor.key=ME.vm.cfForm.key;
                cfOthor.value=ME.vm.cfForm.value;
                cfOthor.desc=ME.vm.cfForm.desc;
                selectedCfconf.push(cfOthor);
            }
        }

        if(!selectedCfconf||selectedCfconf.length<1){
            ME.vm.filterCfconf=ME.vm.cfConf;
            return
        }
        ME.vm.filterCfconf=ME.vm.cfConf.filter(function(cf){
            var flag=true;
            for(var i=0;i<selectedCfconf.length;i++){
                var item=selectedCfconf[i];
                if(cf.key==item.key){
                    flag=false;
                    break;
                }
            }
            return flag;
        });
    },

    //配置参数添加一行
    addRow:function addRow(){
        this.cfForm.cfg.push({
            key:'',
            value:'',
            desc:''
        });
    },
    // 配置参数删除一行
    removeRow:function removeRow(item){
        var index =  this.cfForm.cfg.indexOf(item)
        if (index !== -1) {
            this.cfForm.cfg.splice(index, 1)
        }
    },

}