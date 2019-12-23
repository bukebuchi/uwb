/**
 * Created by zwt on 2017/7/19 0019.
 */



/**
 * 程序入口
 */
;(function(window){
    if ( ! Detector.webgl ) return Detector.addGetWebGLMessage();
    init();
})();



function init(){
    loadFont();
    containerInit(ME);
    rendererInit(ME);
    sceneInit(ME);
    ambientLightInit(ME);
    // spotLightInit(ME);
    clockInit(ME);
    directLightInit(ME);
    // helperInit(ME);
    eventInit(ME);
    loadTagTemplate(ME,vueInit);
}




function onWindowResize(){
    ME.camera.aspect = window.innerWidth / window.innerHeight;
    ME.camera.updateProjectionMatrix();
    ME.renderer.setSize( window.innerWidth, window.innerHeight );
    if(ME.css3Renderer) ME.css3Renderer.setSize( window.innerWidth, window.innerHeight );
}

