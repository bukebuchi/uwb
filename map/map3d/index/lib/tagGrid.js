/**
 * Created by zwt on 2017/7/28 0028.
 */

ME.tagTargets = { objects:[], table: [], sphere: [], helix: []};

function tagGridInit(){

    var tags = ME.vm.tag.data;

    for ( var i = 0; i < tags.length; i++ ) {
        var tag = tags[i];
        // if(tag.mapId!=ME.vm.mapId) continue;

        var object = tagGridPanel(tag, i);

        ME.scene.add( object );
        ME.tagTargets.objects.push( object );
    }

    tagGridTableInit();

    tagGridSphereInit();

    // helix
    tagGridHelixInit();

    css3RendererInit();

}

function css3ContainerToggle(isShow){
    var child = ME.css3Container.children[0].children[0];
    child.style.display = (isShow?'block':'none');
}


function css3RendererInit(){

    ME.css3Renderer = new THREE.CSS3DRenderer();
    ME.css3Renderer.setSize( window.innerWidth, window.innerHeight );
    ME.css3Renderer.domElement.style.position = 'fixed';
    ME.css3Renderer.domElement.style.top = 0;

    ME.css3Container = document.createElement( 'div' );
    document.body.appendChild( ME.css3Container );
    ME.css3Container.appendChild( ME.css3Renderer.domElement );

    // ME.css3Container.style.display = 'none';

    // ME.trackball = new THREE.OrbitControls( ME.camera, ME.css3Renderer.domElement );
    ME.orbit = new THREE.OrbitControls( ME.camera, ME.css3Renderer.domElement );

    css3ContainerToggle(false);
}



function tagGridPanel(tag,i){

    var element = document.createElement( 'div' );
    element.className = 'tagGridElement';
    element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

    var number = document.createElement( 'div' );
    number.className = 'number';
    number.textContent = i;
    element.appendChild( number );

    var symbol = document.createElement( 'div' );
    symbol.className = 'symbol';
    symbol.textContent = tag.alias;
    element.appendChild( symbol );

    var details = document.createElement( 'div' );
    details.className = 'details';
    details.innerHTML = tag.code + '<br> 电量：' + tag.power+'%';
    element.appendChild( details );

    var operate = document.createElement( 'div' );
    operate.className = 'operate';
    var btn = '';
    btn += '<button>跟踪</button>';
    btn += '<button>隐藏</button>';
    operate.innerHTML = btn;
    element.appendChild( operate );

    var object = new THREE.CSS3DObject( element );
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;

    return object;
}


function tagGridTableInit(){
    //table
    var rowNum = 8;
    var col = 0, row=0;
    for ( var i = 0, l = ME.tagTargets.objects.length; i < l; i ++ ) {
        var object = new THREE.Object3D();
        //每8个换行
        if(i%8==0){
            col = 0;
            row++;
        }
        object.position.x = ( col * 140 )- ME.planeWidth/20 ;//
        object.position.y = -( row * 180 )+ ME.planeHeight/20 ;//+ 990
        col++;

        object.position.z = 1000;

        ME.tagTargets.table.push(object);
    }
}


function tagGridSphereInit(){
    // sphere
    var vector = new THREE.Vector3();
    var spherical = new THREE.Spherical();

    for ( var i = 0, l = ME.tagTargets.objects.length; i < l; i ++ ) {

        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var object = new THREE.Object3D();

        spherical.set( 800, phi, theta );

        object.position.setFromSpherical( spherical );

        vector.copy( object.position ).multiplyScalar( 2 );

        object.lookAt( vector );

        ME.tagTargets.sphere.push( object );
    }
}


function tagGridHelixInit(){
    var vector = new THREE.Vector3();
    var cylindrical = new THREE.Cylindrical();

    for ( var i = 0, l =  ME.tagTargets.objects.length; i < l; i ++ ) {

        var theta = i * 0.175 + Math.PI;
        var y = - ( i * 8 ) + 450;

        var object = new THREE.Object3D();

        cylindrical.set( 900, theta, y );

        object.position.setFromCylindrical( cylindrical );

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt( vector );

        ME.tagTargets.helix.push( object );
    }
}


function tagPanelShowStyle(style){
    transform( ME.tagTargets[style], 2000 );
}


function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( var i = 0; i < ME.tagTargets.objects.length; i ++ ) {

        var object = ME.tagTargets.objects[ i ];

        var target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .start();

}

