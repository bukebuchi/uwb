'use strict';

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {value: value, enumerable: true, configurable: true, writable: true});
    } else {
        obj[key] = value;
    }
    return obj;
}

/**
 * Created by zwt on 2017/6/24 0024.
 * 全局数据配置
 */

var ME = {
    //访问路径
    baseUrl: '/',
    //请求的服务器地址
    host: UBIT.host,
    iconPath: UBIT.iconPath,
    imgHost: UBIT.imgHost,
    selfHost: UBIT.selfHost,
    user: UBIT.user,
    isSuper:UBIT.isSuper,
    api_token: UBIT.api_token,
    websocketUrl: UBIT.websocketUrl,
    href: window.location.href,
    vm: null,
    updateRealtime: false,
    canvas: null,

    center: {x:220, y:56},
    lines:[],
    willFollowTag:'',   //记录需要跟随的标签
    followTagMap:'',    //记录跟随标签的地图
    lastGoPoint:{},     //标签上一个点的位置
    moreMonitorHalos:{},   //存在halo的marker mac,用于隐藏未越界marker样式
    moreMonitorHalosHideTime:300,     //多人互监多久无数据消失
    reconnectTime:3000,
    distanceAlertHalosHideTime:500,  //距离测量，报警时间
    distanceAlertHalos:{},  //存在距离报警halo的标签mac
    aggregateAlertHalos:{},
    stillnessAlertHalos:{},
    distanceAlertColor:'red', //颜色
    //sos报警光环
    sosHalos:{},
    heartAlertHalos:{},  //   心率报警

    forceRemoveHalos:{},  //   强拆报警
    forceRemoveHalosHideTime:500,  //强拆报警，报警时间

    /**
     * 当标签休眠后，标签多久消失
     */
     tagDisappear:60000,
    imgLength: 0,
    distance_to_clip_polygon: 12, //last line of polygon will clip to first point of polygon if closer than 50px
    fence_tooltip: 'fenceinfo',
    leftMenusWidth: 220,
    headerHeight: 56,

    drawEnd:true,  //覆盖区域是否绘制完成

    relChange:{},  //地图中设置时，实际点偏移
    grids:{
        lines:[],
        color:'green',
        lineStyle:'dashed',
        step:100
    },      //栅格
    areaOffset:{
        x:0,
        y:0
    },
    tags: {},
    sos: {},
    forceRemove:{},
    heart:{},
    moreMonitor:{}, //互监组提示
    searchTagMarker:null,
};

/**
 * 全局变量
 */
var ubiMap = null;
var paper = null;
var socketRequest,
    sessionId,
    socketFlag = true;
var util = UBIT;
var vsn = {};

