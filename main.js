
var scene,camera,renderer,mesh,controls,clock,mixer;
var meshFloor;
var keyboard={};//stores keyboard actions as keycodes ,note that this is a Map ;)
var player={height:1.0,speed:0.2,turnSpeed:Math.PI*0.02,canShoot:0};//stores details about player height & move speed
var crate,crateTexture,crateNormalMap,crateBumpMap;
var loadingScreen={
  scene:new THREE.Scene(),
  camera:new THREE.PerspectiveCamera(90,1280/720,0.1,1000),
  box:new THREE.Mesh(
    new THREE.BoxGeometry(0.5,0.5,0.5),
    new THREE.MeshBasicMaterial({color:0x4444ff})
  )

};

var loadingManager=null;//must be initialized in all loaders as callback
var RESOURCES_LOADED=false;//to track when resources are loaded

//gltf objects i.e gun
var objects=[];
var bullets=[];

function init(){
  scene= new THREE.Scene();
  camera= new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);
  clock= new THREE.Clock();
  loadingScreen.box.position.set(0,0,5);
  loadingScreen.camera.lookAt(loadingScreen.box.position);
  loadingScreen.scene.add(loadingScreen.box);
  loadingManager=new THREE.LoadingManager();

  loadingManager.onProgress=function(item,loaded,total){
    console.log(item,loaded,total);
  };

loadingManager.onLoad=function(){
  console.log("loaded all resources");
  RESOURCES_LOADED=true;
  onResourcesLoaded();
};



meshFloor=new THREE.Mesh(
new THREE.PlaneGeometry(1000,1000,10,10),//the last two numbers = NO. of segments, the more segments more detail
  new THREE.MeshPhongMaterial({color:0xFFFFFF,wireframe:false})
);
meshFloor.rotation.x-=Math.PI/2;//rotating floor to be flat
meshFloor.recieveShadow=true;
scene.add(meshFloor);
//

var ambielight= new THREE.AmbientLight(0xffffff,0.8);
ambielight.position.y+=2;
ambielight.castShadow=true;
scene.add(ambielight);

var light=new THREE.PointLight(0x1b03a3,1.5,18);
light.position.set(0,5,0);
light.castShadow=true;
light.shadow.camera.near=0.1;
light.shadow.camera.far=25;

var light2= new THREE.PointLight(0xFF5F1F,1.5,18);
light2.position.set(1,2,9);
light2.castShadow=true;
light2.shadow.camera.near=0.1;
light2.shadow.camera.far=25;
scene.add(light2);

//shadow maximum draw distance
scene.add(light);
//scene.add( new THREE.CameraHelper( light.shadow.camera ) );//debug shadow ,will show shadows within frustrum

//skybox
var geometrys=new THREE.BoxGeometry(1000,1000,1000);
var Cubemat=[
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_ft.png'),side:THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_bk.png'),side:THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_up.png'),side:THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_dn.png'),side:THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_rt.png'),side:THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('./resources/hot_lf.png'),side:THREE.DoubleSide}),
];
var CubeM=new THREE.MeshFaceMaterial(Cubemat);
var Cubes=new THREE.Mesh(geometrys,CubeM);
scene.add(Cubes);


//house
/*var loader = new THREE.GLTFLoader(loadingManager);
loader.load('./resources/untitled.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(0,0,0);
});*/

//street_Buildings
var loader1 = new THREE.GLTFLoader(loadingManager);
loader1.load('./resources/streetBuilding.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(150,-1.5,0);
});

var GasTanks = new THREE.GLTFLoader(loadingManager);
GasTanks.load('./models/GasTank.glb',function(gltf){
  //gltf.scale.scale.set(0.08, 0.08, 0.08)
  scene.add(gltf.scene)
  gltf.scene.position.set(3,0.5,1);
  gltf.scene.scale.set(0.08, 0.08, 0.08);
});

