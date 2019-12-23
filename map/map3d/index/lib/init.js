/**
 * Created by zwt on 2017/7/19 0019.
 */

function containerInit(ME){
    ME.container = document.createElement( 'div' );
    document.body.appendChild( ME.container );
}

function rendererInit(ME){
    ME.renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    ME.renderer.setClearColor( ME.bgColor );
    ME.renderer.setPixelRatio( window.devicePixelRatio );
    ME.renderer.sortObjects = false;
    ME.renderer.setSize( window.innerWidth, window.innerHeight );
    ME.container.appendChild( ME.renderer.domElement );
}

function cameraInit(ME){
    ME.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
    // ME.camera.position.set( 0, -4000, 1000 );
    ME.camera.position.set( 0, -ME.vm.curRealLength*0.20, ME.vm.curRealLength*0.7 );
    // ME.camera.rotation.z += 1.5 * Math.PI;

//        ME.camera.up.x = 0;
//        ME.camera.up.y = 0;
//        ME.camera.up.z = 1;

    // ME.camera.lookAt({
    //     x : 1000,
    //     y : 1000,
    //     z : 0
    // });

    // var helper = new THREE.CameraHelper( ME.camera );
    // ME.scene.add( helper );
}

function clockInit(ME){
    ME.clock = new THREE.Clock();
}

function helperInit(ME){

    var axisHelper = new THREE.AxisHelper( 2000 );
    ME.scene.add( axisHelper );
    //
    // var gridHelper = new THREE.GridHelper( 2000, 20 );
    // ME.scene.add( gridHelper );

    //line
    var material = new THREE.LineDashedMaterial({ color: 0x0205ff ,dashSize: 1000 ,gapSize: 2000});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(10000, 5000, 0));
    // geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    var line = new THREE.Line(geometry, material);
    ME.scene.add(line);

}

function resetCamera(){
    TWEEN.removeAll();

    var p = ME.camera.position;
    var target = {};
    target.position = {
        x:0,
        y:-ME.vm.curRealLength*0.2,
        z:ME.vm.curRealLength*0.7
    };

    ME.orbit.target = new THREE.Vector3(0, 0, 0);
    ME.orbit.enablePan = false;

    // ME.trackball.target = new THREE.Vector3(0, 0, 0);
    // ME.trackball.enablePan = false;

    ME.camera.lookAt(ME.orbit.target);

    var tween = new TWEEN.Tween(ME.camera.position) // Create a new tween that modifies 'coords'.
        .to(target.position, 2000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            // box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
            // console.log(box);
        })
        .start(); // Start the tween immediately.
}

function sceneInit(ME){
    ME.scene = new THREE.Scene();
    ME.scene.fog = new THREE.Fog( ME.bgColor, 1, 10000 );
}

/**
 * 环境光初始化
 */
function ambientLightInit(ME){
    var color = '#f2f2f2';
    ME.ambientLight = new THREE.AmbientLight(color );
//        ME.ambientLight.position.set(100, 100, 200);
    ME.scene.add(ME.ambientLight);

    // var hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
    // ME.scene.add( hemiLight );
}

function spotLightInit(ME){
    ME.spotLight = new THREE.SpotLight(0xf0f0f0);
    ME.spotLight.position.set(0, 0, 300);
    ME.scene.add(ME.spotLight);
}


function directLightInit(ME){
    ME.directLight = new THREE.DirectionalLight(0xffffff, 0.4, 0);
    ME.directLight.position.set( 0, 0, 10000 ).normalize();
    ME.scene.add(ME.directLight);
}


function dataInit(datas, key, vm){
    // console.dir(key);
    if(_.isArray(datas)){
        vm[key].data = datas;
    }else {
        vm[key] = datas;
    }

    if(key=='mapId'){

        if(datas>0){
            planInit(ME, vm);

        }else {
            ME.vm.showTip("您当前的项目还没有创建地图");
            window.location.href = "../../super/index/";
            return;
        }



    }else if(key=='fence'){
        drawFences(vm);

    }else if(key=='anchor'){
        // nodeInit(vm, key);

    }else if(key=='tag' || key=='currentTag'){
        nodeInit(ME, vm, key);
        websocketInit(ME);
        render();
    }
}



function drawFences(vm){
    var fences = vm.fence.data;
    fences.forEach(function(item){
        if(!item || !item.polygonPoints || item.polygonPoints.length<1){
            return;
        }
        var points = item.polygonPoints;
        var shapePoints = [];
        for(var i=0;i<points.length;i++){
            var p = points[i];
            shapePoints.push( new THREE.Vector2( p.x, p.y ) );
        }
        var californiaShape = new THREE.Shape( shapePoints );
        addShape( californiaShape,  item);
    });
}