var vue_data_source = function vue_data_source() {
    var _ref;

    return _ref = {
        showMode: 'admin', //    admin/guest
        currentMap: null,
        currentTags: null,
        iconPath: ME.iconPath,
        imgHost: ME.imgHost,
        getImgSrc:UBIT.getImgSrc,
        selfHost: ME.selfHost,
        appear: false,
        hideMenuFlag: true,
        enableTplatfrom: UBIT.enableTplatfrom,
        enable3d: UBIT.enable3d,
        isShowCamera:UBIT.enableCamera, //是否显示摄像头功能
        enableWall: UBIT.enableWall,    //是否显示围墙
        enableHeatmap:UBIT.enableHeatmap,             //显示热图分析
        enableMoreMonitor:UBIT.enableMoreMonitor,
        enableDimensionArea:UBIT.isSuper?true:false,
        isSuper:UBIT.isSuper,             //是否是超管
        optionType:null,    //鼠标点击事件操作类型
        point_num:0,
        extend:null,        //实际距离
        disFlag:false,      //距离测量标记
        allPoints:{
            fence:[],      //存放绘制时所有点
            tempfence:[],  //存放绘制时直线两点
            tempcamera:[],
            camera:[],
            num:0
        },
        underStyles:[{//背景肤色控制
            id:1,
            name:'黑色',
            bodyClass:'',
            menuClass:''
        },{
            id:2,
            name:'青蓝色',
            bodyClass:'undercolor3',
            menuClass:'undermenucolor3'
        },{
            id:3,
            name:'紫蓝色',
            bodyClass:'undercolor1',
            menuClass:'undermenucolor1'
        },{
            id:4,
            name:'浅色',
            bodyClass:'undercolor2',
            menuClass:'undermenucolor2'
        }],
        currentUnderStyle:{
            id:1,
            name:'黑色',
            bodyClass:'',
            menuClass:''
        },
        willMove:{},     //点击将要移动的对象
        disPoint:[],
        statisticsListShow:false,  //是否显示统计结果
        statisticsPoint:{},
        statisticsList:[
         
          
        ],
        minLength:50,
        projectDesc:'',
        fullscreenLoading: true,
        adjustAnchor:{
            dialog:false,
            activeName:'1',
            selects:[],
            refCalDistance:0,
            refRealDistance:0,
            refErrorDistance:0,//误差
            datas:[],
            submitBtnDisable:false,
            adjustAnchorStepOneBtn:false,
            adjustAnchorStepTwoBtn:false,
        },
        adjustAnchorCoordDialog:false,
        adjustAnchorCoordActiveName:['1'],

        user: ME.user,
        mapId: '',
        yCenter: 0,
        curRealLength: null, //实际地图长度（X）
        origin: {},       //设置坐标原点
        mapAppear:0,     //标签距离边界消失值

        fenceType: { //围栏类型
            data: [],
            get drawFenceData(){
                if(this.data.length < 1){
                    return [];
                }else{
                    var filterTypeId = [4,5];
                    return this.data.filter((value) => {
                        return !filterTypeId.includes(value.id);
                    })
                }
            }
        },
        tagType: { //标签类型
            data: []
        },
        tagCat: { //标签分组
            data: []
        },

        floatEditWidth: 300,
        rotate:90,
        //摄像头添加、更新
        attendance:Attendance.call(this)
    },
        _defineProperty(_ref, 'selfHost', ME.selfHost), _defineProperty(_ref, lang['companyInfo']), _defineProperty(_ref, 'disabled', false), _defineProperty(_ref, 'qrcode', {
        size: 'small',
        title: lang['mapQrcode'],
        visible: false,
        value_2d: '',
        value_3d: '',
        activeWrap:'',//区分正在左边正在选中的
        extendFence:['attendance','polling']
    }),
        _defineProperty(_ref, 'dataActive', true),
        _defineProperty(_ref, 'scanActive', false),
        _defineProperty(_ref, 'slide_fade_show', true),
        _defineProperty(_ref, 'fullScreen', false),
        _defineProperty(_ref, 'tabActive', 0),
        _defineProperty(_ref, 'posActive', ''),
        _defineProperty(_ref, 'posText', [lang['map']]),
        _defineProperty(_ref, 'power', true),
        _defineProperty(_ref,'screenCoordinate',false),
        _defineProperty(_ref, 'showBarAlway', false),
        _defineProperty(_ref, 'switchData', {
        visible: false,
        grid: false,
        distance: false,
        correctMap: false,    //地图校准
        wall: true,
        tag: true,
        camera: true,
        anchor: true,
        lockTag: false,
        fence: true,
        sound: true,
        fenceTip: true,
        step: 1,
        value: 10,
        power: true, //显示电量
        showCamera:true,
        powerAuto: false,
        setOrigin:false,
        isShowTagTypes:[],
        isShowTagCats:[],
        isShowActiveTag:true,
        isShowCoordinate:false,
        distanceAlert:true,
        hidePowerMakerId:[],
        realTimeStatistics:false,
    }),
        _defineProperty(_ref, 'rangActive', false), _defineProperty(_ref, 'rangeData', {
        min: 0,
        max: 100,
        step: 1,
        value: 0
    }),
        _defineProperty(_ref, 'history', {
            isShow:false,
            isLoading:false,
            model: 'stop',
            span: 100, //时间范围
            datas: {}, //历史数据
            intervalID: null, //定时任务ID
            intervalTime: 1000, //播放速度  1s
            isShowLogs:true,

            datetimeRange: [new Date(), new Date()],
            tags: [],
            allTags: [],
            slider: 0,
            min: 0,
            max: 6048e5, //3600*24*7*1000  精确到毫秒
            step: 1000,
            pickerOptions2:{
                shortcuts:[
                    {
                        text:lang['pickerOptions1'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*2);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions2'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*3);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions3'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*5);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions4'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*10);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions5'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        }), _defineProperty(_ref, 'intervalID', 0),
        _defineProperty(_ref, 'heatMap', {
            isLoading:false,
            isShow: false,
            datetimeRange: [new Date(), new Date()],
            tags: [],      //需要分析的标签
            radius:1,
            blur:10,
            datas: [], //历史数据

            intensity:10,   //强度
            span: 100, //时间范围
            tagChanged:false, //标签或时间是否更改

            slider: 0,
            pickerOptions2:{
                shortcuts:[
                    {
                        text:lang['pickerOptions3'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*5);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions4'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*10);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text:lang['pickerOptions5'],
                        onClick:function onClick(picker){
                            var start=new Date();
                            var end=new Date();
                            start.setTime(start.getTime() - 60*1000*30);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            }
        }),
        _defineProperty(_ref, 'search', {
            value: '',
            id: '',
            prevData: null,
            tag:{
                markers:[],
                dialogVisible:false
            },
            anchor:{
                markers:[],
                dialogVisible:false
            },
        }),
        _defineProperty(_ref, 'markerId', ''),
        _defineProperty(_ref, 'markerType', null),
        _defineProperty(_ref, 'screenLength', document.documentElement.clientWidth),
        _defineProperty(_ref, 'nodes', {
            data: [],
            visible: false,
            deleteBtn: true,
            tagData: [],
            anchorData: [],
            cameraData: [],
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            filterData: {
                model: "",
                code: "",
                alias: "",
                isMaster: "",
                x: "",
                y: "",
                z: "",
                id: "",
                catId: "",
                mapId: "",
                typeId: "",
                power: "", //名称是暂定的
                distance: "", //名称是暂定的
                speed: "" //名称是暂定的
            },
            edit: {
                id: "",
                code: "",
                alias: "",
                mapId: "",
                model: "", //tag or anchor
                color: "",
                x: "",
                y: "",
                z: ""
            }
        }),
        _defineProperty(_ref, 'map', {
            data: [],
            visible: false,
            deleteBtn: true,
            arrowIcon: {
                sort: false,
                type: ''
            },
            index: '',
            edit: {
                id: "",
                cname: "",
                filePath: "",
                realLength: "",
                pixelLength: "",
                zoneId: 1 //TODO
            }
        }),
        _defineProperty(_ref, 'anchor', {
            defaultDisplay:false, 
            data: [],
            searchVal:'', //map,table,search
            filterData:[], //搜索后值
            visible: false,
            deleteBtn: true,
            isIndeterminate: true,
            showAll: false,
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            floatEdit: {
                visible: false,
                mapImg: '',
                data: {
                    id: "",
                    code: "",
                    alias: "",
                    mapId: '',
                    color: '',
                    markerType: 'anchor',
                    _x: 0,
                    _y: 0,
                    get x(){
                        return this._x;
                    },
                    set x(value){
                        return this._x = parseFloat((value / 100).toFixed(2));
                    },
                    get y(){
                        return this._y;
                    },
                    set y(value){
                        return this._y = parseFloat((value / 100).toFixed(2));
                    },
                    z: 100
                }
            },

            // filterData: {
            //     model: "",
            //     code: "",
            //     alias: "",
            //     id: "",
            //     isMaster: "",
            //     x: "",
            //     y: "",
            //     z: ""
            // },
            edit: {
                id: "",
                code: "",
                alias: "",
                mapId: '',
                color: '',
                isMaster: '',
                x: "",
                y: "",
                z: 100
            }
        }),
        _defineProperty(_ref, 'tag', {
            data: [],
            get sirens(){
                if(this.data.length < 1){
                    return [];
                }else{
                    var filterTypeId = [14];
                    return this.data.filter((value) => {
                        for(var id of  filterTypeId){
                            if(value.typeId == id){
                                return true;
                            }
                        }
                        return false;
                    })
                }
            },
            visible: false,
            searchVal:'',
            filterData:[],
            deleteBtn: true,
            isIndeterminate: true,
            showAll: false,
            index: '',
            qrcode: {
                title: lang['tagQrcode'],
                show: false,
                mac:'',
                code:'',
                value_2d: '',
                value_3d: '',
                followMap:true,
            },
            arrowIcon: {
                sort: false,
                type: ''
            },
            floatEdit: {
                visible: false,
                typeIcon: '', //../../common/img/tagType/man.png
                typeIconShow: false,
                data: {
                    id: "",
                    code: "",
                    markerType: 'tag',
                    alias: "",
                    mapId: '',
                    catId: '',
                    typeId: '',
                    minHeart:'',
                    maxHeart:'',
                    x: "",
                    y: "",
                    z: 100
                }
            },

            // filterData: {
            //     model: "",
            //     code: "",
            //     alias: "",
            //     id: "",
            //     catId: "",
            //     mapId: "",
            //     typeId: "",
            //     power: "", //名称是暂定的
            //     distance: "", //名称是暂定的
            //     speed: "" //名称是暂定的
            // },
            edit: {
                id: "",
                code: "",
                alias: "",
                mapId: '',
                color: '',
                x: "",
                y: "",
                z: 100
            }
        }),
        _defineProperty(_ref, 'camera', {
            data: [],
            visible: false,
            color:'#ccc',   //区域默认填充色
            opacity:0.3,             //区域默透明度
            deleteBtn: true,
            isIndeterminate: true,
            showAll: true,
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            showCameraList:false,
            cameraList:[],
            cameraModelList:[],
            listLoading:false,
            networkAgreementSource:['TCP/IP','ICMP','HTTP','HTTPS','FTP','DHCP','DNS','DDNS','RTP','RTSP','RTCP','PPPoE','NTP','UPnP','SMTP','SNMP','IGMP','802.1X','QoS','IPv6','Bonjour'],
            interfaceAgreementSource:['ONVIF','PSIA','CGI','ISAPI'],

            floatEdit: {
                visible: false,
                typeIcon: '', //../../common/img/tagType/man.png
                typeIconShow: false,
                data: {
                    id: "",
                    // ip: '',
                    // port: "",
                    mapId: "",
                    initAngleX: '',
                    rotateMax: '',
                    // type:'1',//1 枪机 2 球机
                    // interfacePort:'',
                    type: '1',
                    model: '',
                    totalPan: '',
                    totalTilt: '',
                    defaultTilt: '',
                    username:'',
                    password:'',
                    productModel:'',
                    seqNum:'',
                    manu:'',
                    x: "",
                    y: "",
                    z: '',
                    markerType: 'camera',
                    points:''
                    // visual_radius: '',
                }
            },

            filterData: {
                id: "",
                mapId: "",
                ip: '',
                port: "",
                initAngleX: '',
                initAngleY: '',
                x: "",
                y: "",
                z: 100,
                interfacePort:'',
                username:'',
                password:'',
                productModel:'',
                seqNum:'',
                // visual_radius: ''
            },
            edit: {
                id: "",
                ip: '',
                port: "",
                mapId: "",
                initAngleX: '',
                rotateMax: '',
                manu:'',
                interfacePort:5000,
                username:'',
                password:'',
                productModel:'',
                seqNum:'',
                x: "",
                y: "",
                z: '',
            }
        }),
        _defineProperty(_ref, 'fence', {
            trif: [{
                id: 'i',
                cname: lang['triggeringIn']
            }, {
                id: 'o',
                cname: lang['triggeringOut']
            }, {
                id: 'io',
                cname: lang['triggeringInOut']
            },
            {
                id: 'in',
                cname: lang['triggeringInner']
            },
        ],
            color:'#f00',   //区域默认颜色,围栏，维度，摄像头区别
            opacity:0.5,       //区域透明度
            isRecord: '',
            isEmail: '',
            isSMS: '',
            // fenceValidities:{},
            // allTagsData:[],
            // searchTrifTag:'',   //触发标签搜索
            // indeterminate:true,  //全选样式控制
            data:[], //innerTags:{},//内部有哪些标签，用于点名
            get fenceTableData(){
                var filterTypeId = [UBIT.fenceType.pollingId,UBIT.fenceType.attendanceId,UBIT.fenceType.specialZoneId];
                return this.data.filter((value) => {
                    return !filterTypeId.includes(parseInt(value.ftypeId));
                })
            },
            get pollingData(){
                if(this.data.length <= 0){
                    return [];
                }
                return this.data.filter((value) => {
                    return value.ftypeId == UBIT.fenceType.pollingId;
                });
            },
            get specialZoneData(){
                if(this.data.length <= 0){
                    return [];
                }
                return this.data.filter((value) => {
                    return value.ftypeId == UBIT.fenceType.specialZoneId;
                });
            },
            get attendanceData(){
                if(this.data.length <= 0){
                    return [];
                }
                return this.data.filter((value) => {
                    return value.ftypeId == UBIT.fenceType.attendanceId;
                });
            },

            drawBegin:false,
            deleteBtn: true,
            isIndeterminate: true,
            checkAll: true,
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            filterData: {
                model: "",
                cname: "",
                id: "",
                ftype: ""
            },
            pollingEdit:{
                id: "",
                cname:'',
                tagCat:'',
                ftypeId:5,
                visible:false,
            },
            specialZone:{
                id: "",
                cname:'',
                ftypeId:6,
                visible:false,
            },
            attendanceEdit:{
                id: "",
                cname:'',
                tagCat:'',
                ftypeId:4,
                visible: false,
            },
            edit: {
                id: "",
                cname: "",
                ftype: "",
                tipInterval:10000,
                points: [],
                visible: false,
                // ftypeId: '',
                get ftypeId(){
                    return this._ftypeId;
                },
                set ftypeId(value){
                    if(ME.vm.activeWrap === 'attendance'){
                        return this._ftypeId = 4;
                    }
                    if(ME.vm.activeWrap === 'polling'){
                        return this._ftypeId = 5;
                    }
                    if(!value){
                        return;
                    }
                    this._ftypeId = value;
                },
                trif: '',
                trif2: '',
                isRecord: '',
                isEmail: '',
                isSMS: '',
                mapId: '',
                color: "",
                // trif_tags:[],  //触发分组标签
                innerTags: {}, //内部有哪些标签，用于点名
                _tagCat:[],
                siren:'',
                get tagCat(){
                    return this._tagCat;
                },
                set tagCat(value){
                    value = value  || [];
                    if(typeof value === 'string'){
                        this._tagCat = value.split(',');
                    }else{
                        this._tagCat = value;
                    }
                },
                baseValidity:[
                    // new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    // new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1)
                ],
                fenceValidities:[],
            }
        }),
        _defineProperty(_ref, 'moreMonitor', {
            data: [], //所有互监组
            visible: false,
            deleteBtn: true,
            boxisActive:false,
            searchValue:'',    //搜索的值
            allTagsData:[],    //搜索过滤后数据
            allData:[],        //搜索数据来源，更新时显示所有，添加时只显示不存在其他组的标签
            index: '',
            macs:[],
            edit: {
                id: 0,
                cname: "",
                distance: "",
                tags: [],
                model:'moreMonitorOne',
                watchman:'',
                color:'#ff0000',
                // datetimeRange: [new Date(), new Date()],
                datetimeRange: [],
                // isEmail: '0',
                // email:'',
                // isSMS: '0',
                // phone:''
            }
        }),
        _defineProperty(_ref, 'dimension', {
            dim:[{id:'d0',cname:'0维'},
                // {id:'d1',cname:'1维'},
                // {id:'d1.5',cname:'1.5维'},
                // {id:'d2',cname:'2维'},
                // {id:'d2.5',cname:'2.5维'},
                // {id:'d3',cname:'3维'}
                ],
            color:'#87CEEB',   //区域颜色
            opacity:0.5,       //区域透明度
            zoom:1,            //记录缩放比，设置显示提示处位置
            data: [], //innerTags:{},//内部有哪些标签，用于点名
            visible: false,
            drawBegin:false,
            deleteBtn: true,
            isIndeterminate: true,
            checkAll: true,
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            edit: {
                id: "",
                cname: "",
                dim:'',
                points: [],
                mapId: '',
                innerTags: {}, //内部有哪些标签，用于点名
            }
        }),
        _defineProperty(_ref, 'wall', {
            wtypes: [{cname:lang['solidWall'],code:'solid'},
                {cname:lang['virtualWall'],code:'dotted'},
                {cname:lang['track'],code:'rail'}],//'实墙','虚墙','轨道'
            data: [],
            visible: false,
            deleteBtn: true,
            isIndeterminate: true,
            checkAll: true,
            index: '',
            arrowIcon: {
                sort: false,
                type: ''
            },
            floatEdit: {
                visible: false,
                typeIcon: '', //../../common/img/tagType/man.png
                typeIconShow: false,
                data: {
                    id: "",
                    cname:'',
                    mapId:'',
                    wtype:'',
                    startX:'',
                    startY:'',
                    endX:'',
                    endY:'',
                    width:''
                    // visual_radius: '',
                }
            },
            filterData: {
                id: "",
                cname:'',
                startX:'',
                startY:'',
                endX:'',
                endY:'',
            },
        }),
        // _defineProperty(_ref, 'statistic', {
        //     fence: {
        //         trif: 'io',
        //         fenceId: 0,
        //         stime: 0,
        //         etime: 0,
        //     },
        //
        // }),
        _defineProperty(_ref, 'setOrigin', {
            visible: false,
            edit: {
                id: "",
                cname:'',
                origin_x: "",
                origin_y: "",
                origin_z: '',
            }
        }),
        // _defineProperty(_ref, 'statis', {
        //     fenceStatisAttr:{
        //         // fenceId:0,  //统计围栏
        //         fenceId:0,  //统计围栏
        //         trif:'io' ,   //触发条件
        //         stime:0,
        //         etime:0
        //     },     //统计条件
        //     chart:{
        //         zoomType: 'x',//缩放方式
        //         backgroundColor:'rgba(0,0,0,0)',
        //         plotBackgroundColor:'rgba(0,0,0,0)'
        //     }, //图表配置
        //     title:{
        //         text:'围栏标签统计',
        //         align:'center',
        //         style:{
        //             color:'rgba(255,163,63,0.5)',
        //             fontSize:'14px'
        //         }
        //     }, //标题配置
        //     xAxis: { //x轴
        //         type: 'datetime',//时间轴
        //         dateTimeLabelFormats: {//时间轴标签的格式化字符串。
        //             millisecond: '%H:%M:%S.%L',
        //             second: '%H:%M:%S',
        //             minute: '%H:%M',
        //             hour: '%H:%M',
        //             day: '%m-%d',
        //             week: '%m-%d',
        //             month: '%Y-%m',
        //             year: '%Y'
        //         },
        //         tickLength:3,
        //         tickInterval:100,        //刻度间隔
        //         labels:{
        //             style:{
        //                 fontSize:'10px',
        //                 color:'rgba(255,255,255,0.4)'
        //             }
        //         }
        //     }, //x轴坐标配置
        //     yAxis: {
        //         title: {
        //             // text: '标签'
        //             text: null
        //         },
        //         labels:{
        //             style:{
        //                 fontSize:'10px',
        //                 color:'rgba(255,255,255,0.4)'
        //             }
        //         },
        //         gridLineWidth:1,
        //         gridLineColor:'#ccc',
        //         gridLineDashStyle:'Dash',
        //     },  //y轴坐标配置
        //     tooltip: {//数据提示框指的当鼠标悬停在某点上时，以框的形式提示该点的数据，比如该点的值，数据单位等。数据提示框内提示的信息完全可以通过格式化函数动态指定；通过设置 tooltip.enabled = false 即可不启用提示框。
        //         dateTimeLabelFormats: {
        //             millisecond: '%H:%M:%S.%L',
        //             second: '%H:%M:%S',
        //             minute: '%H:%M',
        //             hour: '%H:%M',
        //             day: '%Y-%m-%d',
        //             week: '%m-%d',
        //             month: '%Y-%m',
        //             year: '%Y'
        //         },
        //         backgroundColor:'rgba(255,163,63,0.5)',
        //         borderColor:'#ffa33f',
        //         opacity:0.5,
        //         style:{
        //             fontSize:'10px',
        //             color:'#fff',
        //         }
        //     },  //提示框配置
        //     legend: {
        //         enabled: false
        //     },  //显示配置
        //     plotOptions: {
        //         area: {
        //             fillColor: {
        //                 linearGradient: {
        //                     x1: 0,
        //                     y1: 0,
        //                     x2: 0,
        //                     y2: 1
        //                 },
        //                 stops: [
        //                     // [0, Highcharts.getOptions().colors[0]],
        //                     [0, 'rgba(255,163,63,0.5)'],
        //                     [1, 'rgba(255,255,255,0)']
        //                     // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        //                 ]
        //             },
        //             marker: {
        //                 radius: 2
        //             },
        //             lineWidth: 1,
        //             states: {
        //                 hover: {
        //                     lineWidth: 1
        //                 }
        //             },
        //             threshold: null
        //         }
        //     },
        //     credits:{
        //       text:'全迹科技:www.ubitraq.com',
        //         href:'http://www.ubitraq.com'
        //     },
        //     series: [{
        //         type: 'area',
        //         name: '围栏标签数量',
        //         data: null,
        //         color:'rgba(255,163,63,0.5)'
        //     }]
        //
        // }),

        _ref;
};