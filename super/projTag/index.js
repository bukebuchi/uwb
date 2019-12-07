/**
 * Created by LiuTao on 2017/7/03 0028.
 */

$(function(){
    init();
});

function init(){
    vueInit();
}

function checkCode (rule, value, callback) {
        if(ME.vm.form.action!='update') return callback();

        if (value === '') {
          callback(new Error(lang['enterCode']));
          return;
        }

        var tags = $('#tagtable').bootstrapTable('getData');
        var id = ME.vm.form.id;
        var flag = true;
        tags.forEach(function(tag){
            if(value == tag.code && id!=tag.id){
                callback(new Error(lang['checkCodeNotePre']+tag.id+lang['checkCodeNoteAfter']));
                return;
            }
        });
        if(!flag) return;
        callback();
}
function checkCodeSpan (rule, value, callback) {
    if(ME.vm.form.action!='add') return callback();

    var start = ME.vm.form.code_start;
    var end = ME.vm.form.code_end;

    if (!start ||　!end) {
        callback(new Error(lang['checkCodeSpanNote']));
        return;
    }

    
    var s_num = UBIT.code2Num(start);
    var e_num = UBIT.code2Num(end);

    ME.vm.form.tag_num = e_num - s_num +1;

    if (ME.vm.form.tag_num<1) {
        callback(new Error(lang['checkCodeSpanNote2']));
        return;
    }

    if (ME.vm.form.tag_num>450) {
        callback(new Error(lang['checkCodeSpanNote3']));
        return;
    }
    if(ME.vm.form.tag_num==1){
        ME.vm.isShowAliasInput=true;
    }else {
        ME.vm.isShowAliasInput=false;
    }
    var tags = $('#tagtable').bootstrapTable('getData');

    var addTags = [];
    var tag_codes=[];
    for(var k=0;k<ME.vm.form.tag_num; k++){
        var tag_num = s_num+k;
        var tag_mac = UBIT.num2Code(tag_num).toLowerCase();
        var tag_code = tag_mac;

        for(var i=0;i<tags.length;i++){
            var tag = tags[i];
            if(tag_mac.toLowerCase() == tag.mac.toLowerCase()){
                callback(new Error(lang['checkCodeSpanNote4Pre']+tag_mac+lang['checkCodeSpanNote4Mid']+tag.id+lang['checkCodeSpanNote4After']));
                return;
            }
        }
        addTags.push(tag_mac);
        tag_codes.push(tag_code);
    }
    ME.vm.form.code_start=start.toLowerCase();
    ME.vm.form.code_end=end.toLowerCase();
    ME.addTags =addTags;
    ME.tag_codes =tag_codes;
    callback();
}

function checkTagSlotSeqNum(rule, value, callback) {
    if(value!==undefined && value!==""){
        var value = value * 1;
        if(Number.isInteger(value)){
            if( 0 <= value && 65535 >=value){
                callback();
            }else{
                callback(new Error('数字要在 0 - 65535 之间！'));
            }
        }else{
            callback(new Error('只能填写数字！'));
        }
    }else{
        callback();
    }
}

