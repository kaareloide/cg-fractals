//import * as THREE from './addons/three.module.js';
import $ from "jquery";
import './styles/app.css';
//import { EffectComposer } from './addons/EffectComposer.js';
//import { RenderPass} from './addons/RenderPass.js';
//import { UnrealBloomPass } from './addons/UnrealBloomPass.js';

import VertexShader from './shaders/vertexShader.glsl';
import MandelbrotFragShader from './shaders/mandelbrotFragShader.glsl';
import JuliaFragShader_2 from './shaders/juliaFragShader_2.glsl';
import JuliaFragShader_3 from './shaders/juliaFragShader_3.glsl';

var camera, currentScene, renderer, composer;
var scale = 5.0;
var maxIterations = Math.min(1000 / scale, 2000);
var center = new THREE.Vector2(0.5, 0.5);
var renderSize;
var sceneSize = 1;
var buttonAnimation;

init();

function init() {
	document.addEventListener("keypress", changeScene);

    document.addEventListener( 'DOMMouseScroll', onMouseWheel, false );	// firefox
    document.addEventListener("mousewheel", onMouseWheel, false);    // chrome
    window.addEventListener("resize", onWindowResize);    // if window size changed

    camera = new THREE.OrthographicCamera( sceneSize / - 2,  sceneSize / 2,  sceneSize / 2, sceneSize / - 2, 0.01, 1000 );
	camera.position.z = 10;

    currentScene = createMandelbrotScene();
	renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderSize = window.innerHeight < window.innerWidth? window.innerHeight : window.innerWidth;
    renderer.setSize( renderSize, renderSize );
    document.body.appendChild( renderer.domElement );

    oldAnimate();
}

// TODO: MAKE THIS WORK BY GETTING addons FOLDER TO IMPORT CORRECTLY
function animate(){
    composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(currentScene, camera);
    composer.addPass(renderPass);
    var effectBloom = new THREE.UnrealBloomPass(new THREE.Vector2(sceneSize, sceneSize), 1.5, 0.4, 0.85);
    effectBloom.threshold = 0;
    effectBloom.strength = 0.5;
    effectBloom.radius = 0;
    composer.addPass(effectBloom);

    composer.render();
    requestAnimationFrame( animate );
}

function oldAnimate() {
    requestAnimationFrame( oldAnimate );
    renderer.render( currentScene, camera );
}

function onWindowResize() {
    renderSize = window.innerHeight < window.innerWidth? window.innerHeight : window.innerWidth;
    renderer.setSize(renderSize, renderSize);
}

function onMouseWheel(e) {
    var e = window.event || e;

    // kui mouse event toimus stseenist väljas siis ei zoomi ega uuenda keskkohta
    // kontroll x-koordinaadi järgi
    if (window.innerWidth > renderSize) {
        var windowSideSize = (window.innerWidth - renderSize) / 2;
        if (e.clientX < windowSideSize || e.clientX > windowSideSize + renderSize) {
            return false;
        }
    }
    // kontroll y-koordinaadi järgi
    if (window.innerHeight > renderSize) {
        var windowSideSize = (window.innerHeight - renderSize) / 2;
        if (e.clientY < windowSideSize || e.clientY > windowSideSize + renderSize) {
            return false;
        }
    }

    var scaleSize = 1.1;
    var scaleBefore = scale;

    // zoom
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    scale =  delta > 0 ? scale / scaleSize : scale * scaleSize;
    currentScene.children[0].material.uniforms.scale.value = scale;

    // center update
    // new x
    if (window.innerWidth > renderSize) {
        var windowSideSize = (window.outerWidth - renderSize) / 2;
        var x = (e.clientX - windowSideSize) / renderSize;
    } else {
        var x = e.clientX / window.innerWidth;
    }
    x = calculateCenterCoordinateAfterZoom(x, center.x, scaleBefore, scale);

    // new y
    if (window.innerHeight > renderSize) {
        var windowSideSize = (window.innerHeight - renderSize) / 2;
        var y = (e.clientY - windowSideSize) / renderSize;
    } else {
        var y = e.clientY / window.innerHeight;
    }
    y = calculateCenterCoordinateAfterZoom(y, center.y, scaleBefore, scale);

    center = new THREE.Vector2(x, y);
    currentScene.children[0].material.uniforms.center.value = center;

    // max iterations update
    maxIterations = Math.min(1000 / scale, 2000);
    currentScene.children[0].material.uniforms.maxIterations.value = maxIterations;
    console.log(maxIterations);

    return false;
}

function calculateCenterCoordinateAfterZoom(coordinate, centerCoordinate, scaleBefore, scaleNow) {
    return (scaleNow * coordinate - (scaleBefore * coordinate + scaleBefore * (0 - centerCoordinate))) / scaleNow;
}

function setScaleAndCenter(newScale, centerX, centerY) {
    scale = newScale;
    center = new THREE.Vector2(centerX, centerY);
    currentScene.getObjectByName("mesh").material.uniforms.center.value = center;
    currentScene.getObjectByName("mesh").material.uniforms.scale.value = scale;
}

function resetScaleAndCenter() {
    setScaleAndCenter(5.0, 0.5, 0.5)
}

// change scene with number keys 1,2,3
function changeScene(e) {
    resetScaleAndCenter();
    clearOverlay();
    stopAnimation();

    switch (e.code) {
		case "Digit1":
            currentScene = createMandelbrotScene();
			break;
		case "Digit2":
			currentScene = createJuliaSet2Scene();
			break;
		case "Digit3":
			currentScene = createJuliaSet3Scene();
			break;
	}
	console.log(e.code);
}

