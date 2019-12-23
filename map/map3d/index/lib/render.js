/**
 * Created by zwt on 2017/7/19 0019.
 */


/**
 * 渲染，实现动画
 */
function render(){
    //TODO
    animateDo();

    ME.renderer.render( ME.scene, ME.camera );
    if(ME.css3Renderer)ME.css3Renderer.render( ME.scene, ME.camera );

    requestAnimationFrame( animate );
    TWEEN.update();
    ME.orbit.update();
    if( ME.trackball)  ME.trackball.update();
}

function animate(){
    if(ME.renderStop){
        return;
    }
    render();
}


function animateDo(){
    var delta = ME.clock.getDelta();

    // var timer = Date.now() * 0.0001;
    // ME.camera.position.x = Math.cos( timer ) * 100;
    // ME.camera.position.y = Math.sin( timer ) * 100;
    // ME.camera.rotation.z+=0.0005*Math.PI;

    // tagPlay(delta);
}

function tagPlay(delta){
    for(var i=0;i<ME.tagMarker.data.length;i++){
        var group = ME.tagMarker.data[i];
        if(group.actionStatus != 'play'){
            return;
        }
        for(var j=0;j<group.children.length;j++){
            var tag = group.children[j];
            if (tag.mixer) {
                tag.mixer.update( delta );
            }
        }
    }
}



