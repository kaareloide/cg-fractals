import * as THREE from 'three';
import $ from "jquery";
import VertexShaderBasic from './shaders/vertexShaderBasic.glsl';
import FragShaderBasic from './shaders/fragShaderBasic.glsl';

var camera, currentScene, renderer, vertexShader, fragShader;
var textures = [];

init();

function init() {
    var loader = new THREE.TextureLoader();
    loader.load("src/pal.png", onTextureLoaded);
    
	document.addEventListener("keypress", changeScene);

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 10;

	currentScene = createScene1();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}

function animate() {

	requestAnimationFrame( animate );
	var mesh = currentScene.getObjectByName("mesh");
	//mesh.rotation.x += 0.01;
	//mesh.rotation.y += 0.02;

	renderer.render( currentScene, camera );

}

// change scene with number keys 1,2,3
function changeScene(e) {
	switch (e.code) {
		case "Digit1":
			currentScene = createScene1();
			break;
		case "Digit2":
			currentScene = createScene2();
			break;
		case "Digit3":
			currentScene = createScene3();
			break;
	}
	console.log(e.code);

}

function createScene1() {
	var scene = new THREE.Scene();
    var geometry = new THREE.PlaneBufferGeometry(12, 12, 1);
    var uvCoord = new Float32Array([
		0,0,
		2,0,
		0,2,
		2,2
    ]);
    geometry.addAttribute("uvCoord", new THREE.BufferAttribute(uvCoord, 2));
	var material = createShaderMaterial(textures[0], VertexShaderBasic, FragShaderBasic);
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = "mesh";
	scene.add( mesh );
	return scene; 
}

function createScene2() {
	var scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry(5, 32, 32);
	var material = new THREE.MeshNormalMaterial();
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = "mesh";
	scene.add( mesh );
	return scene; 
}

function createScene3() {
	var scene = new THREE.Scene();
	var geometry = new THREE.TorusGeometry(3, 1, 16, 100);
	var material = new THREE.MeshNormalMaterial();
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = "mesh";
	scene.add( mesh );
	return scene; 
}

function onTextureLoaded(texture) {
    texture.magFilter = THREE.NearestFilter;
    texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(2,2);
    textures.push(texture);
    animate();
}
			

function createShaderMaterial(texture, vertexShader, fragShader) {
    return new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                type: 't',
                value: texture
            },
            scale:{
                type: 'float',
                value: 1
            },
            center:{
                type: 'v2',
                value: new THREE.Vector2(1.5, 0.5)
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragShader
    });
}