import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// post processing modules
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { OutlinePass } from 'three/examples/jsm/Addons.js';
/*
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
*/

// gsap for cam animation
import gsap from "gsap";


function initThreeJS() {
    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    // cam
    const camera = new THREE.PerspectiveCamera(
        80, 
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // renderer.shadowMap.enabled = false; // pang alis ng shadows to optimize

    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x128080,
        wireframe: false
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box); 

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

    const loader = new GLTFLoader();
    loader.load('/sample2.glb', function (gltf) {
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



   /* // raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let originalMaterial = null; // Store the original material for reset

// highlight effect using MeshBasicMaterial for highlighting
window.addEventListener("mousemove", (event) => {
    // Ensure model is loaded and valid before using it
    if (!model) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = model ? model.children : [];  // Ensure model is loaded before accessing children
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        if (hoveredObject !== selectedObject) {
            if (selectedObject) {
                selectedObject.material = originalMaterial; // Reset previous material
            }

            selectedObject = hoveredObject;
            originalMaterial = selectedObject.material; // Store the original material

            // Set highlighted material (MeshBasicMaterial)
            selectedObject.material = new THREE.MeshBasicMaterial({
                color: 0xffff00, // Yellow highlight
                wireframe: selectedObject.material.wireframe // Keep wireframe if originally set
            });
        }
    } else {
        if (selectedObject) {
            selectedObject.material = originalMaterial; // Reset material when no object is hovered
            selectedObject = null;
        }
    }
});
 */




// Raycaster for highlighting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let originalMaterial = null; // To store the original material

// highlight effect using Emissive Material
window.addEventListener("mousemove", (event) => {
    if (!model) return;

    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = model ? model.children : []; // Ensure model is loaded
    const intersects = raycaster.intersectObjects(clickableObjects, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        if (hoveredObject !== selectedObject) {
            if (selectedObject) {
                // Reset previous object material to original (non-emissive)
                selectedObject.material.emissive.set(0x000000); // Reset emissive color
            }

            selectedObject = hoveredObject;
            originalMaterial = selectedObject.material; // Store the original material

            // Set the emissive color for the highlighted object
            selectedObject.material.emissive.set(0xffff00); // Yellow glow effect
            selectedObject.material.emissiveIntensity = 1; // Make the glow more intense
        }
    } else {
        if (selectedObject) {
            // Reset emissive color when no object is hovered
            selectedObject.material.emissive.set(0x000000);
            selectedObject = null;
        }
    }
});





















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