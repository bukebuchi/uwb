/**
 * Created by Administrator on 2017/12/23/023.
 */

function vsnInit() {

    vsn = {
        //从数组中删除指定值
        resetData: function resetData(sourceData, data, index) {
            this.showTipFunc(lang['deleteFail']);
            return sourceData.splice(index, 0, data);
        },
        showTipFunc: function showTipFunc(txt) {
            if (ME.vm || ME.vm.showTip) {
                ME.vm.showTip(txt);
            } else {
                alert(txt);
            }
        },

        createDistanceHtml: function (start, end, dis, top, left) {
            var c = '<div class="qtip-default" style="position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:100;padding:10px;">';
            c += "<span style='float: left;' ><table class='infowindowTable'>";
            c += "<tr><td>"+lang['distance']+"</td><td>" + dis + "</td></tr>";
            c += "<tr><td>"+lang['start']+"</td><td>X:" + start.x + "，Y:" + start.y + "</td></tr>";
            c += "<tr><td>"+lang['end']+"</td><td>X:" + end.x + "，Y:" + end.y + "</td></tr>";
            c += "</table></span></div>";
            return c;
        },

    };

    vsn.highlight = function (a) {
        $(a).expose();
    },
        vsn.removeHighlight = function () {
        $(".expose-overlay").remove();
    }, vsn.newFenceForm = function () {
        vsn.removeHighlight();
    },
        vsn.newCameraForm = function () {
            vsn.removeHighlight();
        },
        //full screen
        function () {
            try {
                document.onwebkitfullscreenchange = function () {
                    // debugger;
                    var fulled = document.webkitIsFullScreen;
                    ME.vm.fullScreen = fulled;
                };
                document.onmozfullscreenchange = function () {
                    // debugger;
                    var fulled = document.mozFullScreen;
                    ME.vm.fullScreen = fulled;
                };
                // document.onkeyup=function(e){
                //     // debugger;
                //     if(e.keyCode==13 && ME.vm.tabActive==1){
                //         ME.vm.searchHandle();
                //     }
                // }
            } catch (e) {
                console.warn(e);
            }
        }();
};




