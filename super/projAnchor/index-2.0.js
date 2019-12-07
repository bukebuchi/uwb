$(function(){
    vueInit();
})
function checks (rule, value, callback) {
    if(ME.vm.form.action!='update') return callback();

    if (!value) {
        callback(new Error(lang['enterCode']));
        return;
    }

    var anchors = $('#anchorTable').bootstrapTable('getData');
    var id = ME.vm.form.id;
    anchors.forEach(function(anchor){
        if(value.toLowerCase() == anchor.code.toLowerCase() && id!=anchor.id){
            callback(new Error(lang['enterCodeNotePre']+anchor.id+lang['enterCodeNoteAfter']));
            return;
        }
    });
    callback();
}



//验证基站输入
function checkCodeSpan (rule, value, callback) {
    if(ME.vm.form.action!='add') return callback();

    var start = ME.vm.form.code_start;
    var end = ME.vm.form.code_end;

    if (!start ||　!end) {
        callback(new Error(lang['checkCodeSapnStartEnd']));
        return;
    }

    //转换
    var s_num = UBIT.code2Num(start);
    var e_num = UBIT.code2Num(end);

    ME.vm.form.anchor_num = e_num - s_num +1;
    var max_num=500;
    if (ME.vm.form.anchor_num<1) {
        callback(new Error(lang['checkCodeSapnStartEndError']));
        return;
    }

    if (ME.vm.form.anchor_num>max_num) {
        callback(new Error(lang['checkCodeSpanMaxNum']+max_num));
        return;
    }
    if(ME.vm.form.anchor_num==1){
        ME.vm.isShowAliasInput=true;
    }else {
        ME.vm.isShowAliasInput=false;
    }
    var anchors = $('#anchorTable').bootstrapTable('getData');

    var addAnchors = [];
    var anchor_codes = [];
    for(var k=0;k<ME.vm.form.anchor_num; k++){
        var anchor_num = s_num+k;
        var anchor_mac = UBIT.num2Code(anchor_num).toLowerCase();
        var anchor_code = anchor_mac;

        for(var i=0;i<anchors.length;i++){
            var anchor = anchors[i];
            if(anchor_mac == anchor.mac.toLowerCase()){
                callback(new Error(lang['checkCodeSpanPre']+anchor_mac+lang['checkCodeSpanMid']+anchor.id+lang['checkCodeSpanAfter']));
                return;
            }
        }
        addAnchors.push(anchor_mac);
        anchor_codes.push(anchor_code);
    }

    ME.vm.form.code_start=start.toLowerCase();
    ME.vm.form.code_end=end.toLowerCase();
    ME.addAnchors =addAnchors;
    ME.anchor_codes =anchor_codes;
    callback();
}

//时槽验证
function checkAnchorSlot(rule, value, callback) {
    var keys = ['anchorSlotWidth','anchorSlotTotalNum','anchorSlotSeqNum'];
    var index = keys.indexOf(rule.field);
    if(index!= -1){
        keys.splice(index,1);
    }
    if(keys.length ==2) {
        if (ME.vm.form[rule.field] === undefined || ME.vm.form[rule.field] === ""){
            if ((ME.vm.form[keys[0]] !== undefined && ME.vm.form[keys[0]] !== "") ||
                (ME.vm.form[keys[1]] !== undefined && ME.vm.form[keys[1]] !== "")) {
                callback(new Error('请填写！'));

            } else {
                callback();
            }
        }else{
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
        }
    }else{
        callback(new Error('代码逻辑有问题！'))
    }
}

//方向验证
function checksDirection(rule, value, callback) {
    if(value!==""&&!isNaN(value)) {
        var value = value * 1;
        if (0 <= value && 360 >= value) {
            callback();
        } else {
            callback(new Error('数字要在 0 - 360 之间！'));
        }
    }else{
        callback(new Error('请填写在 0 - 360 之间的数字！'));
    }
}

function pageInit(){
    // var tableColumns = getTableColumns(ME.pageType);

    $('#anchorTable').bootstrapTable({
        url:ME.host+'/project/anchor/list?projectId='+ME.user.projectId,
        method:'get',
        queryParams:function(params){
            return params;
        },
        responseHandler:function(res){
            getMasterLists(res);
            return res;
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
        pageList:[2,5,10, 25, 50, 100, 200],
        sidePagination:'client',
        toolbarAlign:'left',
        toolbar:'#anchortoolbar',
        onDblClickRow:function(row, $element){
            ME.vm.updateAnchor();
        },
        onLoadSuccess:function(data){
        },
        columns: TABLE_COLUMNS,
    });

}

function vueInit(){

    VUE_DATA = Object.assign(VUE_DATA, getCfgData(ANCHOR_CONF));
    VUE_DATA.modefiyPwdRule = {
        code: [
            { min: 8, max: 8, message: lang['modefiyPwdRuleCode'], trigger: 'blur' },
            { validator: checks, trigger: 'blur' }
        ],
        code_start: [
            { min: 8, max: 8, message: lang['modefiyPwdRuleCode'], trigger: 'blur' },
            { validator: checkCodeSpan, trigger: 'blur' }

        ],
        code_end: [
            { min: 8, max: 8, message: lang['modefiyPwdRuleCode'], trigger: 'blur' },
            { validator: checkCodeSpan, trigger: 'blur' }
        ],
        projectId : [
            { required: true, message: lang['modefiyPwdRuleProjectId'], trigger: 'change' },
        ],
        productId : [
            { required: true, message: lang['modefiyPwdRuleProductId'], trigger: 'change' },
        ],
        mapId : [
            { required: true, message: lang['modefiyPwdRuleMapId'], trigger: 'change' },
        ],
        anchorSlotWidth: [
            // { type:"number", min: 0, max: 65535, message: '请输入0-65535之间的数字', trigger: 'blur' },
            { validator: checkAnchorSlot, trigger: 'blur' }
        ],
        anchorSlotTotalNum: [
            // { type:"number", min: 0, max: 65535, message: '请输入0-65535之间的数字', trigger: 'blur' },
            { validator: checkAnchorSlot, trigger: 'blur' }
        ],
        anchorSlotSeqNum: [
            // { type:"number", min: 0, max: 65535, message: '请输入0-65535之间的数字', trigger: 'blur' },
            { validator: checkAnchorSlot, trigger: 'blur' }
        ],
        direction: [
            // { type:"number", min: 0, max: 65535, message: '请输入0-65535之间的数字', trigger: 'blur' },
            { validator: checksDirection, trigger: 'blur' }
        ]

        // mac : [
        //     { required: true, message: '请输入mac地址', trigger: 'blur' },
        // ]
    };
    VUE_METHODS = Object.assign(VUE_METHODS,CONF_VUE_METHODS);

    ME.vm = new Vue({
        el:'#app',
        data: VUE_DATA,
        created:function(){
            // 获取项目下地图信息
            this.$http.get('map/list?projectCode='+ME.user.projectCode).then(function(res){
                this.maps = res.body;
                // 获取产品信号
                this.$http.get('super/product/listByType?type=anchor').then(function(res){
                    this.products=res.body;

                    pageInit();
                });
            });

        },
        methods:VUE_METHODS,
    });

}