function addShape( shape, fence) {

    var group = new THREE.Group();

    var extrudeSettings = { amount: ME.fenceHeight, bevelEnabled: true, bevelSegments: 20, steps: 2, bevelSize: 10, bevelThickness: 10 };
    // extruded shape
    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: fence.color, transparent:true, opacity:0.7 } ) );
    group.add( mesh );
    mesh.sourceData = fence;
    ME.fenceShape.data.push(mesh);

    // lines
    shape.autoClose = true;
    var points = shape.createPointsGeometry();

    // solid line
    var lineMaterial =  new THREE.LineBasicMaterial( { color: fence.color, linewidth: 3 } );
    var line = new THREE.Line( points, lineMaterial);
    line.position.set( 0, 0,  0);
    // line.rotation.set( rx, ry, rz );
    // line.scale.set( s, s, s );
    group.add( line );

    var line = new THREE.Line( points, lineMaterial);
    line.position.set( 0, 0,  ME.fenceHeight);
    group.add( line );

    //erect line
    for(var i=0;i<points.vertices.length;i++){
        var v = points.vertices[i];

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        geometry.vertices.push(new THREE.Vector3(v.x, v.y, ME.fenceHeight));

        var erectLine = new THREE.Line(geometry, lineMaterial);
        group.add( erectLine );
    }

    ME.scene.add( group );
}



function planInit(ME, vm){
    var realLength = vm.curRealLength = vm.currentMap.realLength;
    cameraInit(ME);
    if(vm.showMode!='admin'){
        OrbitInit(ME);
    }


    var imgUrl = ME.imgHost + 'maps_'+ vm.currentMap.filePath;
    // var imgUrl = "../common/img/"+ vm.currentMap.filePath;

    var loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(
        // resource URL
        imgUrl,
        // Function when resource is loaded
        function ( texture ) {
            // texture.minFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearFilter;

            // console.log(texture.image);
            // do something with the texture
            var material = new THREE.MeshLambertMaterial( {
                map: texture, side: THREE.DoubleSide, depthTest: false, shading: THREE.SmoothShading
            } );

            //按比例换算 plan 的宽度，高度
            ME.planeWidth = realLength;
            ME.planeHeight = Math.round((texture.image.height/texture.image.width) * realLength);

            // var geometry = new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height);
            var geometry = new THREE.PlaneGeometry( ME.planeWidth, ME.planeHeight);

            ME.plane = new THREE.Mesh( geometry, material );
            ME.plane.position.set(0, 0, 0 );

            // ME.plane.rotation.x += -0.5 * Math.PI;
            // ME.camera.rotation.z+=0.0005*Math.PI;

            ME.scene.add( ME.plane );

            //test
            tipPlan(ME.planeWidth, ME.planeHeight);

            if(ME.anony) return;

            //加载地图上的标签
            DataManager.loadNodes(vm.mapId, vm, dataInit);

            //加载地图上的fence
            DataManager.loadFences(vm.mapId, vm, dataInit, function(position){
                convertPosition(position);
                return {x:position.screenX,y:position.screenY};
            });
        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );
}

function tipPlan(planW, planH){
    var color = "#1965cc";
    var geometry = new THREE.BoxGeometry( 50, 50, 50);
    var material = new THREE.MeshBasicMaterial( {color: color} );

    var w = planW/2, h = planH/2;

    var cylinder1 = new THREE.Mesh( geometry, material );
    cylinder1.position.set(w,h,0);
    ME.scene.add( cylinder1 );

    var cylinder2 = new THREE.Mesh( geometry, material );
    cylinder2.position.set(w,-h,0);
    ME.scene.add( cylinder2 );

    var cylinder3 = new THREE.Mesh( geometry, material );
    cylinder3.position.set(-w,h,0);
    ME.scene.add( cylinder3 );

    var cylinder4 = new THREE.Mesh( geometry, material );
    cylinder4.position.set(-w,-h,0);
    ME.scene.add( cylinder4 );
}


function nodeInit(ME, vm, key){
    if(key=='currentTag'){
        tagInit(ME, vm[key]);
    }else {
        vm[key].data.map(function(data, index) {
            if(data.mapId==ME.vm.mapId){
                tagInit(ME, data);
            }
        });
        tagGridInit();
    }
}


function OrbitInit(ME){
    //支持缩放
    ME.orbit = new THREE.OrbitControls( ME.camera, ME.renderer.domElement );
}

function eventInit(ME){
    window.addEventListener( 'resize', onWindowResize, false );
}

function drawLine(startPoint, endPoint){
    //line
    var material = new THREE.LineBasicMaterial({ color: 0x0205ff});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z));
    geometry.vertices.push(new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z));
    var line = new THREE.Line(geometry, material);
    //trackLen
    ME.scene.add(line);
}