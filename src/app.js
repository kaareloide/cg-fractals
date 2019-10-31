import * as THREE from 'three';

var camera, currentScene, renderer;

init();
animate();

function init() {
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
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

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
	var geometry = new THREE.BoxGeometry(6, 6, 6);
	var material = new THREE.MeshNormalMaterial();
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