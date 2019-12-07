/**
 * Created by LiuTao on 2017/6/28 0028.
 */

$(function(){
    init();
})
function init(){
    vueInit();
    eventListenerInit();
}


function eventListenerInit(){
    $(window).on('resize', function () {
        ME.vm.initFrameHeight();
    });
}

function validatePwd (rule, value, callback) {
        if (value === '') {
          callback(new Error(lang['entryPasswordNote']));
        } else {
          // if (this.ruleForm2.checkPass !== '') {
          //   this.$refs.ruleForm2.validateField('checkPass');
          // }
      callback();
    }
}

function validateNewPwd (rule, value, callback) {
        if (value === '') {
          callback(new Error(lang['entryPasswordNote']));
        } else {
          if (ME.vm.form.checkPwd !== '') {
            ME.vm.$refs.form.validateField('checkPwd');
        }
      callback();
    }
}


             
      
function  validateCheckPwd  (rule, value, callback) {
        if (value === '') {
          callback(new Error(lang['entryPasswordAgainNote']));
        } else if (value !== ME.vm.form.newPwd) {
          callback(new Error(lang['enterPasswordInconsistent']));
        } else {
          callback();
    }
}

/**
 * 初始化Vue
 */
function vueInit(){

    Vue.http.options.emulateJSON = true;
    Vue.http.options.root = ME.host;
    Vue.http.options.xhr = { withCredentials: true };
    Vue.http.headers.common.api_token = ME.api_token;

    ME.vm = new Vue({
        el :　"#app",
        data : {
            lang:lang,
            sysName : lang['comDescTitle'],
            enableTplatfrom:UBIT.enableTplatfrom,
            collapsed : false,
            uniqueOpen: true,
            dialogFormVisible:false,
            user: ME.user,
            selfHost:ME.selfHost,
            language: UBIT.getLangType(),
            homePath:'',
            photoPath:'',
            imgUpload:{
                multiple:false,
                disabled:false,
                url:ME.host + '/super/user/uploadImg',
                headers:{
                    api_token:ME.api_token, 
                },
                auto:true,
                imgUrl:[],
            },
            form: {
                id: ME.user.id,
              pwd: '',
              newPwd: '',
              checkPwd: '',
            },
            modefiyPwdRule: {
                  pwd: [
                    { validator: validatePwd, trigger: 'blur' }
                  ],
                  newPwd: [
                    { validator: validateNewPwd, trigger: 'blur' }
                  ],
                  checkPwd: [
                    { validator: validateCheckPwd, trigger: 'blur' }
                  ]
            },
            dialogPersonVisible : false,
            form1 : {
                id: ME.user.id,
                api_token:ME.api_token,
                code:ME.user.code,
                cname :  ME.user.cname,
                cellphone :  ME.user.cellphone,
                email :  ME.user.email,
                birthDate :  ME.user.birthDate,
                address :  ME.user.address,
                img :  ME.user.img
            },
            modefiyPreRule : {
                cname: [
                    { required: true, message: lang['entryCname'], trigger: 'blur' },
                    { min: 1, max: 6, message: lang['entryCnameRule'], trigger: 'blur' },

                ],
                cellphone: [
                    { required: true, message: lang['entryCellphone'], trigger: 'blur' },
                    { min: 0, max: 15, message: lang['entryCellphoneRule'], trigger: 'blur' },

                ],
                email : [
                    { min: 0, max: 64, message: lang['entryEmailRule'], trigger: 'blur' },
                ],
                address : [
                    { min: 0, max: 127, message: lang['entryAddressRule'], trigger: 'blur' },
                ]
            },
            formLabelWidth: '120px',
            activeIndex: "1",
            openedMenu:[],
            defaultIcon: 'el-icon-circle-check',
            menus: [],
            currentMenu: null,
            defaultNagTab: 'home',
            nagTabs : [],
            frameHeight:400,
            footerMsg : lang['comDescDesc'],
            timeWarning:"&#12288;&#12288;&#12288;&#12288;&#12288;",
        },
        created:function(){
            //获取所有菜单
            var self = this;
            this.$http.get("super/common/getServerTime").then((res) => {
                if(!res || !res.body.isOk){
                    return;
                }
                var now = Date.now();
                self.timeWarning = `服务器时间与本地时间差:${Math.abs(now - moment(res.body.body).valueOf())}ms`
                // console.log(now - moment(res.body.data).valueOf());
                // if(Math.abs(now - moment(res.body.data).valueOf()) > 10){
                //     console.log(moment(res.body.data).valueOf());
                //     self.timeWarning = lang["timeWarning"];
                // }
            });
            this.$http.get('menu/list').then(function(res){

                if(res.body.hasOwnProperty('isOk') && !res.body.isOk){
                    this.logoutSource(res.body.msg + lang['isLogout']);
                    return ;
                }

                this.menus = res.body;
                console.log(res);
                //默认展开第一个福彩的
                if(this.menus && this.menus.length>0){

                    var menu = this.menus[0];
                    var codetest=menu.children;
                    
                    
                    var menuchilden = JSON.stringify(menu.children);

                    
                    var jsonarray = eval('('+menuchilden+')'); 
                    
                    var arr  = 
                    {
                        "id": 70,
                        "code": "doctor",
                        "cname": "医生管理",
                        "fid": 14,
                        "isActive": 1,
                        "path": "../user/",
                        "iconCls": "",
                        "module": "proj",
                        "sort": 15,
                        "memo": null,
                        "addTime": "2019-06-30T04:56:00.000Z",
                        "upUser": ""
                    }
                    
                    jsonarray.push(arr);
                    console.log(jsonarray);
                    menu.children = jsonarray;
                    this.activeIndex = menu.code;
                   
                    if(menu.children && menu.children.length>0){
                        this.openedMenu = [menu.code];
                    }
                    //默认显示页面

                   if(this.user.userType == 'super' && !this.user.projectId){
                       this.selectMenu('project');
                       this.homePath='basic_home';
                   }else if(this.user.projectId>0){
                       // this.selectMenu('projectInt_map');
                       this.homePath='proj_home';
                    //    this.homePath='./charts/proj_home';
                       this.goHome();
                   }
                //默认嵌入home页面
                this.nagTabs.unshift({id:0, cname:"首页", code:"home",path:this.homePath+".html", closable:false});
                }

            });
            //显示脚部信息
            if(this.user&&this.user.projectDesc){
                this.footerMsg=this.user.projectDesc;
            }

            //frame自适应屏幕的高度
            this.initFrameHeight();
            if(this.user.img){
                this.updateImg(this.user.img);
            }else {
                this.updateImg('user.png');
            }

            if(this.user && this.user.projectName) this.sysName = this.user.projectName;
        },
        methods : {
            updateImg:function(imgName){
                if(imgName!='user.png'){
                    this.imgUpload.imgUrl = [{name:imgName,url:UBIT.getImgSrc('user' ,imgName)}];
                    this.imgUpload.disabled = true;
                }else {
                    this.imgUpload.disabled = false;
                }
                this.photoPath = UBIT.getImgSrc('user' ,imgName);
            },
            handleImgUpload:function(response, file, fileList){
                if(response.isOk){
                    ME.vm.form1.img = response.fileName;
                    ME.vm.imgUpload.disabled = true;
                }
            },
            handleRemove:function(file, fileList){
                var fileName = '';
                if(file.response){
                    fileName = file.response.fileName;
                }else {
                    fileName = file.name;
                }
                ME.vm.$http.post(ME.host + '/super/user/deleteImg', {fileName:fileName}).then(function(rep){
                    var res = rep.body;
                    ME.vm.form1.img = '';
                    ME.vm.imgUpload.disabled = false;
                    if(res.isOk){
                        this.$alert(res.msg, lang['prompt']);
                    }else {
                        this.$alert(lang['deleteFail'] +"！"+res.msg, lang['prompt'], {
                            confirmButtonText: lang['confirm']
                        });
                    }
                });
            },
            submitProfileForm:function(formName){
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                    // alert('submit!');
                    ME.vm.form1.birthDate = new Date(ME.vm.form1.birthDate).Format("yyyy-MM-dd");
                    ME.vm.$http.post('super/user/updateProfile', ME.vm.form1).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            
                            //modify cookie
                             var userData = ME.vm.user;
                             userData.cname = ME.vm.form1.cname;
                             userData.cellphone = ME.vm.form1.cellphone;
                             userData.email = ME.vm.form1.email;
                             userData.birthDate = ME.vm.form1.birthDate;
                             userData.address = ME.vm.form1.address;
                             userData.img = ME.vm.form1.img;
                             
                             if(userData.img){
                                this.updateImg(userData.img);
                             }else {
                                 this.updateImg('user.png');
                             }
                             localStorage.setItem('userData', JSON.stringify(userData));

                            this.$alert(lang['modifyUserInfoSuccess']);

                            this.dialogPersonVisible = false;
                        }else {
                            this.$alert(lang['modifyUserInfoFail']+result.msg, lang['prompt'], {
                                  confirmButtonText: lang['confirm']
                            });
                        }
                    })
                  } else {
                    ME.vm.$alert(lang['modifyUserInfoFailRest'], lang['prompt'], {
                      confirmButtonText: lang['confirm']
                    });
                    return false;
                  }
                })
            },
            collapse : function(){
                this.collapsed = !this.collapsed;
            },
            nagdbclick:function(o, e){
                //TODO
                window.open(this.currentMenu.path);
            },
            goHome:function(){
                this.defaultNagTab = 'home';
            },
            showMenu: function(i,status){
                var div = this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i);
                div[0].style.display=status?'block':'none';
            },
            nagTabClick:function(nag){
                this.currentMenu = this.getMenuByCode(this.nagTabs, nag.name);
            },
            handleselect: function (menuCode) {
                return this.selectMenu(menuCode);
            },
            selectMenu:function(menuCode, e){
                this.currentMenu = this.getMenuByCode(this.menus, menuCode);
                //console.log(this.currentMenu);
                this.addTab(this.currentMenu);
            },
            logout:function(){
                return this.logoutSource(lang['isLogout']);
            },
            logoutSource:function(msg){
                    this.$confirm(msg,lang['prompt'],{

                    }).then(function() {

                        UBIT.logout();
                        window.location.href=UBIT.selfHost + '/login/index.html';

                    }).catch(function()  {

                    });
            },
            go2Tplatform:function(){
                window.open(this.selfHost + '/tplatform/index/');
            },
            projectManage:function(){
                // var row = this.selectproject();
                // if(!row) return;

                this.$confirm(lang['changeUserToSuper'],lang['prompt'],{ }).then(function(){

                    var params = {api_token:ME.api_token};
                    ME.vm.$http.post('super/user/changeAdmin2Super', params).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            //更改cookie中的用户信息
                            var userData = result.entity;
                            localStorage.setItem('userData', JSON.stringify(userData));

                            //跳转
                            top.location.reload();

                        }else {
                            this.$alert(lang['changeUserFail']+result.msg, lang['prompt'], {
                                confirmButtonText: lang['comfirm']
                            });
                        }
                    });
                }).catch(function(){

                });
            },
            pwd:function(){
                this.dialogFormVisible = true;
            },
            submitForm:function (formName) {
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                    // alert('submit!');
                    ME.vm.$http.post('super/user/changePwd', ME.vm.form).then(function(res){
                        var result = res.body;
                        if(result.isOk){
                            this.$alert(lang['modifyPasswordSuccess']);
                            this.dialogFormVisible = false;
                        }else {
                            this.$alert(lang['modifyPasswordFail']+result.msg, lang['prompt'], {
                                  confirmButtonText: lang['confirm']
                            });
                        }
                    })
                  } else {
                    ME.vm.$alert(lang['modifyPasswordFailRest'], lang['prompt'], {
                      confirmButtonText: lang['confirm']
                    });
                    return false;
                  }
                })
              },
              resetForm:function(formName) {
                this.$refs[formName].resetFields()
              },
            getMenuByCode:function(menu, menuCode){
                for(var i=0;i<menu.length;i++){
                    var fmenu = menu[i];
                    if(fmenu.children){
                        var result = this.getMenuByCode(fmenu.children, menuCode);
                        if(result){
                            return result;
                        }
                    }else if(fmenu.code==menuCode){
                        return fmenu;
                    }
                }
                return null;
            },
            initFrameHeight:function(){
                this.screenHeight= document.documentElement.clientHeight;
                this.frameHeight = this.screenHeight - 195;
            },
            addTab:function(menu) {
                var flag = false;
                this.nagTabs.forEach(function(tab, index)  {
                    if(tab.code == menu.code){
                        flag = true;
                    }
                });
                if(!flag){
                    menu.closable = true;
                    this.nagTabs.push(menu);
                }
                this.defaultNagTab = menu.code;
            },
            removeTab(targetName) {
                var tabs = this.nagTabs;
                var activeName = this.defaultNagTab;
                if (activeName === targetName) {
                    tabs.forEach(function(tab, index)  {
                        if (tab.code === targetName) {
                        var nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.code;
                        }
                    }
                });
                }

                this.defaultNagTab = activeName;
                for(var i=0;i<tabs.length;i++){
                    if(tabs[i].code === targetName){
                        break;
                    }
                }
                this.nagTabs.splice(i,1);

            },
            changeLanguage:function(){
                UBIT.setLangType(this.language)
            }
        }
    })


}



