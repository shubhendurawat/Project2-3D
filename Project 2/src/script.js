import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as dat from "dat.gui";

//--------------------------------------------Scene--------------------------------------------
const scene = new THREE.Scene();

//--------------------------------------------Lights-------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
directionalLight.position.z = 2;
scene.add(ambientLight, directionalLight);

//--------------------------------------------Debugging-----------------------------------------
// const gui = new dat.GUI();

//--------------------------------------------OBJLoader-----------------------------------------
const objloader = new OBJLoader();

//--------------------------------------------GLTFLoader----------------------------------------
const gltfloader = new GLTFLoader();

//--------------------------------------------DRACOLoader---------------------------------------
const dracoloader = new DRACOLoader();
dracoloader.setDecoderPath("/draco/");
gltfloader.setDRACOLoader(dracoloader);

//--------------------------------------------FBXLoader-----------------------------------------
const fbxloader = new FBXLoader();

//------------------------------------------Loading Model---------------------------------------
//---------------------------------------1)Loading OBJ Model------------------------------------
// objloader.load("models/suzan.obj", (object) => {
//   console.log(object);
//   object.position.y = 1;
//   object.children[0].position.z = -3;
//   object.children[0].material = new THREE.MeshNormalMaterial();
//   console.log(object);
//   scene.add(object);
// });

//---------------------------------------2)Loading GLTF Model------------------------------------
// gltfloader.load("models/monkeyglb.glb",(glb)=>{
//   scene.add(glb.scene)
//   console.log(glb.scene)
// })

//---------------------------------3)Loading GLTF Model Using DRACOLoader-------------------------
// gltfloader.load("models/2.gltf",(gltf)=>{
//   scene.add(gltf.scene);
//   console.log(gltf.scene);
// })

//---------------------------------------4)Loading animatedCube-----------------------------------
// let animationMixer = null;
// gltfloader.load("models/animatedCube.glb", (glb) => {
//   animationMixer = new THREE.AnimationMixer(glb.scene);
//   const clipAction = animationMixer.clipAction(glb.animations[0]);
//   clipAction.play();
//   scene.add(glb.scene);
//   glb.scene.scale.set(0.5, 0.5, 0.5);
//   console.log(glb);
// });

//---------------------------------------5)Loading FBX Model--------------------------------------
// let animationMixer = null;
// fbxloader.load("models/Taunt.fbx", (fbx) => {
//   animationMixer = new THREE.AnimationMixer(fbx);
//   const clipAction = animationMixer.clipAction(fbx.animations[0]);
//   clipAction.play();
//   fbx.scale.set(0.01, 0.01, 0.01);
//   fbx.position.y = -0.8;
//   scene.add(fbx);
//   console.log(fbx);
// });

//---------------------------------------6)Loading newModel--------------------------------------
let animationMixer = null;
gltfloader.load("models/newModel.glb", (glb) => {
  animationMixer = new THREE.AnimationMixer(glb.scene);
  // const clipAction = animationMixer.clipAction(glb.animations[0]); //first animation
  const clipAction = animationMixer.clipAction(glb.animations[3]); //second animation
  clipAction.play();
  glb.scene.position.y = -0.8;
  scene.add(glb.scene);
  // console.log(glb.scene);
});

//--------------------------------------------Resizing--------------------------------------------
window.addEventListener("resize", () => {
  //Update Size
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;

  //New Aspect Ratio
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();

  //New RendererSize
  renderer.setSize(aspect.width, aspect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//---------------------------------------------Camera---------------------------------------------
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 3;
scene.add(camera);

//--------------------------------------------Renderer--------------------------------------------
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor("#808080",0.5)
renderer.setSize(aspect.width, aspect.height);

//------------------------------------------OrbitControls------------------------------------------
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

//------------------------------------------Clock Class--------------------------------------------
const clock = new THREE.Clock();
let previousTime = 0;

const animate = () => {
  //---------------------------------------GetElapsedTime------------------------------------------
  const elapsedTime = clock.getElapsedTime();
  const frameTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //------------------------------------Update animationMixer--------------------------------------
  if (animationMixer) {
    animationMixer.update(frameTime);
  }

  //---------------------------------------Update Controls-----------------------------------------
  orbitControls.update();

  //-----------------------------------------Renderer----------------------------------------------
  renderer.render(scene, camera);

  //-----------------------------------RequestAnimationFrame---------------------------------------
  window.requestAnimationFrame(animate);
};
animate();
