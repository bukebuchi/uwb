'use strict';

/**
 * Created by liutao on 2017/7/28 0028.
 */

;(function () {
    var isTouch = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click',
        _on = $.fn.on;
    $.fn.on = function () {
        arguments[0] = arguments[0] === 'click' ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    };
})();

function cssHeaderInit() {

    if (ME.user && ME.user.cname!='anony') {
        $("#logoIn_name").html(function () {
            return ME.user.cname;
        });

        $(".logo img").attr("src", function () {
            return UBIT.getImgSrc('project',  (ME.user && ME.user.logo ? ME.user.logo : 'logo.png'));
        });

        $(".portrait img").attr("src", function () {
            return UBIT.getImgSrc('user',  (ME.user && ME.user.img ? ME.user.img : 'user.png'));
        });
    }

    $('.logoIn').click(function () {
        $('.logoIn').toggleClass('active');
        return false;
    });

    $('#mapSvg,.header').click(function () {
        if(!ME.hideMenuFlag) return ME.hideMenuFlag = true;
        $('.tag,.anchor,.historys,.fence, .camera').removeClass('active');
        return hideMenus();
    });

    // $('#right_menus').click(hideMenus);

    function hideMenus() {
        // console.log('11');
        $('.logoIn').removeClass('active');
        $('.panel .tab-list .list-item').removeClass('active');

        ME.vm.tabActive = '';
        // $('#fixNagPanel div').removeClass('active');

        // $('.m-left .search input').removeClass('active');
        $('.total_tag_table').hide();
        return false;
    }

    $('.total_tag').mouseover(function () {
        var html = '',
            icon = 'location_blue.png';

        var typeIcons = {};
        for (var i = 0; i < ME.vm.tag.data.length; i++) {
            var tag = ME.vm.tag.data[i];
            if (tag.type && tag.type.icon) {
                icon = tag.type.icon;
            }
            if (!typeIcons[icon]) {
                typeIcons[icon] = 1;
            } else {
                typeIcons[icon]++;
            }
        }

        for (var i in typeIcons) {
            html += '<div>';
            html += '<span>';
            html += '<img src="' +  UBIT.getImgSrc('tagTypes' ,i) + '" alt="">';
            html += '</span>';
            html += '<span>' + typeIcons[i] + '</span>';
            html += '</div>';
        }

        $('.total_tag_table').html(html);
        $('.total_tag_table').css('display', 'block');
    });

    $('.total_tag').mouseout(function () {
        $('.total_tag_table').css('display', 'none');
    });

    $('.logoIn_table div').each(function (i) {
        $(this).hover(function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
            }
        }, function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
    });
}

function cssFixNagInit() {

    $('#fixNagPanel div').each(function (i) {
        $(this).hover(function () {
            if (!$(this).hasClass('hoverActive')) {
                $(this).addClass('hoverActive');
                // console.log($(this))
                // $('.map-red-wrap').css({background:'url(../img/images/ubi.png) -103px -43px no-repeat'})
            }
        }, function () {
            if ($(this).hasClass('hoverActive')) {
                $(this).removeClass('hoverActive');
                //  $('.map-red-wrap').css({background:'url(../img/images/ubi.png) -103px -5px no-repeat'})
            }
        });
    });
}