function createPlaneMesh(VertexShader, FragShader){
    var geometry = new THREE.PlaneBufferGeometry(sceneSize, sceneSize, 1);
    var uvCoord = new Float32Array([
        0,0,
        1,0,
        0,1,
        1,1
    ]);
    geometry.setAttribute("uvCoord", new THREE.BufferAttribute(uvCoord, 2));
    var material = createShaderMaterial(VertexShader, FragShader);
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = "mesh";

    return mesh
}

function clearOverlay() {
    // sliders
    var elements = document.getElementsByClassName("slider-wrapper");
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);

    // dropdowns
    elements = document.getElementsByClassName("dropdown-wrapper");
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);

    // buttons
    elements = document.getElementById("buttons").children;
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
}

function stopAnimation() {
    clearInterval(buttonAnimation)
}

function addSlider(name, min, max, value, step, onInput) {
    var sliderWrapper = document.createElement("div");
    var sliderTitle = document.createTextNode(name);
    var slider = document.createElement("input");
    slider.type = "range";
    slider.name = name;
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.oninput = onInput;
    slider.className = "slider";
    sliderTitle.className = "slider-title";
    sliderWrapper.className = "slider-wrapper";
    sliderWrapper.appendChild(sliderTitle);
    sliderWrapper.appendChild(slider);
    document.getElementById("sliders").appendChild(sliderWrapper);
}

function addDropdown(name, items, onChange) {
    var dropdownWrapper = document.createElement("div");
    var dropdownTitle = document.createTextNode(name);
    var dropdown = document.createElement("select");
    dropdown.name = name;

    items.forEach(
        (item, index) => {
            var option = document.createElement("option");
            option.value = index;
            option.text = item;
            dropdown.appendChild(option);
        }
    );

    dropdown.onchange = onChange;
    dropdown.className = "dropdown";

    dropdownTitle.className = "dropdown-title";
    dropdownWrapper.className = "dropdown-wrapper";
    dropdownWrapper.appendChild(dropdownTitle);
    dropdownWrapper.appendChild(dropdown);
    document.getElementById("dropdowns").appendChild(dropdownWrapper);
}

function addButton(name, onClick, ...args) {
    var button = document.createElement("button");
    button.innerHTML = name;
    button.addEventListener ("click", function() {
        onClick(...args);
    });

    document.getElementById("buttons").appendChild(button);
}

function zoomAnimation(centerX, centerY) {
    stopAnimation();
    resetScaleAndCenter();
    buttonAnimation = setInterval(frame, 5);
    var times = 1000;
    var scaleChange = 0.99;
    var x, y, newScale;
    function frame() {
        if (times == 0) {
            clearInterval(buttonAnimation);
        } else {
            times = times - 1;
            newScale = scale * scaleChange;
            x = calculateCenterCoordinateAfterZoom(centerX, center.x, scale, newScale);
            y = calculateCenterCoordinateAfterZoom(centerY, center.y, scale, newScale);
            setScaleAndCenter(newScale, x, y)
        }
    }
}

function createMandelbrotScene() {
    var scene = new THREE.Scene();
    var mesh = createPlaneMesh(VertexShader, MandelbrotFragShader);
    scene.add( mesh );

    addSlider("colorR1", 0, 5, 0.9, 0.1,
        function() {
            mesh.material.uniforms.colorR1.value = this.value;
        }
    );

    addSlider("colorG1", 0, 5, 0.9, 0.1,
        function() {
            mesh.material.uniforms.colorG1.value = this.value;
        }
    );

    addSlider("colorB1", 0, 5, 0.1, 0.1,
        function() {
            mesh.material.uniforms.colorB1.value = this.value;
        }
    );

	return scene;
}

function createJuliaSet2Scene() {
    var scene = new THREE.Scene();
    var mesh = createPlaneMesh(VertexShader, JuliaFragShader_2);
    mesh.material.uniforms.realConstant.value = -1.201;
    mesh.material.uniforms.imaginaryConstant.value = 0.156;
    scene.add( mesh );

    addSlider("Real constant", -2, 2, -0.8, 0.001,
        function() {
            mesh.material.uniforms.realConstant.value = this.value;
        }
    );

    addSlider("Imag constant", -1, 1, 0.156, 0.001,
        function() {
            mesh.material.uniforms.imaginaryConstant.value = this.value;
        }
    );

    addButton("Animate",
        zoomAnimation,
        0.555, 0.485, scene
    );

    return scene;
}

function createJuliaSet3Scene() {
    var scene = new THREE.Scene();
    var mesh = createPlaneMesh(VertexShader, JuliaFragShader_3);
    mesh.material.uniforms.realConstant.value = -0.594;
    mesh.material.uniforms.imaginaryConstant.value = 0.156;
    scene.add( mesh );

    addSlider("Real constant", -2, 2, -0.8, 0.001,
        function() {
            mesh.material.uniforms.realConstant.value = this.value;
        }
    );

    addSlider("Imag constant", -1, 1, 0.156, 0.001,
        function() {
            mesh.material.uniforms.imaginaryConstant.value = this.value;
        }
    );

    addButton("Animate",
        zoomAnimation,
        0.69, 0.45, scene
    );

    return scene;
}

function createShaderMaterial(vertexShader, fragShader) {
    return new THREE.ShaderMaterial({
        uniforms: {
            scale:{
                type: 'float',
                value: scale
            },
            center:{
                type: 'v2',
                value: center
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
            },
            realConstant:{
                type: 'float',
                value: 0.0
            },
            imaginaryConstant:{
                type: 'float',
                value: 0.0
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragShader
    });
}