var Road = new THREE.GLTFLoader(loadingManager);
Road.load('./models/road.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(30, 0.8,-35);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  gltf.scene.scale.set(1, 0.1, 1);
});
var Road2 = new THREE.GLTFLoader(loadingManager);
Road2.load('./models/road.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(30, 0.8,-5);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  gltf.scene.scale.set(1, 0.1, 1);
});
var Road1 = new THREE.GLTFLoader(loadingManager);
Road1.load('./models/road.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(30, 0.6,22);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  gltf.scene.scale.set(1, 0.1, 1);
});

var burbs = new THREE.GLTFLoader(loadingManager);
burbs.load('./models/burbs2.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(0, 0.4,0);
  gltf.scene.rotation.set(Math.PI, Math.PI, 0);
  gltf.scene.scale.set(1, 1, 1);
});

var burbs1 = new THREE.GLTFLoader(loadingManager);
burbs1.load('./models/burbs2.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(-60, 0.4,0);
  gltf.scene.rotation.set(Math.PI, Math.PI, 0);
  gltf.scene.scale.set(1, 1, 1);
});

var ground = new THREE.GLTFLoader(loadingManager);
ground.load('./models/ground.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(-58,0,0);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  gltf.scene.scale.set(5, 0.1, 5);
});

var ground1 = new THREE.GLTFLoader(loadingManager);
ground1.load('./models/ground.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(0.8,0,0);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  gltf.scene.scale.set(5, 0.1, 5);
});

/*var grass = new THREE.GLTFLoader(loadingManager);
grass.load('./models/grass.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(-6, 0.6,79);
  gltf.scene.rotation.set(0, Math.PI/2, 0);
  //gltf.scene.scale.set(1, 0.2, 1);
});*/

/*function myWalls(sx, sz, sy, px, pz, py, rx, rz, ry){

  var Walls = new THREE.GLTFLoader(loadingManager);
  Walls.load('./models/Wall.glb',function(gltf){
    scene.add(gltf.scene)
    gltf.scene.position.set(px,pz,py);
    gltf.scene.rotation.set(rx, rz, ry);
    gltf.scene.scale.set(sx, sz, sy);
  });
};*/

/*var mansion = new THREE.GLTFLoader(loadingManager);
mansion.load('./models/mansion.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(0,0,16);
 
});*/

var mansion1 = new THREE.GLTFLoader(loadingManager);
mansion1.load('./models/mansion1.glb',function(gltf){
  scene.add(gltf.scene)
  gltf.scene.position.set(0,0,32);
  });

//player weapon
var playerWeapon=new THREE.GLTFLoader();
playerWeapon.load('./models/colt_m1911/scene.gltf',function(gltf){
  objects[0]=gltf.scene;
  objects[0].scale.set(0.05,0.05,0.05);
  objects[0].position.set(camera.position.x-Math.sin(camera.rotation.y),camera.position.y,camera.position.z-Math.cos(camera.rotation.y));
  scene.add(objects[0]);

  mixer=new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
  scene.add(gltf.scene);

});

//Bullets
/*var gunBullets=new THREE.GLTFLoader();
gunBullets.load('./models/rusty_copper_bullet/scene.gltf',function(bullet){
  objects[1]=bullet.scene;
  objects[1].scale.set(0.02,0.02,0.02);
  //objects[1].position.set(objects[0].position.x-Math.sin(objects[0].rotation.y),objects[0].position.y,objects[0].position.z-Math.cos(objects[0].rotation.y))
//objects[1].rotation.y+=40;
  objects[1].rotation.y-=camera.rotation.y+95;
  //objects[1].rotation.z+=40;

})*/

//keeping player on plane and not over/under
camera.position.set(0,player.height,-5);
camera.lookAt(new THREE.Vector3(0,player.height,0));


