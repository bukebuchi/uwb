/**
 * Created by zwt on 2017/7/31 0031.
 */



function websocketInit(ME){
    //检查浏览器是否支持WebSocket
    if(!window.WebSocket){
        alert("您的浏览器不支持WebSocket，建议使用最新的谷歌浏览器！");
        return;
    }

    if(ME.socketRequest &&  !ME.socketRequest.closed) {
        return;
    }

    if(ME.socketRequest){
        ME.socketRequest.close();
    }

    //创建随机值
    var stamp = new Date().getTime();

    ME.socketRequest = new WebSocket(ME.websocketUrl+"/"+ME.user.projectCode+"_"+ME.vm.mapId+"_3d"+stamp+ME.api_token);

    ME.socketRequest.onopen = function(event) {
        if(ME.socketRequest){
            ME.socketRequest.open && ME.socketRequest.open(event, this);
            ME.socketRequest.closed = false;
            // setInterval(function (){
            //     socketRequest.send('are you ok?');
            //     console.log(socketRequest.readyState);
            // }, 3000);
        }
    }

    ME.socketRequest.onmessage = function(event) {
        try{
            if(!ME.socketStatus) return;

            if(DataManager.maxFlowfilter(event.data)) return;

            var data = JSON.parse(event.data);
            // console.log(data);

            data.id= (data.id?data.id:data.mac);
            if(!data.id) return;

            var tag = getTagMarker(data.id);
            if(!tag){
                if(DataManager.maxAddFlowfilter(event.data)) return;

                // console.log('add a tag marker');
                var sourceTag = getSourceTag(data);
                tag = addTagMarker(sourceTag, moveMarker);
            }else {
                moveMarker(tag, data);
            }

        }catch(e){
            console.warn(e)
        }
    }

    ME.socketRequest.onerror = function(event) {
        console.log(event);
        //错误重连
        ME.socketRequest.error && ME.socketRequest.error(event, this);
        ME.socketRequest.connect();
    };
    ME.socketRequest.onclose = function(event) {
        console.log(event);
        //关闭重连
        try{
            ME.socketRequest.close && ME.socketRequest.close(event, this);
            ME.socketRequest.connect();
        }catch(e){
            if(!ME.socketRequest){
                ME.socketRequest = {};
            }
            ME.socketRequest.closed = true;
            console.warn(e);
        }
    };

}

