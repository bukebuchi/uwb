function eventInit() {
    // 监听事件
    document.addEventListener('change', function (e) {
        var upload = document.getElementById("upload");
        if (e.target !== upload) return;
        var file = upload.files[0];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            ME.vm.showTip(lang['showTipNote23']);
            return;
        }
        // 上传请求
        var formData = new FormData();
        formData.append('document_file', file); //(name,value)
        Vue.http.post(ME.host + "/map/fileUpload", formData).then(util.jsonFunc).then(function (file) {
            upload.dataset.imgFile = file.fileName;
        });
    }, false);
    //esc 事件初始化
    $(document).keyup(function (a) {
        if (27 === a.keyCode) {
            console.log('esc');
            ubiMap.escDrawFence();
            ubiMap.escDrawCamera();
            //取消测量距离
            ubiMap.clearGetDistance();
        }
    });

    //回车触发确定事件
    $(document).keyup(function (e) {
        if (13 === e.keyCode) {
            $('.ppp').click();
        }
    });
}