function pageInit(){
    var Vue = window.Vue;
    var VueQrcode = window.VueQrcode;
    Vue.component('qrcode', VueQrcode);

    $('#tagtable').bootstrapTable({
        url:ME.host+'/project/tag/list',
        method:'get',
        queryParams:function(params){
            return params;
        },
        search:true,
        showRefresh:true,
        idField:'id',
        uniqueId:'id',
        clickToSelect:true,
        singleSelect:false,
        sortable:true,
        striped:true,
        showColumns:true,
        sortName:'id',
        sortOrder:'desc',
        pagination:true,
        pageSize:10,
        pageList:[10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#tagtoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.tagUpdate();
        },

    columns: [
        {checkbox:true},
        {field: 'id',title: 'ID', width:'2%', sortable:true,  searchable:true},
        {field: 'sourceId',title: 'sourceId', width:'2%', sortable:true,  searchable:true},
        {field: 'code', title: lang['code'], width:'5%', sortable:true, searchable:true}, 
        {field: 'mac',title: lang['mac'],width:'6%', sortable:true, searchable:true},
        {field: 'productId',title: lang['productId'],width:'6%', sortable:true, searchable:true,
        formatter:function(value, row, index){
        var prod='';
        if(value){
            var prodItem=ME.vm.products.find(function(v){return v.id==value});
            if(prodItem){
                prod=prodItem.cname+'('+prodItem.description+')'
                    }
                }
            return prod;
            },
        },
        {field: 'alias',title: lang['alias'],width:'10%', sortable:true, searchable:true},
        {field: 'status',title: lang['status'],width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                if(value=='online'){
                    return '<font style="color:green;">'+lang['online']+'</font>';
                }else if(value=='offline'){
                    return '<font style="color:red;">'+lang['offline']+'</font>';
                }else if(value=='disable'){
                    return '<font style="color:gray;">'+ lang['disable'] +'</font>';
                }
                return lang['unknown'];
            }
        },
        {
            field: 'power', title: lang['power'], width: '6%', pageType: 'super', sortable: true, searchable: true,
            formatter: function (value, row, index) {
                if (value) {
                    var powerLevel = UBIT.getPower(value);
                    var color = '';
                    if (powerLevel < 30) {
                        color = "#eb3324";
                    }else if (powerLevel < 70) {
                        color = "#f7cd46";
                    } else {
                        color = "#4cd96c";
                    }
                    return '<font style="color:'+color+'">'+value+'</font>';
                }
                return '';
            },
        },
        {field: 'catId',title: lang['catId'],width:'10%', sortable:true, searchable:true,
        formatter:function(value, row, index){
            var color='#fff';
            var catCname='';
            if(value){
                var catItem=ME.vm.cats.find(function(v){return v.id==value});
                if(catItem) {
                    color=catItem.color;
                    catCname=catItem.cname
                }
            }
            return '<font color="'+color+'">'+catCname+'</font>';
        }

        },
        {field: 'typeId',title: lang['typeId'],width:'25%', sortable:true, searchable:true,
        formatter:function(value, row, index){
        var html;
        var url=ME.iconPath + 'tag/location_blue.png';
            if(value){
                var tagTypeItem=ME.vm.tagTypes.find(function(v){return v.id==value});
                if(tagTypeItem&&tagTypeItem.icon){
                    url= UBIT.getImgSrc('tagTypes', tagTypeItem.icon);
                }
            }
            var html = '<img src="'+url+'" width="40px" height="40px"/>' ;
            return html;
            }
        },
        {field: 'txPower',title: '发射功率',width:'10%', sortable:true, searchable:true},
        {field: 'isHoldPosition',title: '开启休眠',width:'6%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value<1?'是':'否';
            }
        },
        {field: 'wakePeriod',title: '唤醒周期(分钟)',width:'25%', sortable:true, searchable:true},
        {field: 'tagSlotSeqNum',title: lang['tagSlotSeqNum'],width:'6%', sortable:true, searchable:true},
        {field: 'locatingPeriod',title: '定位周期(ms)',width:'10%', sortable:true, searchable:true},
        {field: 'softVersion',title: '软件版本号',width:'25%', sortable:true, searchable:true},
        {field: 'hardVersion',title: '硬件版本号',width:'10%', sortable:true, searchable:true},
        {field: 'locationMode',title: '定位模式',width:'10%', sortable:true, searchable:true},
        {field: 'switchDistance',title: '切站距离(m)',width:'10%', sortable:true, searchable:true},
        {field: 'sleepWait',title: '进入休眠等待（s）',width:'10%', sortable:true, searchable:true},
        {field: 'isHoldBle',title: '开启蓝牙',width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value>0?'是':'否';
            }
        },
        {field: 'isHoldUart',title: '开启串口',width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value>0?'是':'否';
            }
        },
        {field: 'motionSensorMode',title: '运动传感器模式',width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                var v = ME.vm.motionSensorModesDef[parseInt(value)];
                if(v) return v;
                return value;
            }
        },
        {field: 'distanceDiffBias',title: '距离差偏(mm)',width:'10%', sortable:true, searchable:true},
        {field: 'alterMinDistance',title: '近距报警阈值(mm)',width:'10%', sortable:true, searchable:true},
        {field: 'alterMaxDistance',title: '远距报警阈值(mm)',width:'10%', sortable:true, searchable:true},
        {field: 'channel',title: '频道',width:'10%', sortable:true, searchable:true},
        {field: 'manu',title: '厂商',width:'10%', sortable:true, searchable:true},
        {field: 'maxPower',title: '最大电量(mv)',width:'10%', sortable:true, searchable:true},
        {field: 'minHeart',title: '最小心率',width:'10%', sortable:true, searchable:true},
        {field: 'maxHeart',title: '最大心率',width:'10%', sortable:true, searchable:true},

        {field: 'rxDelay',title: '天线rx延迟(m)',width:'10%', sortable:true, searchable:true},
        {field: 'txDelay',title: '天线tx延迟(m)',width:'10%', sortable:true, searchable:true},
        {field: 'frameType',title: '帧类型',width:'10%', sortable:true, searchable:true },


        {field: 'crc',title: 'crc',width:'25%', sortable:true, searchable:true},
        {field: 'dataRate',title: lang['dataRate'],width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                for(var i=0;i<ME.vm.dataRateType.length;i++){
                    var item = ME.vm.dataRateType[i];
                    if(item.code == value){
                        return item.cname;
                    }
                }
                return value;
            },
        },
        {field: 'pacSize',title: lang['pacSize'],width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                for(var i=0;i<ME.vm.pacSizeType.length;i++){
                    var item = ME.vm.pacSizeType[i];
                    if(item.code == value){
                        return item.cname;
                    }
                }
                return value;
            },
        },
        {field: 'pulseFrequency',title: lang['pulseFrequency'],width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                for(var i=0;i<ME.vm.pulseFrequencyType.length;i++){
                    var item = ME.vm.pulseFrequencyType[i];
                    if(item.code == value){
                        return item.cname;
                    }
                }
                return value;
            },
        },

        {field: 'preambleCode',title: lang['preambleCode'],width:'25%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                for(var i=0;i<ME.vm.preambleCodeType.length;i++){
                    var item = ME.vm.preambleCodeType[i];
                    if(item.code == value){
                        return item.cname;
                    }
                }
                return value;
            },
        },
        {field: 'preambleLength',title: lang['preambleLength'],width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                for(var i=0;i<ME.vm.preambleLengthType.length;i++){
                    var item = ME.vm.preambleLengthType[i];
                    if(item.code == value){
                        return item.cname;
                    }
                }
                return value;
            },
        },
        {field: 'smartPower',title: 'smartPower',width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['support']:lang['nonsupport'];
            },
        },
        {field: 'frameCheck',title: 'frameCheck',width:'10%', sortable:true, searchable:true,
            formatter:function(value, row, index){
                return value>0?lang['support']:lang['nonsupport'];
            },
        },
        {field: 'upTime',title: lang['upTime'],width:'10%', sortable:true, searchable:true},

        {field: 'addTime',title: lang['addTime'],width:'6%', sortable:true, searchable:true},
        {field: 'addUser',title: lang['addUser'],width:'6%', sortable:true, searchable:true},
        {field: 'upUser',title: lang['upUser'],width:'6%', sortable:true, searchable:true},
    ]
});

}

