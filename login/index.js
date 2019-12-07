/***
 * modified by zwt 2017.05.26
 * 用户登录
 */


/**
 * 全局变量
 */
var ME = {
	//访问路径
	baseUrl : '/',
	//请求的服务器地址  
	host: UBIT.host,
	href:window.location.href,
    vm:null
};

/**
 * 程序入口
 */
// UBIT.init = function init(){
//     pageInit();
//     loadData();
// }

;(function() {
    pageInit();
    loadData();
})();

//界面初始化
function pageInit(){
	initVue('#wrapper');
}

//加载数据
function loadData(){
	setTimeout(function(){	ME.vm.isLoging = false;},100);
}


function jsonFunc(res) {
    return res.json();
}


function initVueData(){
	var data = {
            tip:{color:'green',msg:'',show:false},
            href:window.location.href,
        	isLoging:true,
            login:{
                loginData:[],
                checkStatus:false,
                edit:{
                	loginCode:"",	//支持员工编码，邮箱，电话，三种方式进行登录  projAdmin
                    loginPwd:"",
                },
                validate:{
                	code:"*格式正确",
                	pwd:"*格式正确",
                }
            }
        };
	return data;
}


//初始化Vue
function initVue(divId){
	Vue.http.options.emulateJSON = true;
    Vue.http.options.root = ME.host;
    
	ME.vm = new Vue({
		el: divId,
		
		data : initVueData(),
		
		created:function(){
            if(!window.localStorage){
                this.showTip(false,"您的浏览器存在兼容问题，建议使用谷歌浏览器");
            	return;
            }
            if(localStorage.getItem('checkStatus')){
				this.login.edit.loginCode = localStorage.getItem('loginCode');
				this.login.edit.loginPwd = localStorage.getItem('loginPwd');
				this.login.checkStatus = true;
            }
		},
		
		methods:{
			//清空
	        emptyObj: function(obj) {
	            for(var i in obj) {
	                if(obj.hasOwnProperty(i)) {
	                    if(typeof obj[i] === 'object') {
	                    	this.emptyObj(obj[i]);
	                    } else {
	                        obj[i] = "";
	                    }
	                }
	            }
	        },
	        
	        //提示
	        showTip:function(isOk,msg){
	        	if(msg){
	        		this.tip.color='red';
	        		if(isOk){
	        			this.tip.color='green';
	        		}
	        		this.tip.msg=msg;
	        		this.tip.show='';
	        	}else {
	        		this.tip.msg='';
	        		this.tip.show='hidden';
	        	}
	        	return isOk;
	        },
	        
	      //提交验证
	        submitVali: function(btn, flag) {
                this.showTip(true,"");

                var edit = this[btn].edit;
                if(!edit.loginCode){
                    this.showTip(false,"请输入账户名");
                    return false;
				}
                if(!edit.loginPwd){
                    this.showTip(false,"请输入密码");
                    return false;
                }

	            flag = flag || true;
	            var validate = this[btn].validate;
	            
	            for (var key in validate) {
	            	if(key=='code' &&　validate[key]!=="*格式正确"){
	                    this.showTip(false,"账号格式不正确");
	                    flag=false;
	                    break;
	            	}else if(key=='pwd' &&　validate[key]!=="*格式正确"){
	                    this.showTip(false,"密码格式不正确");
	                    flag=false;
	                    break;
	            	}
	            }
	            return flag;
	        },
	        
	        //登录
	        loginIn: function(){
	        	 
	            vm = this;
	            var flag=this.submitVali('login');
	            if(!flag){
	                return;
	            }
	            var data=this.login.edit;

                //记住用户名密码
                if(vm.login.checkStatus){
                    localStorage.setItem('loginCode', data.loginCode);
                    localStorage.setItem('loginPwd', data.loginPwd);
                    localStorage.setItem('checkStatus', true);

                }else{
                    localStorage.removeItem('loginCode');
                    localStorage.removeItem('loginPwd');
                    localStorage.removeItem('checkStatus');
                }


                this.isLoging = true;
	            Vue.http.post(ME.host+'/user/login',data)
	            .then(jsonFunc)
	            .then(function(json){
                    ME.vm.isLoging = false;
	                if(!json.isOk) {
	                	ME.vm.showTip(false,json.msg);
	                	return ;
	                }
	                
	                var userData = json.entity;

					localStorage.setItem('api_token',userData.api_token);
					localStorage.setItem('userData',JSON.stringify(userData));
					vm.validityKey(userData.api_token);
                    // //跳转
                    // vm.redictUrl();
	            });
	        },
	        //验证systemKey
            validityKey: function (api_token) {
                Vue.http.post(ME.host+'/user/validitykey',{api_token:api_token})
                    .then(jsonFunc)
                    .then(function(json){
                        if(!json.isOk) {
                            window.location.href = "../syskey/"
                            return ;
                        }
                        //跳转
                        vm.redictUrl();
                    });
            },
	        //跳转
	        redictUrl:function(){
	        	
	        	UBIT.redictAdmin();
	        },
	        
	         //验证账号密码
	        validate: function(type,data,res){
	        	var reg = null;
	            switch(data){
	                case 'loginCode':
//	                    var reg=/^1[34578]\d{9}$/;
	                    break;
	                case 'loginPwd':
//	                    var reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;// 
	                    break;
	            }
	            this.format(type,data,res,reg);
	        },
	        
	        //验证账号密码
	        format: function(type,data,res,reg){
	        	if(this[type].edit[data]==""){
                    return this[type].validate[res]="*不能为空";
	        	}
	        	if(reg){
	        		if(reg.test(this[type].edit[data])){
	        			return this[type].validate[res]="*格式正确";
		            }else{
		            	return this[type].validate[res]="*格式不正确";
		            }
	        	}
	        	return this[type].validate[res]="*格式正确";
	        },
	        
		}
	});
}


