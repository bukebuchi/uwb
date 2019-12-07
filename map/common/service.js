/**
 * Created by zwt on 2017/6/24 0024.
 */
var service  = (function() {
    var cache = {};
    /**
     * resource配置
     * @param  {[string]} route [路径地址]
     * @param  {[object]} $this [vue对象]
     * @return {[function]}     [resource service]
     */
    return function(route, $vue) {
        if(!cache[route]) {
            var tempObj = {
                add: {method: 'POST', url: route +'/add{?param}'},
                list: {method: 'GET', url: route +'/list{?param}'},
                delete: {method: 'POST', url: route +'/delete{?param}'},
                update: {method: 'POST', url: route +'/update{?param}'},
                save: {method: 'POST', url: route +'/save{?param}'}
            }
            var source = Vue.resource;
            if($vue && $vue.$resource){
                source = $vue.$resource;
            }
            cache[route] = source('{?param}', {}, tempObj);
        }
        return cache[route];
    }
})();