function vueInit(){

    var VUE_DATA = Object.assign(getCfgData(TAG_CONF),
        {
            cats : [],
            tagTypes:[],
            products : [],
            have:false,
            isShowAliasInput:false,
            tagBtnDisable:false,
            tagSetBtnDisable:false,
            syncTagBtnDisable:false,
            tagRestartBtnDisable:false,
            tagDeleteBtnDisable:false,
            tagDownAlertBtnDisable:false,

            txPowers: UBIT.txPowers,
            algorithms : UBIT.algorithms,
            tagCodes:[],
            checkAllUpdate:false,
            basicLabels: ['projectId','alias','catId','typeId','productId','rxDelay@txDelay', 'maxPower','manu'],
            basicSelected:[],//选择的属性

            setLabels:['locatingPeriod','txPower','wakePeriod','locationMode','switchDistance','sleepWait','isHoldPosition',  'tagSlotSeqNum', 'isHoldBle','isHoldUart','distanceDiffBias', 'alterMinDistance@alterMaxDistance', 'motionSensorMode','minHeart','maxHeart'],
            setSelected:[],
        
            status : [
                {
                    code : "online",
                    cname : lang['online']
                },
                {
                    code : "offline",
                    cname : lang['offline']
                },
                {
                    code : "disable",
                    cname : lang['disable']
                }
            ],
            motionSensorModesDef :{0:'ACC_LOW_POWER',1:"ACC_SMAPLE", 2:"ACC_GYRO_COMP",3:"DMP_CALC"},
            channelType : [
                {
                    code : "1",
                    cname : "1"
                },
                {
                    code : "2",
                    cname : "2"
                },
                {
                    code : "3",
                    cname : "3"
                },
                {
                    code : "4",
                    cname : "4"
                },
                {
                    code : "5",
                    cname : "5"
                },
                {
                    code : "7",
                    cname : "7"
                }
            ],
            frameTypeType : [
                {
                    code : "standard",
                    cname : lang['standard']
                },
                {
                    code : "extend",
                    cname : lang['extend']
                }
            ],
            dataRateType : [
                {
                    code : "110",
                    cname : "110Kbps"
                },
                {
                    code : "850",
                    cname : "850Kbps"
                },
                {
                    code : "6800",
                    cname : "6800Kbps"
                },
            ],
            pacSizeType: [
                {
                    code : "8",
                    cname : "SIZE_8"
                },
                {
                    code : "16",
                    cname : "SIZE_16"
                },
                {
                    code : "32",
                    cname : "SIZE_32"
                },
                {
                    code : "64",
                    cname : "SIZE_64"
                }
            ],
            pulseFrequencyType : [
                {
                    code : "16",
                    cname : "16MHZ"
                },
                {
                    code : "64",
                    cname : "64MHZ"
                },
            ],
            preambleLengthType : [
                {
                    code : "64",
                    cname : "LEN_64"
                },
                {
                    code : "128",
                    cname : "LEN_128"
                },
                {
                    code : "256",
                    cname : "LEN_256"
                },
                {
                    code : "512",
                    cname : "LEN_512"
                },
                {
                    code : "1024",
                    cname : "LEN_1024"
                },
                {
                    code : "1536",
                    cname : "LEN_1536"
                },
                {
                    code : "2048",
                    cname : "LEN_2048"
                },
                {
                    code : "4096",
                    cname : "LEN_4096"
                }
            ],
            preambleCodeType: [
                {
                    code : "1",
                    cname : "16MHZ_1"
                },
                {
                    code : "2",
                    cname : "16MHZ_2"
                },
                {
                    code : "3",
                    cname : "16MHZ_3"
                },
                {
                    code : "4",
                    cname : "16MHZ_4"
                },
                {
                    code : "5",
                    cname : "16MHZ_5"
                },
                {
                    code : "6",
                    cname : "16MHZ_6"
                },
                {
                    code : "7",
                    cname : "16MHZ_7"
                },
                {
                    code : "8",
                    cname : "16MHZ_8"
                },
                {
                    code : "9",
                    cname : "64MHZ_9"
                },
                {
                    code : "10",
                    cname : "64MHZ_10"
                },
                {
                    code : "11",
                    cname : "64MHZ_11"
                },
                {
                    code : "12",
                    cname : "64MHZ_12"
                },
                {
                    code : "13",
                    cname : "64MHZ_13"
                },
                {
                    code : "14",
                    cname : "64MHZ_14"
                },
                {
                    code : "15",
                    cname : "64MHZ_15"
                },
                {
                    code : "16",
                    cname : "64MHZ_16"
                },
                {
                    code : "17",
                    cname : "64MHZ_17"
                },
                {
                    code : "18",
                    cname : "64MHZ_18"
                },
                {
                    code : "19",
                    cname : "64MHZ_19"
                },
                {
                    code : "20",
                    cname : "64MHZ_20"
                }

            ],
            smartPowerType : [
                {
                    code : "0",
                    cname : lang['nonsupport']
                },
                {
                    code : "1",
                    cname : lang['support']
                }
            ],
            frameCheckType : [
                {
                    code : "0",
                    cname : lang['nonsupport']
                },
                {
                    code : "1",
                    cname : lang['support']
                }
            ],
            qrcode:{
                title:lang['qrcode'],
                visible:false,
                value_2d:'',
                value_3d:'',
            },
            dialogFormVisible:false,
            code:'',
            form: {
                action: '',
                title : lang['addTag'],
                code: '',
                ids:[],
                codes: '',

                code_start: '',
                code_end: '',
                code_list:[],
                mac_list:[],
                tag_num:0,

                id: '',
                mac: '',
                projectId : 0,
                productId:'',
                status : "online",
                rxDelay:0,
                txDelay:0,
                wakePeriod : 15,
                locatingPeriod : 200,
                txPower:'1f1f1f1f',
                catId:'',
                typeId:'',
                typeIcon:'',

                algorithm:'',

                locationMode:8,
                switchDistance:30,
                sleepWait:15,
                isHoldPosition:0,
                isHoldBle:0,
                isHoldUart:0,
                distanceDiffBias : 0,
                alterMaxDistance:0,
                alterMinDistance:0,
                motionSensorMode : 0,

                maxPower : 4200,
                manu: '' ,
                softVersion  : '',
                hardVersion : '',
                channel : "2",
                frameType : 'standard',
                crc : 1,
                dataRate : "6800",
                pacSize : "64",
                pulseFrequency : "16",
                preambleLength : '64',
                preambleCode : '1',
                smartPower : "1",
                frameCheck : "1",
            },
            modefiyPwdRule: {
                code: [
                    { min: 8, max: 8, message: lang['codeRule'], trigger: 'blur' },
                    { validator: checkCode, trigger: 'blur' }
                ],
                code_start: [
                    { min: 8, max: 8, message: lang['codeRule'], trigger: 'blur' },
                    { validator: checkCodeSpan, trigger: 'blur' }
                ],
                code_end: [
                    { min: 8, max: 8, message: lang['codeRule'], trigger: 'blur' },
                    { validator: checkCodeSpan, trigger: 'blur' }
                ],
                projectId : [
                    { required: true, message: lang['projectIdRule'], trigger: 'change' },
                ],
                productId : [
                    { required: true, message: lang['productIdRule'], trigger: 'change' },
                ],
                tagSlotSeqNum: [
                    // { type:"number", min: 0, max: 65535, message: '请输入0-65535之间的数字', trigger: 'blur' },
                    { validator: checkTagSlotSeqNum, trigger: 'blur' }
                ],




            },
            formLabelWidth: '120px',

        });

    var VUE_METHODS = Object.assign(CONF_VUE_METHODS, {

        handleCheckAllChangeUpdate:function(){
            if(this.checkAllUpdate) {
                this.basicSelected = this.basicLabels;
                this.setSelected = this.setLabels;
            }else {
                this.basicSelected = [];
                this.setSelected = [];
            }
        },

        selectedChange:function () {
            this.checkAllUpdate = false;
        },

        getLabelSelected:function (selectedList) {
            var selectParams = {};
            for(var i=0;i<selectedList.length;i++){
                var itemArr = selectedList[i].split('@');
                var length = itemArr.length;
                switch(length){
                    case 1:
                        selectParams[itemArr]=ME.vm.form[itemArr];
                        break;
                    default:
                        for(var j=0;j<length;j++){
                            selectParams[itemArr[j]]=ME.vm.form[itemArr[j]];
                        }
                }
            }
            return selectParams;
        },

        // 提交数据之前，获取最新属性值
        getCheckedParm:function(){
            var selectParams={};

            Object.assign(selectParams,this.getLabelSelected(this.basicSelected));
            Object.assign(selectParams,this.getLabelSelected(this.setSelected));

            if(Object.keys(selectParams).length<1) {
                ME.vm.$alert(lang['mustCheckParm'], lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
                return selectParams;
            }

            // 根据type,加载必须的参数
            selectParams.id=this.form.id;
            selectParams.sourceId=this.form.sourceId;
            selectParams.ids=this.form.ids;
            selectParams.code=this.form.code;
            selectParams.codes=this.form.codes;

            return selectParams;
        },

        selectRows:function () {
            var rows = $('#tagtable').bootstrapTable('getSelections');
            if (!rows || rows.length<1){
                this.$alert('请选择一行记录！', '提示', {
                    confirmButtonText: '确定'
                });
                return false;
            }
            return rows;
        },

        filterOfflines:function () {
            var rows = this.selectRows();
            for(var i=0;i<rows.length;i++){
                var r = rows[i];
                if(r.status != 'online'){
                    ME.vm.$alert(lang['tag']+"“"+r.code+"”"+lang['statusError']+"!", lang['prompt']);
                    return false;
                }
            }
            return rows;
        },

        getOnlineTagCodes:function(){
            var rows = this.filterOfflines();
            if(!rows) return false;

            var codes = [];
            for(var i=0;i<rows.length;i++){
                codes.push(rows[i].code);
            }
            return codes;
        },

        createQrcode:function(){
            var rows = this.selectRows();
            if(!rows) return;
            if(rows.length>1){
                this.$alert(lang['createQrcodeNote'], lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
                return false;
            }
            var row = rows[0];
            var value_2d = ME.selfHost + '/map2d/index/?anony=1&tag=' + row.code;
            var value_3d = ME.selfHost + '/map3d/index/?anony=1&tag=' + row.code;

            this.qrcode.value_2d = value_2d;
            this.qrcode.value_3d = value_3d;
            this.qrcode.visible = true;
        },

        refresh:function(){
            $('#tagtable').bootstrapTable('refresh');
        },

        syncTag:function(){
            var codes = this.getOnlineTagCodes();
            if(!codes) return false;

            ME.vm.$http.post('super/tag/syncTags',{codes}).then(function(res){
                ME.vm.response(res.body, codes, "同步标签", true);
                ME.vm.syncTagBtnDisable = false;
            });
            ME.vm.syncTagBtnDisable = true;
        },

        tagAdd:function(){
            UBIT.emptyObj(ME.vm.form);
            this.dialogFormVisible = true;
            this.form.action = 'add';
            this.form.title = lang['addInfo'];
            this.form.wakePeriod = 30;
            this.form.locatingPeriod = 1000;

            this.form.txPower = "130d0727";
            this.form.locationMode = "8";
            this.form.switchDistance = 30;
            this.form.sleepWait = '15';
            this.form.isHoldPosition = 1;
            this.form.isHoldBle = 0;
            this.form.isHoldUart = 0;
            this.form.distanceDiffBias = 0;
            this.form.alterMaxDistance = 0;
            this.form.alterMinDistance = 0;
            this.form.motionSensorMode = 2;

            this.form.maxPower = 4200;
            this.form.crc = 1;
            this.form.status = "online";
            this.form.channel = "2";
            this.form.frameType = 'standard';
            this.form.dataRate = "6800";
            this.form.pacSize = "64";
            this.form.pulseFrequency = "64";
            this.form.preambleLength = "64";
            this.form.preambleCode = "9";
            this.form.smartPower = "0";
            this.form.frameCheck = "0";
            ME.addTags = [];
        },

        tagUpdate:function(){
            var rows = this.selectRows();
            if(!rows) return;
            if(rows.length>1){
                this.$alert(lang['onlySelectOne'], lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
                return false;
            }
            this.form.ids=[rows[0].id];
            this.isShowAliasInput=true;
            // 选择后清除属性勾选状态
            ME.vm.checkAllUpdate=false;
            ME.vm.handleCheckAllChangeUpdate();
            this.dialogFormVisible = true;
            this.form.title = lang['updateInfo'];
            UBIT.deepCopy(rows[0],ME.vm.form,1);
            this.form.action = 'update';
        },

        tagUpdateMore:function(){
            var rows = this.selectRows();
            if(!rows) return;
            ME.vm.isShowAliasInput=false;
            var codes=[];
            var ids=[];
             // 选择后清除属性勾选状态
             ME.vm.checkAllUpdate=false;
             ME.vm.handleCheckAllChangeUpdate();
            for(var i=0;i<rows.length;i++){
                codes.push(rows[i].mac);
                ids.push(rows[i].id);
            }
            this.form.codes=codes.join(',');
            this.form.ids=ids;
            this.dialogFormVisible = true;
            this.form.title = lang['updateMoreInfo'];
            UBIT.deepCopy(rows[0],ME.vm.form,1);
            this.form.action = 'updateMore';
        },

        tagDelete:function(){
            var rows = this.selectRows();
            if(!rows) return;
            var codes = []
            rows.forEach(function(r){
                codes.push(r.code);
            });
            this.$confirm(lang['tagDeleteNote'],lang['prompt'],{ }).then(function()  {

                ME.vm.$http.post('project/tag/del', {codes}).then(function(res){
                    var result = res.body;
                    if(result.isOk){
                        ME.vm.refresh();
                        this.$alert(lang['deleteSuccess'], lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail']+result.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                    ME.vm.tagDeleteBtnDisable = false;
                });
                ME.vm.tagDeleteBtnDisable = true;
            }).catch(function(){
            });
        },

        response:function (r, codes, title, isFresh) {
            if(r.hasOwnProperty('isOk')){
                ME.vm.$alert(r.msg, '提示');
                return;
            }
            if(r.successful.length == codes.length){
                if(isFresh)ME.vm.refresh();
                ME.vm.$alert(title + "成功！", '提示');
                return;
            }
            if(r.successful.length == 0){
                var text = '';
                for(var f of r.failed){
                    text += f.msg+';';
                }
                ME.vm.$alert(text, '提示');//title + "全部失败！" +
                return;
            }
            var text = '成功：';
            for(var s of r.successful){
                text += ''+s.tag+';';
            }

            ME.vm.$alert(text, '提示');
        },

        tagDownAlert:function () {
            var codes = this.getOnlineTagCodes();
            if(!codes) return;

            this.$confirm("确认下发告警么？","提示",{ }).then(function()  {
                ME.vm.$http.post('super/tag/downAlert', {codes}).then(function(res){
                    ME.vm.response(res.body, codes, "告警下发");
                    ME.vm.tagDownAlertBtnDisable = false;
                });
                ME.vm.tagDownAlertBtnDisable = true;
            }).catch(function(){
            });
        },
        addDo:function(){
            var url = 'project/tag/add';
            var msg= lang['addTag'];
            this.$refs['form'].validate(function(valid){
                if (valid) {
                    ME.vm.form.code_list = ME.tag_codes;
                    ME.vm.form.mac_list = ME.addTags;
                    var params = UBIT.deepCopy(ME.vm.form);
                    delete params.code_start;
                    delete params.code_end;
                    delete params.action;
                    delete params.title;
                    if(params.hasOwnProperty('rxDelay')&&!(params.rxDelay)) params.rxDelay=0;
                    if(params.hasOwnProperty('txDelay')&&!(params.txDelay)) params.txDelay=0;
                    if(params.hasOwnProperty('wakePeriod')&&!(params.wakePeriod)) params.wakePeriod=30;
                    if(params.hasOwnProperty('locatingPeriod')&&!(params.locatingPeriod)) params.locatingPeriod=1000;
                    if(params.hasOwnProperty('maxPower')&&!(params.maxPower)) params.maxPower=4200;
                    ME.vm.$http.post(url, params).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            ME.vm.refresh();
                            ME.vm.dialogFormVisible = false;
                            ME.vm.$alert(msg+lang['success'], lang['prompt']);
                        }else {
                            ME.vm.$alert(msg+lang['fail']+result.msg, lang['prompt'], {
                                confirmButtonText: lang['confirm']
                            });
                        }
                        ME.vm.tagBtnDisable = false;
                    });
                    ME.vm.tagBtnDisable = true;

                } else {
                    ME.vm.$alert(lang['enterError'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
            })
        },
        updateDo:function(){
            var msg='';
            var url='project/tag/'
            this.$refs['form'].validate(function(valid){
                if (valid) {
                    // 检查勾选，并获取值
                    var params = ME.vm.getCheckedParm();
                    if(Object.keys(params).length<1) return;
                    delete params.code_start;
                    delete params.code_end;
                    delete params.action;
                    delete params.title;
                    switch(ME.vm.form.action){
                        case 'update':url+='save';break;
                        case 'updateMore':
                            url+='saveMore';
                            msg+=lang['updateMore'];
                            break;
                    }
                    if(params.hasOwnProperty('rxDelay')&&!(params.rxDelay)) params.rxDelay=0;
                    if(params.hasOwnProperty('txDelay')&&!(params.txDelay)) params.txDelay=0;
                    if(params.hasOwnProperty('wakePeriod')&&!(params.wakePeriod)) params.wakePeriod=30;
                    if(params.hasOwnProperty('locatingPeriod')&&!(params.locatingPeriod)) params.locatingPeriod=1000;
                    if(params.hasOwnProperty('maxPower')&&!(params.maxPower)) params.maxPower=4200;

                    ME.vm.$http.post(url, params).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            ME.vm.refresh();
                            ME.vm.dialogFormVisible = false;
                            ME.vm.$alert(msg+lang['success'], lang['prompt']);
                        }else {
                            ME.vm.$alert(msg+lang['fail']+result.msg, lang['prompt'], {
                                confirmButtonText: lang['confirm']
                            });
                        }
                        ME.vm.tagBtnDisable = false;
                    });
                    ME.vm.tagBtnDisable = true;

                } else {
                    ME.vm.$alert(lang['enterError'], lang['prompt'], {
                        confirmButtonText: lang['confirm']
                    });
                    return false;
                }
            })
        },
        setTag:function(){
            var codes = this.getOnlineTagCodes();
            if(!codes) return false;

            var selectParams = this.getLabelSelected(this.setSelected);
            if(Object.keys(selectParams).length<1) {
                ME.vm.$alert(lang['mustCheckParm'], lang['prompt'], {
                    confirmButtonText: lang['confirm']
                });
                return;
            }

            var msg='设置';
            var params = Object.assign({codes:codes},selectParams);
            this.$confirm("确认"+msg+"标签么？","提示",{ }).then(function()  {
                ME.vm.$http.post('super/tag/setTag', params).then(function(res){
                    ME.vm.tagSetBtnDisable = false;
                    ME.vm.response(res.body, codes, msg);
                });
                ME.vm.tagSetBtnDisable = true;
            })

        },

        tagRestart:function(){
            var codes=this.getOnlineTagCodes();
            if(!codes) return;
            var msg='重启';
            this.$confirm("确认"+msg+"标签么？","提示",{ }).then(function()  {
                ME.vm.$http.post('super/tag/restart', {codes}).then(function(res){
                    ME.vm.response(res.body, codes, msg);
                    ME.vm.tagRestartBtnDisable = false;
                });
                ME.vm.tagRestartBtnDisable = true;

            }).catch(function(){});
        },
        getTagType:function(id){
            if(id){
                for(var i=0;i<this.tagTypes.length;i++){
                    var item = this.tagTypes[i];
                    if(item.id == id){
                        return item;
                    }
                }
            }
            return false;
        },
        changeIcon:function(){
            this.have = false;
            var type = this.getTagType(this.form.typeId);
            if(!type) return;

            ME.vm.form.typeIcon = UBIT.getImgSrc('tagTypes', type.icon);
            this.have = true;
        },



    });

    ME.vm = new Vue({
        el:'#app',
        data:VUE_DATA,
        created:function(){
                this.$http.get('super/product/listByType?type=tag').then(function(res){
                    this.products = res.body;
                });

                this.$http.get('model/list?model=tag_category').then(function(res){
                    if(res.ok){
                        this.cats = res.body;
                    }
                });
                this.$http.get('model/list?model=tag_type').then(function(res){
                    if(res.ok){
                        this.tagTypes=res.body;
                    }
                });
        },
        mounted:function(){
            pageInit();
        },
        methods:VUE_METHODS,
    });

}
