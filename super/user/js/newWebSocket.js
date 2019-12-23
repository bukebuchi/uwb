function newWebSocket() {
    if (!window.WebSocket) {
        alert("您的浏览器不支持WebSocket，建议使用最新的谷歌浏览器！");
        return;
    }
    var stamp = new Date().getTime();
    var tagMac = "67020000";
    var uri = new URI("ws://track.ubitraq.com:8083/websocket/tag_" + tagMac+"_2d" + stamp);
}