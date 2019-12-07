/**
 * Created by Administrator on 2017/12/23/023.
 */


function vueMessage() {
    ME.messages = new Vue({
        methods: {
            privChecks: function privChecks() {
                this.showTip(lang['privChecksNote'], "../../../super/index/");

            },
            showTip:function (msg, url){
                this.$alert(msg, lang['prompt'], {
                    confirmButtonText: lang['confirm'],
                    callback: function callback() {
                        if(url) top.location.href = url;
                    }
                });
            }
        }
    });
}


function privCheck() {
    if (ME.user && ME.user.projectId < 1) {
        jqAlert(lang['systemHint'],lang['privChecksNote'],function(){
            top.location.href = "../../../super/index/";
        })
        return false;
    }

    ME.searchParam = UBIT.parseSearch(!1);

    //指定全局的 项目 和 地图
    var projectCode = null;
    var mapId = 0;

    if(ME.user && ME.user.projectCode){
        projectCode = ME.user.projectCode;
    }
    if (ME.searchParam.map) {
        var map = ME.searchParam.map;
        if(ME.searchParam.map.indexOf('_')>-1){
            projectCode = map.split('_')[0];
            mapId = map.split('_')[1];
        }else {
            mapId = ME.searchParam.map;
        }
    }else {
        mapId = DataManager.getDefaultMapId();
    }
    ME.projectCode = projectCode;
    ME.currentMapId = mapId;
    ME.anony = ME.searchParam.anony;
    //anony指定匿名
    if (ME.anony) {
        return true;
    }
    //超级管理员+map
    if(!ME.searchParam.map){
        return true;
    }

    if(ME.user.userType!='super' && ME.searchParam.map.indexOf('_')>-1 && ME.searchParam.map.indexOf(projectCode)!=0){
        jqAlert(lang['systemHint'],lang['noPrivilegeNote'],function(){
            top.location.href = "../../../super/index/";
        })
        return false;
    }

    return true;
}