function cssInit() {

    cssHeaderInit();
    cssFixNagInit();

    /***************************/

    $('.menu').click(function () {
        if ($('aside').hasClass('m-right')) {
            $('aside').addClass('m-left');
            $('aside').removeClass('m-right');
            // $('.m-left .search input').addClass('active');
            $('.m-left .btn-appear').addClass('active');
            //设置样式
            // $('#wrapper_paper').addClass('paper-leftMenu');
        } else {
            $('aside').removeClass('m-left');
            $('aside').addClass('m-right');
            $('.btn-appear').removeClass('active');

            //设置样式
            // $('#wrapper_paper').removeClass('paper-leftMenu');
        }
        return false;
    });

    $('#btn-appear').click(function () {
        if ($('.m-left .search input').hasClass('active')) {
            $('.m-left .search input').removeClass('active');
        } else {
            $('.m-left .search input').addClass('active');
        }
        return false;
    });


    //jquery为侧边栏按钮添加样式
    var items = $('#right_menus_items').children();
    // for(var i=0;i<items.length;i++){
    //     var item = $(items[i]);
    //
    //     item.hover(function(){
    //         $(this).css({background:'#515151'});
    //     },function(){
    //         $(this).css({background:'#3d3d3d'});
    //     });
    //
    //     // var itemSub = item.children();
    //     // $(itemSub[0]).click(function () {
    //     //     var sf = this;
    //     //     var p = $(sf).parent()[0];
    //     //
    //     //     $(p).toggleClass('active');
    //     //     if ( $(p).hasClass('active')) {
    //     //
    //     //         $('#right_menus_items').children().map(function(idx, mi){
    //     //             if(mi.className.indexOf(p.className)>-1) return;
    //     //             $(mi).removeClass('active');
    //     //         });
    //     //     }
    //     //     return false;
    //     // });
    // }


    $('.statis_text .statis_fence').click(function () {
        // $('.statis_fence').toggleClass('active');
        $('.statis_fence').addClass('active');
        if($('.statis_fence').hasClass('active')){
            $('.statis_appear_fence').css({'display':"block"});
            $('.statis_appear_system').css({'display':"none"});
            $('.statis_appear_datas').css({'display':"none"});
            $('.statis_system').removeClass('active');
            $('.statis_datas').removeClass('active');
        }
        return false;
    })
    $('.statis_text .statis_system').click(function () {
        // $('.statis_system').toggleClass('active');
        $('.statis_system').addClass('active');
        if($('.statis_system').hasClass('active')){
            $('.statis_appear_fence').css({'display':"none"});
            $('.statis_appear_datas').css({'display':"none"});
            $('.statis_appear_system').css({'display':"block"});
            $('.statis_fence').removeClass('active');
            $('.statis_datas').removeClass('active');
        }
        return false;
    })
    $('.statis_text .statis_datas').click(function () {
        // $('.statis_datas').toggleClass('active');
        $('.statis_datas').addClass('active');
        if($('.statis_datas').hasClass('active')){
            $('.statis_appear_fence').css({'display':"none"});
            $('.statis_appear_system').css({'display':"none"});
            $('.statis_appear_datas').css({'display':"block"});
            $('.statis_system').removeClass('active');
            $('.statis_fence').removeClass('active');
        }
        return false;
    })
    // $('.switch').click(function(){
    //     var this_o = $(this);
    //     if(this_o.hasClass('on')){
    //         this_o.find('i').animate({left:'1px'}, 200);
    //     }else{
    //         this_o.find('i').animate({left:'15px'}, 200);
    //     }
    //     setTimeout(function(){this_o.toggleClass('on');},200);
    // })


    $('.fence_from_wrap_sure').mouseover(function () {
        $('fence_from_wrap_sure').css({ color: '#ffffff', opacity: '0.8' });
    });

    $.each($('.agreementDlg'), function (index, item) {
        dragAndDrop($(item));
    });
}
//地图侧边点击事件
function togMenus(sf){
    // console.log(sf);

    var p = $(sf).parent()[0];
    ME.vm.activeWrap = p.className.replace("one_menu_item","").trim();
    $(p).toggleClass('active');
    if ( $(p).hasClass('active')) {
        $('#right_menus_items').children().map(function(idx, mi){
            if(mi === p){
                return;
            }
            $(mi).removeClass('active');
        });
    }
    return false;
}
//传进一个参数，表示哪个页面元素要进行拖动
function dragAndDrop($element) {
    var element = $element.get(0);

    //用一个isDragging变量表示当前是否在拖动
    var isDragging = false;

    //响应事件，将三个事件都用同一个handler
    function handleEvent(event) {
        switch (event.type) {
            //一但鼠标进行移动，更新element的位置
            case 'mousemove':
                if (isDragging) {
                    //使用jQuery的css设置left和top值有很好的跨浏览器兼容性
                    var obj = $element.parents('.el-popover'); //('.el-popover')
                    // obj.css({ left: event.clientX - 140, top: event.clientY - 80 });
                    obj.css({ left: event.clientX - obj[0].offsetWidth/2, top: event.clientY - 80 });
                    // obj.css({ left: event.clientX, top: event.clientY - 80 });
                }
                break;
            //鼠标按下时，置标志位为true
            case 'mousedown':
                isDragging = true;
                break;
            case 'mouseup':
                isDragging = false;
                break;
        }
    }

    element.onmousemove = handleEvent;
    element.onmouseup = handleEvent;
    element.onmousedown = handleEvent;
}