renderer = new THREE.WebGLRenderer();
renderer.setSize(1280,720);
renderer.shadowMap.enabled=true;//enabling shadows
renderer.shadowMap.type=THREE.BasicShadowMap;
//controls = new THREE.OrbitControls( camera,renderer.domElement );
document.body.appendChild(renderer.domElement);
animate();

}
//triggered when all resources loaded
function onResourcesLoaded(){
}

function animate(){

  if(RESOURCES_LOADED==false){//loading screen
    requestAnimationFrame(animate);
    loadingScreen.box.position.x-=0.05;
    if(loadingScreen.box.position.x<-10) loadingScreen.box.position.x=10;
    loadingScreen.box.position.y=Math.sin(loadingScreen.box.position.x);

    renderer.render(loadingScreen.scene,loadingScreen.camera);
    return;
  }
  requestAnimationFrame(animate);
  var time =Date.now()*0.005;
  var delta=clock.getDelta();
  renderer.render(scene,camera);


//attaching weapon to camera
objects[0].position.set(camera.position.x-Math.sin(camera.rotation.y+Math.PI/8)*0.5,camera.position.y-0.5+Math.sin(time+camera.position.x+camera.position.z)*0.01,camera.position.z+Math.cos(camera.rotation.y+Math.PI/10)*0.5);
objects[0].rotation.set(camera.rotation.x,camera.rotation.y+45.7,camera.rotation.z);

//loop to update out bullets everyframe
for(var i=0;i<bullets.length;i+=1){
  if(bullets[i]===undefined)continue;
  if(bullets[i].alive== false){
    bullets.splice(i,1);
    continue;

  }
    bullets[i].position.add(bullets[i].velocity);//add velocity to bullets position(integration)
}

//adding WASD movementwd
if(keyboard[87]){//W key
  camera.position.x-=Math.sin(camera.rotation.y)*player.speed;
  camera.position.z-=-Math.cos(camera.rotation.y)*player.speed;
}

if(keyboard[83]){//S key
  camera.position.x+=Math.sin(camera.rotation.y)*player.speed;
  camera.position.z+=-Math.cos(camera.rotation.y)*player.speed;
}

if(keyboard[65]){//A key
  camera.position.x+=Math.sin(camera.rotation.y+Math.PI/2)*player.speed;
  camera.position.z+=-Math.cos(camera.rotation.y+Math.PI/2)*player.speed;
}

if(keyboard[68]){//D key
  camera.position.x+=Math.sin(camera.rotation.y-Math.PI/2)*player.speed;
  camera.position.z+=-Math.cos(camera.rotation.y-Math.PI/2)*player.speed;
}



  if(keyboard[37]){//left arrowkey pressed
    camera.rotation.y-=player.turnSpeed;
  }

  if(keyboard[39]){//left arrowkey pressed
      camera.rotation.y+=player.turnSpeed;//rotate about the vertical y-axis when clicked
    }
    if(keyboard[16]&& player.canShoot<=0){//shift is pressed
      var bullet=new THREE.Mesh(
        new THREE.SphereGeometry(0.05,8,8),
        new THREE.MeshBasicMaterial({color:0xB7410E})
      );



      bullet.position.set(
        objects[0].position.x,
        objects[0].position.y-0.055,
        objects[0].position.z
      );

      bullet.velocity=new THREE.Vector3(-Math.sin(camera.rotation.y),0,Math.cos(camera.rotation.y));
      bullet.alive=true;
      setTimeout(function(s){
        bullet.alive=false;
        scene.remove(bullet);
      },1000);
      bullets.push(bullet);
      scene.add(bullet);
      player.canShoot=7;//means 10 frames between shots 1bullet per 10
      //mixer.update(delta);
    }
if(player.canShoot>0)player.canShoot-=1;


}

function keyDown(event){
  keyboard[event.keyCode]=true;
}

function keyUp(event){
  keyboard[event.keyCode]=false;
}

window.addEventListener('keydown',keyDown);
window.addEventListener('keyup',keyUp);

window.onload=init;
