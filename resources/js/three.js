import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// post processing modules
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { OutlinePass } from 'three/examples/jsm/Addons.js';

// gsap for cam animation
import gsap from "gsap";


function initThreeJS() {
    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD3D3D3);

    // cam
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.set(0 , 90, 0);
    camera.lookAt(0, 0, 0);
    window.threeCamera = camera; 

    // helpers
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(80, 20);
    scene.add(gridHelper);

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // renderer.shadowMap.enabled = false; // pang alis ng shadows to optimize

    

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePAN = true;
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    controls.screenSpacePanning = true;
    controls.panSpeed = 2;
    controls.update();
   
    // lightings
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    let light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(20, 10, 20);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
    
    const lightHelper = new THREE.DirectionalLightHelper(light, 2);
    scene.add(lightHelper);


    // house models
    const selectableObjects = [];
    let model = null;
    let model2 = null;

    const loader = new GLTFLoader();
    loader.load('/models/sample4.glb', function (gltf) {
        model = gltf.scene;
        model.position.set(0, 1, 3);
        model.scale.set(1, 1, 1);
        scene.add(model);

         // just to make sure each model has own material
         model.traverse((child) => {
            if (child.isMesh) {
                // cloning to avoid same material
                child.material = child.material.clone();
            }
        });

        selectableObjects.push(model);
        console.log("model is loaded", model); // check model load

        /*
        // check if lights were loaded
        gltf.scene.traverse((child) => {
            if (child.isLight) {
                console.log("Imported Light:", child);
                child.intensity *= .0009; 
            }
        });
        */

    },  undefined, function (error) {
        console.error('Error loading model:', error);
    });

    

    /* 
    // composer for post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // selecting outline
    const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
    );
    outlinePass.edgeStrength = 3;
    outlinePass.edgeGlow = 0.001;
    outlinePass.edgeThickness = 0.00001;
    outlinePass.visibleEdgeColor.set(0xffffff);
    outlinePass.hiddenEdgeColor.set(0x000000); // black for hidden edges

    composer.addPass(outlinePass);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = null;
    let isZoomed = false; // for zooming

    // highlight effect
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const clickableObjects = model.children;
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;

            if (hoveredObject !== selectedObject) {
                selectedObject = hoveredObject;
                outlinePass.selectedObjects = [selectedObject]; // put the outline
            }
        } else {
            outlinePass.selectedObjects = []; // remove outline
            selectedObject = null;
        } 
    });
 */







// for highlighting selected objs
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let originalMaterial = null; // to store orig mat

// emissive mat
window.addEventListener("mousemove", (event) => {
    if (!model) return;

    // updt mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = model ? model.children : []; // make sure model is loaded
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        if (hoveredObject !== selectedObject) {
            if (selectedObject) {
                // reset prev obj mat to orig (not emissive)
                if (Array.isArray(selectedObject.material)) {
                    selectedObject.material.forEach(mat => {
                        mat.emissive.set(0x000000);  // reset em color
                        mat.emissiveIntensity = 0; // remove intensity
                    });
                } else {
                    selectedObject.material.emissive.set(0x000000);
                    selectedObject.material.emissiveIntensity = 0;
                }
            }

            selectedObject = hoveredObject;
            originalMaterial = selectedObject.material; // store orig mat

            // apply em to hovered objs (for all materials)
            if (Array.isArray(selectedObject.material)) {
                selectedObject.material.forEach(mat => {
                    mat.emissive.set(0xffff00); // yellow glow
                    mat.emissiveIntensity = 1; 

                    // to make sure texture is not affected by em color
                    mat.emissiveMap = mat.map;  // diffuse map as the emissive map
                    mat.emissive = new THREE.Color(0xffff00); // making sure emissive color is applied
                });
            } else {
                selectedObject.material.emissive.set(0xffff00); // yellow glow
                selectedObject.material.emissiveIntensity = 4;
                selectedObject.material.emissiveMap = selectedObject.material.map; // diffuse map as em map
                selectedObject.material.emissive = new THREE.Color(0xffff00); // apply em color
            }
        }
    } else {
        if (selectedObject) {
            // reset em color when no obj is hovered
            if (Array.isArray(selectedObject.material)) {
                selectedObject.material.forEach(mat => {
                    mat.emissive.set(0x000000);
                    mat.emissiveIntensity = 0;
                });
            } else {
                // selectedObject.material.emissive.set(0x000000);
                selectedObject.material.emissive.set(0xffffff);
                selectedObject.material.emissiveIntensity = 0;
            }
            selectedObject = null;
        }
    }
});


/* 
// zoom and rotate

let clickedObject = null;
window.addEventListener("click", (event) => {
    if (!model) {
        console.log("model is still null! click is ignored");
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    

});
 */




















    // animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

        controls.update();
        // composer.render();
    }
    animate();

    // adjust screen on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })
}

export default initThreeJS;