/**
 * 检查session
 * 
 * 注意：所有的前端目录都只能是两级目录
 *  
 *  add by zwt 2017-06-09
 */

;(function(){
    var searchParam = UBIT.parseSearch(false);
    //是否url中指定只查看单个标签的运行轨迹
    if(searchParam.anony) {
		return true;
    }
    //如果cookie userData 不存在，则需要重新登录
    var res = UBIT.checkSession(UBIT.selfHost + '/login/index.html');
    if(location.href.indexOf('map2d') !== -1){
      UBIT.initLang('frontMap')
    }
    if(!res) return false;

})();