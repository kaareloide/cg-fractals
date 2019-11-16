import * as THREE from 'three';
import $ from "jquery";
import './styles/app.css';
import VertexShaderBasic from './shaders/vertexShaderBasic.glsl';
import FragShaderBasic from './shaders/fragShaderBasic.glsl';
import JuliaFragShader from './shaders/juliaFragShader.glsl';
import JuliaVertexShader from './shaders/juliaVertexShader.glsl';
import BuddhaFragShader from './shaders/buddhaFragShader.glsl';
import BuddhaVertexShader from './shaders/buddhaVertexShader.glsl';

var camera, currentScene, renderer, vertexShader, fragShader;
var textures = [];
var scale = 5.0;

init();

function init() {
    var loader = new THREE.TextureLoader();
    loader.load("src/pal.png", onTextureLoaded);
    
	document.addEventListener("keypress", changeScene);

	// firefox
    document.addEventListener( 'DOMMouseScroll', onMouseWheel, false );
    // chrome
    document.addEventListener("mousewheel", onMouseWheel, false);

	camera = new THREE.OrthographicCamera( window.innerHeight / - 2,  window.innerHeight / 2,  window.innerHeight / 2, window.innerHeight / - 2, 0.01, 1000 );
	//camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 10;

	currentScene = createScene1();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerHeight, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function animate() {

	requestAnimationFrame( animate );
	var mesh = currentScene.getObjectByName("mesh");
	renderer.render( currentScene, camera );

}

function onMouseWheel(e) {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    scale =  delta > 0 ? scale / 1.25 : scale / 0.75;
    currentScene.children[0].material.uniforms.scale.value = scale;
    return false;
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
    var geometry = new THREE.PlaneBufferGeometry(window.innerHeight, window.innerHeight, 1);
    var uvCoord = new Float32Array([
		0,0,
		1,0,
		0,1,
		1,1
    ]);
    geometry.addAttribute("uvCoord", new THREE.BufferAttribute(uvCoord, 2));
	var material = createShaderMaterialMandelbrot(textures[0], VertexShaderBasic, FragShaderBasic);
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = "mesh";
    scene.add( mesh );
    clearSliders();
    addSlider(
        "colorR1",
        0,
        5,
        0.9,
        0.1,
        function() {
            mesh.material.uniforms.colorR1.value = this.value;
        }
    );

    addSlider(
        "colorG1",
        0,
        5,
        0.9,
        0.1,
        function() {
            mesh.material.uniforms.colorG1.value = this.value;
        }
    );

    addSlider(
        "colorB1",
        0,
        5,
        0.1,
        0.1,
        function() {
            mesh.material.uniforms.colorB1.value = this.value;
        }
    );

	return scene; 
}

function createScene2() {
    var startingConst1 = -0.8;
    var startingConst2 = 0.156;
    var scene = new THREE.Scene();
    var geometry = new THREE.PlaneBufferGeometry(window.innerHeight, window.innerHeight, 1);
    var uvCoord = new Float32Array([
        0,0,
        1,0,
        0,1,
        1,1
    ]);
    geometry.addAttribute("uvCoord", new THREE.BufferAttribute(uvCoord, 2));
    var material = createShaderMaterialJulia(textures[0], JuliaVertexShader, JuliaFragShader, startingConst1, startingConst2);
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = "mesh";
    scene.add( mesh );
    clearSliders();
    addSlider(
        "constant 1",
        -2,
        2,
        -0.8,
        0.001,
        function() {
            mesh.material.uniforms.someConstant1.value = this.value;
        }
    );

    addSlider(
        "constant 2",
        -1,
        1,
        0.156,
        0.001,
        function() {
            mesh.material.uniforms.someConstant2.value = this.value;
        }
    );

    return scene;
}

function createScene3() {
    clearSliders();
	var scene = new THREE.Scene();
    var geometry = new THREE.PlaneBufferGeometry(window.innerHeight, window.innerHeight, 1);
    var uvCoord = new Float32Array([
		0,0,
		1,0,
		0,1,
		1,1
    ]);
    geometry.addAttribute("uvCoord", new THREE.BufferAttribute(uvCoord, 2));
	var material = createShaderMaterial(textures[0], BuddhaVertexShader, BuddhaFragShader);
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

function clearSliders() {
    var elements = document.getElementsByClassName("slider-wrapper");
    console.log(elements)
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
}

function addSlider(name, min, max, value, step, oninput) {
    var sliderWrapper = document.createElement("div");
    var sliderTitle = document.createTextNode(name);
    var slider = document.createElement("input");
    slider.type = "range";
    slider.name = name;
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.oninput = oninput;
    slider.className = "slider";
    sliderTitle.className = "slider-title";
    sliderWrapper.className = "slider-wrapper"
    sliderWrapper.appendChild(sliderTitle);
    sliderWrapper.appendChild(slider);
    document.getElementById("overlay").appendChild(sliderWrapper);
}
			

function createShaderMaterialMandelbrot(texture, vertexShader, fragShader, maxIterations = 200) {
    return new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                type: 't',
                value: texture
            },
            scale:{
                type: 'float',
                value: scale
            },
            center:{
                type: 'v2',
                value: new THREE.Vector2(0.5, 0.5)
            },
            maxIterations:{
                type: 'int',
                value: maxIterations
            },
            colorR1:{
                type: 'float',
                value: 0.9
            },
            colorG1:{
                type: 'float',
                value: 0.9
            },
            colorB1:{
                type: 'float',
                value: 0.1
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragShader
    });
}

function createShaderMaterialJulia(texture, vertexShader, fragShader, someConstant1 = 0, someConstant2 = 0, maxIterations = 200) {
    return new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                type: 't',
                value: texture
            },
            scale:{
                type: 'float',
                value: scale
            },
            center:{
                type: 'v2',
                value: new THREE.Vector2(0.5, 0.5)
            },
            someConstant1:{
                type: 'float',
                value: someConstant1
            },
            someConstant2:{
                type: 'float',
                value: someConstant2
            },
            maxIterations:{
                type: 'int',
                value: maxIterations
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragShader
    });
}