/**
 * gloab 定义
 *
 * 注意：所有的前端目录都只能是两级目录
 *
 */

//const hostIp = window.location.hostname;
    // const hostIp = "192.168.1.116";
const hostIp = "59.110.241.137";
var UBIT = {
        selfHost: window.location.origin+ (hostIp.indexOf('168.1.78')>1 ? '/track_html' : ''),
        // selfHost: window.location.origin+'/track_html',
        host:document.location.protocol === 'https:'? 'https://'+hostIp+':48082' : 'http://'+hostIp+':8082',
        websocketUrl: document.location.protocol === 'https:'? 'wss://'+hostIp+':48083': 'ws://'+hostIp+':8083',
        cameraWsUrl:document.location.protocol === 'https:'? 'wss://'+hostIp+':48084': 'ws://'+hostIp+':8088',
        imgHost: 'http://'+hostIp+':8082/file/getFile?fileName=',

        version:'ubi_v8.0.0',
        footer:'',

        user:null,
        api_token:null,
        isSuper: false,

        fenceType:{
            attendanceId:4,//考勤区
            pollingId:5,//巡检区
            specialZoneId:6,//特定区
        },
        fengmap:{
            userId:182,
            mapId:3,
            fengmapId:"ommww",
            get url(){
                return `http://${location.host}/map/fengmap/?map=${this.mapId}`;
            }
        },
        //算法对应最小基站数
        algorithms:[
            {name:'TDOA_2D_V10',num:3},
            {name:'TDOA_1D_V10',num:2},
            {name:'TDOA_1D_V20',num:2},
            {name:'TDOA_0D_V10',num:1},

            {name:'TOF_2D_V10',num:3},
            {name:'TOF_1D_V10',num:2},
            {name:'TOF_0D_V10',num:1},
        ],

        txPowers:['c0c0c0c0','07274767','0d072747','130d0727','1f1f1f1f'],

        replaceKey:function(){
            if(!lang){
                console.error('当前页面没有语言包');
                return;
            }
            var rootDom = document.getElementsByTagName('html')[0];
            var html = rootDom.innerHTML;

            var result = htmlReplace(html,lang);
            rootDom.innerHTML = result;
            return;

            function htmlReplace(html,langData){
                var str = html.match(/~~[\s\S]+?~~/);
                if(!str){
                    return html;
                }else{
                    var key = str.toString();
                    key = key.slice(2,key.length - 2);
                    var value = langData[key];
                    if(!value){
                        console.log(langData,key);
                        console.error('语言包中没有该key ' + key);
                    }
                    html = html.replace(str.toString(),value);
                    return htmlReplace(html,langData);
                }
            }
        },
        initLang:function(modules){
            var langType = this.getLangType();
            this.loadBootstrapTableLangPkg(langType);
       
            $.ajax({
                url:UBIT.host + '/super/lang/getLang?lang=' + langType,
                method:'get',
                async:false,
                success:function(res){
                    window.lang = Object.assign({},res.data['common']);

                    
                    if(modules instanceof Array){
                        for(var module of modules){
                            var moduleData = Object.assign({}, res.data[module])
                            lang = Object.assign(lang,moduleData);
                        }
                    }else{
                        lang = Object.assign(lang,res.data[modules]);
                    }
                    

                    if(modules === 'frontMap'){
                        UBIT.replaceKey();
                    }else{
                        $(function(){
                           UBIT.replaceKey();
                        })
                    }

                },
                error(xhr,status,error){}
            })
        },
        loadBootstrapTableLangPkg:function (langType) {
            if(!$.fn.bootstrapTable || !$.fn.bootstrapTable.locales)return;
            var file = "zh-CN";
          if(langType == 'zh_tw'){
              file = "zh-TW";
          }else if(langType == 'en'){
              file = "en-US";
          }
          document.write("<script src='"+this.selfHost+'/common/plugins/bootstrap-table/locale/bootstrap-table-'+file+'.min.js'+"'><\/script>");
        },
        setLangType:function(lagnType){
            localStorage.setItem('langType',lagnType);
            window.top.location.reload();
        },
        getLangType:function(){
            var langType = localStorage.getItem('langType') || 'zh_cn';
            return langType;
        },
        uuid:function(len) { 
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
            var uuid = [], i; 
            var radix = radix || chars.length; 
            
            if (len) { 
              // Compact form 
              for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]; 
            } else { 
              // rfc4122, version 4 form 
              var r; 
            
              // rfc4122 requires these characters 
              uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; 
              uuid[14] = '4'; 
            
              // Fill in random data.  At i==19 set the high bits of clock sequence as 
              // per rfc4122, sec. 4.1.5 
              for (i = 0; i < 36; i++) { 
                if (!uuid[i]) { 
                  r = 0 | Math.random()*16; 
                  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; 
                } 
              } 
            } 
            
            return uuid.join(''); 
        },
        isPhone: function () {
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        },

        checkSession:function(redirect, callback){
            var flag = false;
            if(!localStorage.getItem('userData')){
                if(redirect){
                    top.location.href=redirect;
                }
                return false;
            }else {
                this.api_token = localStorage.getItem('api_token');
                this.user = JSON.parse(localStorage.getItem('userData'));
                this.isSuper = this.user.userType == 'super';

                //发起ajax请求，检查redis session是否存在
                $.ajax({
                    url: this.host+'/user/getCurrentUser',
                    method:'get',
                    async: false,	//同步
                    data:{'api_token':this.api_token},
                    dataType:'json',
                    success:function(r){
                        // 响应成功回调
                        if(r.code){
                            flag = true;
                            UBIT.ajaxSetup();
                            UBIT.vueSetup();

                            // if(callback) {
                            // callback();
                            // }else{
                            //    UBIT.init();
                            // }
                            return;
                        }
                        localStorage.removeItem('api_token');
                        localStorage.removeItem('userData');
                        if(redirect){
                            top.location.href=redirect;
                        }
                        return;
                    }
                });
            }
            return flag;
        },

        logout:function(){
            var flag = true;
            if(!localStorage.getItem('userData')){
                return true;
            }else {
                var api_token = localStorage.getItem('api_token');
                var user = JSON.parse(localStorage.getItem('userData'));
                //发起ajax请求，检查redis session是否存在
                $.ajax({
                    url: this.host+'/user/logout',
                    method:'get',
                    async: false,	//同步
                    data:{'api_token':api_token},
                    dataType:'json',
                    success:function(r){
                        // 响应成功回调
                        if(r.isOk){
                            flag = true;
                            localStorage.removeItem('api_token');
                            localStorage.removeItem('userData');
                        }else {
                            flag = false;
                        }
                        return;
                    }
                });
            }
            return flag;
        },
        redictAdmin:function(){



            var userData = JSON.parse(window.localStorage.getItem('userData'));
            if(userData){
                if(userData.userType=='super' && userData.projectId<1){
                    window.location.href='../super/index/';
                }else{
                    if(userData.id === UBIT.fengmap.userId){
                        window.location.href= UBIT.fengmap.url;
                    }else{
                        window.location.href='../map/map2d/svg/';
                    }
                }
            }
        },
        openMap:function(mapId,path){
            if(!mapId || mapId<1){
                return;
            }
            window.localStorage.setItem("mapId", mapId);

            if(!path){
                path = UBIT.selfHost + '/map/map2d/svg/';
            }else if(path=='self'){
                // window.location.reload();
                var url = window.location.href;
                var href = url.split('?')[0];
                window.location.href = href + '?map='+mapId;
                return;
            }
            window.open(path + '?map='+mapId);
        },
        openMapBySuper:function (map) {
            var path = UBIT.selfHost + '/map/map2d/svg/sim/';
            window.open(path + '?anony=super&map='+map);
        },
        ajaxSetup:function(){
            $.ajaxSetup({
                error:function(jqXHR, textStatus, errorMsg){
                    // jqXHR 是经过jQuery封装的XMLHttpRequest对象
                    // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
                    // errorMsg 可能为： "Not Found"、"Internal Server Error"等

                    // 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
                    alert( '发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg );
                }
            });
            if(!this.api_token || !$) return;
            $.ajaxSetup({
                headers: {
                    Accept: "application/json; charset=utf-8",
                    api_token: this.api_token
                }
            });
        },
        vueSetup:function(){
            if(!this.api_token || !Vue) return;
            Vue.http.headers.common.api_token = this.api_token;
        },
        init:function(){
            console.warn("请在页面中重构UBIT.init()方法！");
        },
        closeSelfPage:function(msg){
            alert(msg);
            // window.opener=null;
            // window.open('','_self');
            // window.close();
        },
        //判断点（x,y）是否在多边形区域内
        isInPolygon2D:function(pt, poly){
            var flag = false;
            var len = poly.length;
            if(len<3){
                return false;
            }
            var i=0, j=len-1;
            for(; i<len; i++){
                var ti = poly[i];
                var tj = poly[j];

                if((ti.y <= pt.y && pt.y < tj.y) || (tj.y <= pt.y && pt.y < ti.y)){
                    var factor = (tj.x - ti.x)/(tj.y - ti.y);
                    var dd = (pt.y - ti.y)* factor + ti.x;
                    if(pt.x < dd){
                        (flag = !flag);
                    }
                }
                j = i;
            }
            return flag;

            // for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            //     ((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat)) &&
            //     (pt.lng < (poly[j].lng - poly[i].lng) * (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng) &&
            //     (c = !c);
            // return c;

            // for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            //     ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            //     && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            //     && (c = !c);
            // return c;
        },
        //判断点（x,y）是否在圆形区域内
        isInCircle2D:function(pt, circle, r){
            if (r===0) return false;
            var dx = circle.x - pt.x;
            var dy = circle.y - pt.y;
            return dx * dx + dy * dy <= r * r;
        },
        // code2Num:function(code){
        //     if(!code) return 0;
        //     var c = code.trim();
        //     var len = 2;
        //     var a = [];
        //     for(var i=0;i<c.length;i=i+len){
        //         var t = c.substr(i, len);
        //         a.unshift(t);
        //     }
        //     a = a.join('');
        //     a = parseInt(a, 16);
        //     return a;
        // },

        code2Num:function(code){
            if(!code) return 0;
            var c = code.trim();
            return parseInt(c, 16);
        },

        num2Code:function(num){
            if(!num) return '00000000';
            var a = num.toString(16);

            //将数据转换为16进制字符串
            if(a.length<8){
                a = "00000000".slice(0,8-a.length)+a;
            }else if(a.length>8){
                a = a.slice(0,8);
            }

            // var len = 2;
            // var a_ = [];
            // for(var i=0;i<a.length;i=i+len){
            //     var t = a.substr(i, len);
            //     a_.unshift(t);
            // }
            // a = a_.join('');
            return a;
        },
        reloadPage:function(){
            window.location.reload();
        },
        // 获取url查询参数对象
        parseSearch: function (isdecode) {
            //debugger;
            var search = window.location.search;
            if (search === "") return {};
            if(search.indexOf('?')==0){
                search = search.substr(1);
            }
            var split_array = search.split("&");
            var size = split_array.length;
            var search_param = {};
            for (var i = 0; i < size; i++) {
                var temp = split_array[i];
                var param = temp.split("=");
                var param_name = param[0];
                var param_value = param[1];
                search_param[param_name] = isdecode ? window.decodeURIComponent(param_value) : param_value;
            }
            return search_param;
        },
        jsonFunc: function (res) {
            if (res.bodyBlob.size === 0) {
                return res.text();
            }
            return res.json();
        },
        deepCopy: function (obj, clo, int2str) {
            var clo = clo || {};
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if(obj[i]===null || obj[i]===undefined) continue;
                if (typeof obj[i] === 'object') {
                    // clo[i] = (Object.prototype.toString.call(obj[i]).slice(8, -1) === 'Array') ? [] : {};
                    // this.deepCopy(obj[i], clo[i]);
                    clo[i] = (Object.prototype.toString.call(obj[i]).slice(8, -1) === 'Array') ?  obj[i]: this.deepCopy(obj[i], {});

                } else {
                    if (i === 'cid' || i === 'ctime' || i === 'uid' || i === 'utime') continue;
                    if(int2str && typeof obj[i] ==='number'){
                        clo[i] = obj[i]+'';
                    }else {
                        clo[i] = obj[i];
                    }
                }
            }
            return clo;
        },
        getDistance:function(p1,p2){
            return Math.sqrt(
                Math.pow((p1.x || 0) - (p2.x || 0), 2) +
                 Math.pow((p1.y || 0) - (p2.y || 0), 2) +
                  Math.pow((p1.z || 0) - (p2.z || 0), 2)
              );
        },

        getIntersectionPoints: function (circle1, circle2, refPoint) {

            // Find the distance between the centers.
            var dx = circle1.x - circle2.x;
            var dy = circle1.y - circle2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            //判断是否存在交点
            if(dist>circle1.r+circle2.r || dist <=Math.abs(circle1.r - circle2.r)){
                console.error('r1, r2 is error:', circle1.r, circle2.r, dist);
                return null;
            }
            // 如果交点仅一个
            // if(dist == circle1.r + circle2.r){
            //     console.error('r1, r2 is error:', circle1.r, circle2.r, dist);
            //     return null;
            // }
            if(dist == 0){
                console.error('dist==0');
                return null;
            }

            var a = (circle1.r * circle1.r - circle2.r * circle2.r + dist * dist) / (2 * dist);
            var h = Math.sqrt(circle1.r * circle1.r - a * a);

            var cx2 = circle1.x + a * (circle2.x - circle1.x) / dist;
            var cy2 = circle1.y + a * (circle2.y - circle1.y) / dist;

            var x1 = Math.round(cx2 + h * (circle2.y - circle1.y) / dist, 2);
            var y1 = Math.round(cy2 - h * (circle2.x - circle1.x) / dist, 2);
            var x2 = Math.round(cx2 - h * (circle2.y - circle1.y) / dist, 2);
            var y2 = Math.round(cy2 + h * (circle2.x - circle1.x) / dist, 2);

            var point1 = {x:x1, y:y1};
            var point2 = {x:x2, y:y2};

            if (dist == circle1.r + circle2.r) {
                return point2;
            }

            var d1 = this.getDistance(point1, refPoint);
            var d2 = this.getDistance(point2, refPoint);

            if(d1<d2){
                return point1;
            }
            return point2;
        },

        emptyObj: function (obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (typeof obj[i] === 'object') {
                        // util.emptyObj(obj[i]);
                        // UBIT.emptyObj(obj[i]);
                        if(obj[i] instanceof Array){
                            obj[i] = [];    
                        }else {
                            UBIT.emptyObj(obj[i]);
                        }
                    } else {
                        obj[i] = "";
                    }
                }
            }
        },
        getLocalTime: function (stamp) {
            var temp = new Date(parseInt(stamp));
            var m = temp.getMilliseconds();
            return temp.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ") + '.' + m;
        },
        exportCsv:function(datas, filename, isSort){
            if(!datas || datas.length<=0){
                console.warn('exportCsv datas is empty')
                return false;
            }

            var str = '\uFEFF';

            var firstItem = datas[0];
            if(isSort){
                str += '序号,';
            }
            for (var j = 0; j < firstItem.length; j++) {
                var cols = firstItem[j];
                // str += '"' + (cols?cols:'') + '",';
                str +=  (cols?cols+"\t":'') + ',';
            }
            str += '\r\n';

            for (var i = 1; i < datas.length; i++) {
                var item = datas[i];
                if(isSort){
                    str += '"'+i+'",';
                }
                for (var j = 0; j < item.length; j++) {
                    var cols = item[j];
                    // str +=  (cols?'"' +cols+ '"':'') + ',';
                    if(cols!=null && cols != undefined){
                        str +=  cols+"\t" + ',';
                    }else {
                        str +=  ',';
                    }

                }
                str += '\r\n';
            }
            this.download(filename, str);
        },

        bootstrapTableExportCsv:function(tableId, isNoSort){
            var opcolumns = $('#'+tableId).bootstrapTable('getOptions').columns[0];
            var viscolumns = $('#'+tableId).bootstrapTable('getVisibleColumns');
            var sourceDatas = $('#'+tableId).bootstrapTable('getData');

            var firstItem = [];
            for(var i=0;i<viscolumns.length;i++){
                var col = viscolumns[i];
                if(!col.field || !col.title) continue;
                firstItem.push(col.title);
            }

            var datas = [];
            datas.push(firstItem);

            for(var i=0;i<sourceDatas.length;i++){
                var data = sourceDatas[i];
                var item = [];

                for(var j=0;j<viscolumns.length;j++){
                    var col = viscolumns[j];
                    if(!col.field || !col.title) continue;
                    var value = data[col.field];

                    // for(var k=0;k<opcolumns.length;k++){
                    // 	var opcol =  opcolumns[k];
                    // 	if(opcol.field == col.field ){
                    // 		if(opcol.formatter){
                    //             value = opcol.formatter(value, data, opcol.fieldIndex);
                    // 	}
                    // 		break;
                    // }
                    // }

                    item.push(value);
                }
                datas.push(item);
            }

            return this.exportCsv(datas, tableId+'_'+new Date().toLocaleString(), !isNoSort);
        },

        has:function (keywords){
            var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
            return userAgent.indexOf(keywords.toLowerCase()) > -1;
            /**
             var isOpera = userAgent.indexOf("Opera") > -1;
             if (isOpera) {
						return "Opera"
					}; //判断是否Opera浏览器
             if (userAgent.indexOf("Firefox") > -1) {
						return "FF";
					} //判断是否Firefox浏览器
             if (userAgent.indexOf("Chrome") > -1){
						return "Chrome";
					}
             if (userAgent.indexOf("Safari") > -1) {
						return "Safari";
					} //判断是否Safari浏览器
             if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
						return "IE";
					}; //判断是否IE浏览器
             **/
        },

        _isIE11: function() {
            var iev = 0;
            var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
            var trident = !!navigator.userAgent.match(/Trident\/7.0/);
            var rv = navigator.userAgent.indexOf("rv:11.0");

            if (ieold) {
                iev = Number(RegExp.$1);
            }
            if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
                iev = 10;
            }
            if (trident && rv !== -1) {
                iev = 11;
            }

            return iev === 11;
        },

        _isEdge: function() {
            return /Edge\/12/.test(navigator.userAgent);
        },

        _getDownloadUrl: function(text) {
            var BOM = "\uFEFF";
            // Add BOM to text for open in excel correctly
            if (window.Blob && window.URL && window.URL.createObjectURL) {
                var csvData = new Blob([BOM + text], { type: 'text/csv' });
                return URL.createObjectURL(csvData);
            } else {
                return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
            }
        },

        download: function(filename, text) {
            if(filename.indexOf('.csv')<0){
                filename += '.csv';
            }
            if (this.has('ie') && this.has('ie') < 10) {
                // has module unable identify ie11 and Edge
                var oWin = window.top.open("about:blank", "_blank");
                oWin.document.write('sep=,\r\n' + text);
                oWin.document.close();
                oWin.document.execCommand('SaveAs', true, filename);
                oWin.close();
            }else if (this.has("ie") === 10 || this._isIE11() || this._isEdge()) {
                var BOM = "\uFEFF";
                var csvData = new Blob([BOM + text], { type: 'text/csv' });
                navigator.msSaveBlob(csvData, filename);
            } else {
                var link=document.createElement("A");
                link.href = this._getDownloadUrl(text),
                    link.target = '_blank',
                    link.download =  filename;

                document.body.appendChild(link);

                if (this.has('safari')) {
                    // # First create an event
                    var click_ev = document.createEvent("MouseEvents");
                    // # initialize the event
                    click_ev.initEvent("click", true /* bubble */ , true /* cancelable */ );
                    // # trigger the evevnt/
                    link.dispatchEvent(click_ev);
                } else {
                    link.click();
                }
                document.body.removeChild(link);
            }
        },

        enable3d: false,
        enableCamera:true,   //是否显示摄像头
        enableAutoCamera:false,
        enableWall:true,   //是否显示围墙
        enableHeatmap:true,   //是否显示热力图
        enableTplatfrom:false,   //是否显示实验平台
        enableDimensionArea:false,  //是否显示特定区域
        enableMoreMonitor:true, //是否显示多人互监
        enableAutoLogin:false,
        enableDrawLine:true,
        //电池电量转换
        getPower: function (power) {
            if (!power) {
                // console.log('getPower: ', msg.mac, 'power='+power);
                return 92;
            }

            var PowerSch = [
                { v: 4200, l: 100 },
                { v: 4080, l: 90 },
                { v: 4000, l: 80 },
                { v: 3930, l: 70 },
                { v: 3870, l: 60 },
                { v: 3820, l: 50 },
                { v: 3790, l: 40 },
                { v: 3770, l: 30 },
                { v: 3730, l: 20 },
                { v: 3700, l: 15 },
                { v: 3680, l: 10 },
                { v: 3500, l: 5 },
                { v: 2500, l: 1 },
            ];
            //msg.power = pos.power/42
            if (power >= PowerSch[0].v) return PowerSch[0].l;

            var len = PowerSch.length;
            if (power < PowerSch[len - 1].v) return PowerSch[len - 1].l;

            for (var i = 0, j; i < len - 1; i++) {
                j = i + 1;
                if (power < PowerSch[i].v && power >= PowerSch[j].v) {
                    return PowerSch[i].l;
                }
            }
        },

    }
;

UBIT.iconPath = UBIT.selfHost + '/map/map2d/img/';
UBIT.footerMsg = UBIT.footer + '，' + UBIT.version;

UBIT.getImgSrc = function (type, img) {
    if(hostIp.indexOf('track.ubitraq')>-1){
        hostIpnew =window.location.hostname;
         // return 'http://'+hostIpnew+':8088'+'/uploads/' + type +'/' + img;
         return 'http://'+hostIp+'/uploads/' + type +'/' + img;
        
    }
    return UBIT.imgHost + type +'_' + img;
}



if(Vue){
    Vue.http.options.emulateJSON = true;
    Vue.http.options.root = UBIT.host;
    Vue.http.options.xhr = { withCredentials: true };

    //注册二维码组件
    var Vue = window.Vue;
    var VueQrcode = window.VueQrcode;
    Vue.component('qrcode', VueQrcode);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/***
 调用：
 var time1 = new Date().Format("yyyy-MM-dd");
 var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
 **/