//互监组成员选择
$(function(){
    $('#moreMonitor_all').focus(function(){
        ME.vm.searchMonitorTag();
        $('.moreMonitor_all_box').css({
            'display':'block'
        })
    });
    //由于blur,触发早，此处动态绑定事件
    $(".moreMonitor_all_box").hover(function(){
        $('#moreMonitor_all').off('blur');
    },function(){
        $('#moreMonitor_all').on('blur',function(e){
            $('.moreMonitor_all_box').css({
                'display':'none'
            })
        });
        $('#moreMonitor_all')[0].focus();
    });

    $('#moreMonitor_all').on('blur',function(e){
        $('.moreMonitor_all_box').css({
            'display':'none'
        })
    });
})

//触发标签相关事件
$(function(){
    $('#trifTag_search').focus(function(){
        $('.trifTags_box').css({
            'display':'block'
        })
    });
    //由于blur,触发早，此处动态绑定事件
    $(".trifTags_box").hover(function(){
        $('#trifTag_search').off('blur');
    },function(){
        $('#trifTag_search').on('blur',function(e){
            $('.trifTags_box').css({
                'display':'none'
            })
        });
        $('#trifTag_search')[0].focus();
    });

    $('#trifTag_search').on('blur',function(e){
        $('.trifTags_box').css({
            'display':'none'
        })
    });
})



$(function () {
return
    $('#statis_system_one').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,//边框宽度
            plotShadow: false,//是否给绘图区增加阴影效果
        },
        title: {
            text: '浏览器<br>占比',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {//悬浮框
            headerFormat: '{series.name}<br>',//series.name
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'//悬浮框{series.data}
        },
        colors :['#f45b5b', '#a6c96a', '#77a1e5'],
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black',
                    }
                },
                startAngle: -90,//控制圆的左半径
                endAngle: 90,//控制圆的右半径
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: '浏览器占比',
            innerSize: '50%',
            data: [
                ['1',   45.0],
                ['ads',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                {
                    name: '其他',
                    y: 0.7,
                    dataLabels: {
                        // 数据比较少，没有空间显示数据标签，所以将其关闭
                        enabled: false
                    }
                }
            ]
        }],
        navigation:{
            buttonOptions:{
                align:'center',
                enabled:false
            }
        }
    });
});
$(function () {
return
    $('#statis_system_two').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,//边框宽度
            plotShadow: false,//是否给绘图区增加阴影效果
        },
        title: {
            text: '浏览器<br>占比',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {//悬浮框
            headerFormat: '{series.name}<br>',//series.name
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'//悬浮框{series.data}
        },
        colors :['#f45b5b', '#a6c96a', '#77a1e5'],
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black',
                    }
                },
                startAngle: -90,//控制圆的左半径
                endAngle: 90,//控制圆的右半径
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: '浏览器占比',
            innerSize: '50%',
            data: [
                ['1',   45.0],
                ['ads',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                {
                    name: '其他',
                    y: 0.7,
                    dataLabels: {
                        // 数据比较少，没有空间显示数据标签，所以将其关闭
                        enabled: false
                    }
                }
            ]
        }],
        navigation:{
            buttonOptions:{
                align:'center',
                enabled:false
            }
        }
    });
});
$(function () {
return
    $('#statis_system_three').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,//边框宽度
            plotShadow: false,//是否给绘图区增加阴影效果
        },
        title: {
            text: '浏览器<br>占比',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {//悬浮框
            headerFormat: '{series.name}<br>',//series.name
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'//悬浮框{series.data}
        },
        colors :['#f45b5b', '#a6c96a', '#77a1e5'],
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black',
                    }
                },
                startAngle: -90,//控制圆的左半径
                endAngle: 90,//控制圆的右半径
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: '浏览器占比',
            innerSize: '50%',
            data: [
                ['1',   45.0],
                ['ads',       26.8],
                ['Chrome', 12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                {
                    name: '其他',
                    y: 0.7,
                    dataLabels: {
                        // 数据比较少，没有空间显示数据标签，所以将其关闭
                        enabled: false
                    }
                }
            ]
        }],
        navigation:{
            buttonOptions:{
                align:'center',
                enabled:false
            }
        }
    });
});
