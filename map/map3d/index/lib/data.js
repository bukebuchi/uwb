/**
 * Created by zwt on 2017/7/24 0024.
 */


var util = UBIT;
/**
 * 全局变量
 */
var ME = {
    //访问路径
    baseUrl : '/',
    //请求的服务器地址
    host: UBIT.host,
    selfHost:UBIT.selfHost,
    iconPath: UBIT.iconPath,
    user: UBIT.user,
    api_token: UBIT.api_token,
    websocketUrl: UBIT.websocketUrl,
    imgHost:UBIT.imgHost,
    anony:false,
    searchTag:null,
    bgColor:0x3D3D3D,
    fenceTip:true,
    fenceAudioTip:true,
    socketStatus:true,
    container:null,
    css3Container:null,

    camera:null,
    scene:null,
    renderer:null,

    renderStop:false,
    plane:null,
    orbit:null,
    clock:null,
    socketRequest:null,
    vm:null,
    font:null,
    tagTemplate:null,
    planeWidth:0,
    planeHeight:0,
    fenceHeight:180,
    tailNum:60,
    tagSize:50,
    tags:{},
    tagPower:{
        width:128,
        height:8,
        color:'#35FF2A',
    },
    tagMarker:{
        tmpData:[],
        data:[],
        sphereRadius:0.4,
        height:50,
    },
    fenceShape:{
        data:[],
    }
};



vue_data_source = function() {
    return {
        showMode:'admin', //    admin/guest
        currentMap:null,
        currentTag:null,

        user:ME.user,
        imgHost:ME.imgHost,
        selfHost:ME.selfHost,

        mapId: '',
        curRealLength:null, //实际地图长度（X）
        mapDialog:{
            title:'切换地图',
            autoplay:true,
            visible:false,
        },
        search:{
            title:'搜索标签',
            input:'',
            visible:false,
        },
        qrcode:{
            size:'small',
            title:'二维码',
            visible:false,
            value_2d:'',
            value_3d:'',
        },

        fenceType: {    //围栏类型
            data: [],
        },
        tagType: {    //标签类型
            data: [],
        },
        tagCat: {    //标签分组
            data: [],
        },

        //是否全屏
        fullScreen: false,
        screenLength:document.documentElement.clientWidth,
        //标签显示控制面板
        tagPanelShow: false,
        //轨迹长度
        trackLen : 10,

        map: {
            data: [],
            visible: false,
            deleteBtn: true,
            arrowIcon:{
                sort:false,
                type:''
            },
            index: '',
            edit: {
                id: "",
                cname: "",
                filePath:"",
                realLength:"",
                pixelLength:"",
                zoneId:1,//TODO
            },
        },

        anchor: {
            data: [],
            visible: false,
            deleteBtn: true,
            isIndeterminate:true,
            showAll:true,
            index: '',
            arrowIcon:{
                sort:false,
                type:''
            },
            floatEdit:{
                visible:false,
                mapImg:'',
                data:{
                    id: "",
                    code: "",
                    alias:"",
                    mapId:'',
                    color:'',
                    markerType:'anchor',
                    x: "",
                    y: "",
                    z: 100,
                }
            },

            filterData: {
                model:"",
                code: "",
                alias: "",
                id: "",
                isMaster:"",
                x:"",
                y:"",
                z:"",
            },
            edit: {
                id: "",
                code: "",
                alias:"",
                mapId:'',
                color:'',
                isMaster:'',
                x: "",
                y: "",
                z: 100,
            },
        },

        tag: {
            data: [],
            visible: false,
            deleteBtn: true,
            isIndeterminate:true,
            showAll:true,
            index: '',
            arrowIcon:{
                sort:false,
                type:''
            },
            floatEdit:{
                visible:false,
                typeIcon: '',//../../common/img/tagType/man.png
                data:{
                    id: "",
                    code: "",
                    markerType:'tag',
                    alias:"",
                    mapId:'',
                    catId:'',
                    typeId:'',
                    x: "",
                    y: "",
                    z: 100,
                }
            },

            filterData: {
                model:"",
                code: "",
                alias: "",
                id: "",
                catId:"",
                mapId:"",
                typeId:"",
                power: "",//名称是暂定的
                distance: "",//名称是暂定的
                speed: "",//名称是暂定的
            },
            edit: {
                id: "",
                code: "",
                alias:"",
                mapId:'',
                color:'',
                x: "",
                y: "",
                z: 100,
            },
        },

        fence: {
            data: [],
            visible: false,
            deleteBtn: true,
            isIndeterminate:true,
            checkAll:true,
            index: '',
            arrowIcon:{
                sort:false,
                type:''
            },
            filterData: {
                model:"",
                cname: "",
                id: "",
                ftype: "",
            },
            edit: {
                id: "",
                cname: "",
                ftype:"",
                points:[],
                ftypeId:'',
                mapId:'',
                color:""
            },
        },
    };
}
