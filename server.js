//初始化一个node项目：node init，一路确认就可以,文件夹会自动创建一个package.json文件
// 下载ws文件    npm i -save ws

//获得WebSocketServerr类型
var WebSocketServer = require('ws').Server;
//创建WebSocketServer对象实例，监听指定端口
var wss = new WebSocketServer({ port:32501 });
wss.binaryType = "arraybuffer";
//创建保存所有已连接到服务器的客户端对象的数组
var clients=[];

wss.on('connection', function(ws) {
      console.log("一个客户端连接到服务器")
  // 将该连接加入连接池
  clients.push(ws);
 wss.binaryType = "arraybuffer";


      

      dv.set(0,1,true);   //在ArrayBuffer数组的pos下标处开始设置一个32位二进制，把1转化成二进制

  console.log("有"+clients.length+"客户端在线")
  ws.on('message', function(message) {
    // 广播消息
    console.log(message);
    if(typeof(message)=="string")            //服务器传过来的可能是字符串，判断是不是
        {
            console.log('收到string消息'+message)
                  clients.forEach(function(ws1){
                  if(ws1 !== ws) {
                        

            var typedArray = new Uint8Array(message.match(/[\da-f]{2}/gi).map(function (h) 
            {
              return parseInt(h, 16)
            }))
            console.log(typedArray);
            var buffer = typedArray.buffer;
                  ws1.send(message);
                  }
                  })
        }
        else
      {
                  console.log('收到erjin消息'+message)

                  clients.forEach(function(ws1){
                  if(ws1 !== ws) {
                        console.log("test");
                  ws1.send(message);
                  }
                  })
      }
     
   
  });
 
  ws.on('close', function(message) {
    // 连接关闭时，将其移出连接池
    clients = clients.filter(function(ws1){
      return ws1 !== ws
    })
  });
});
// //为服务器添加connection事件监听，当有客户端连接到服务端时，立刻将客户端对象保存进数组中
// wss.on('connection', function (client) {
//       console.log("一个客户端连接到服务器")
//       if(clients.indexOf(client)===-1){//如果是首次连接
//             clients.push(client) //就将当前连接保存到数组备用
//             console.log("有"+clients.length+"客户端在线")
//        //为每个client对象绑定message事件，当某个客户端发来消息时，自动触发
//        client.on('message',function(msg){
//              console.log('收到消息'+msg)
//             //遍历clients数组中每个其他客户端对象，并发送消息给其他客户端
//             for(var c of clients){
//                   if(c!=client){//把消息发给别人
//                         c.send(msg);
//                   }
//             }
//        })

//  }
// })