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
    controls.enableZoom = true;
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
 

    const houseLoader = new GLTFLoader();
    const houseModelLoader = new GLTFLoader();
    
    // load the scene GLB (the one with Empty objects)
    houseLoader.load("/models/housespawn.glb", (gltf) => {
        const sceneModel = gltf.scene;
        scene.add(sceneModel);
    
        console.log("Loaded scene:", sceneModel);
    
    // find all empties
    const spawnPoints = [];
    const spawnObjects = [];

    sceneModel.traverse((child) => {
        if (child.name.startsWith("lot")) { 
            console.log(`Found Empty: ${child.name}, Position: ${child.position.x}, ${child.position.y}, ${child.position.z}`);
            spawnPoints.push(child.position.clone());

            // extract lot id and block id from obj name
            const parts = child.name.split("_"); 
            const lotId = parts[1];  
            const blockId = parts[3]; 

            spawnObjects.push({ position: child.position.clone(), lotId, blockId });
        }
    });

    console.log("Spawn points found:", spawnPoints);

        // load the house model and place them at the spawn points
        spawnObjects.forEach(({ position, lotId, blockId }) => {
            houseModelLoader.load("/models/modelH.glb", (houseGltf) => {
                const house = houseGltf.scene;
                house.position.copy(position);
                house.scale.set(1, 1, 1);

                // assign extracted lot and block ids
                house.userData.lotId = lotId; 
                house.userData.blockId = blockId; 

                console.log(`Assigned Lot ID: ${lotId}, Block ID: ${blockId}`); 
                console.log(`House added at ${position.x}, ${position.y}, ${position.z} with Lot ID: ${lotId} and Block ID: ${blockId}`);
                
                scene.add(house);
                selectableObjects.push(house);
            });
        });
    });
    
    
    






// for highlighting selected objs
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let originalMaterial = null; // to store orig mat

// emissive mat
window.addEventListener("mousemove", (event) => {
    // if (!model) return;

    // updt mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = selectableObjects.flatMap(obj => obj.children);
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










document.addEventListener("click", (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        let selectedObject = intersects[0].object;
        
        // traverse up to find the group if necessary
        while (selectedObject && !selectedObject.userData.lotId && selectedObject.parent) {
            selectedObject = selectedObject.parent;
        }

        if (selectedObject.userData.lotId) {
            const lotId = selectedObject.userData.lotId;
            console.log(`Clicked on house with Lot ID: ${selectedObject.userData.lotId}`);
             // fetch lot details from the backend
             fetch(`/lot/${lotId}`)
             .then(response => response.json())
             .then(data => {
                console.log('✅ Lot Data Received:', data); 
                 if (data.error) {
                     console.error(data.error);
                 } else {
                     showLotDetails(data);  // call function to display the details
                 }
             })
             .catch(err => {
                 console.error('Error fetching lot details:', err);
             });
        } else {
            console.log("No Lot ID assigned to this object!");
        }
    } else {
        console.log("Clicked on empty space.");
    }
});


// function to display lot details
function showLotDetails(lot) {
    console.log("📌 showLotDetails Called with:", lot);
    const detailsContainer = document.getElementById("lot-details-container");
    const detailsPanel = document.getElementById("lot-details");
    const modal = document.getElementById("lot-modal");
    const closeButton = document.querySelector(".close-btn");

    if (!detailsPanel) {
        console.error("❌ Lot details panel not found!");
        return;
    }
    if (!modal || !detailsPanel) {
        console.error("❌ Modal not found!");
        return;
    }


    // check if details panel exists
    if (detailsPanel) {
        // lot details
        detailsPanel.innerHTML = `
            <h3>Lot ID: ${lot.id}</h3>
            <p><strong>Name:</strong> ${lot.name}</p>
            <p><strong>Description:</strong> ${lot.description}</p>
            <p><strong>Size:</strong> ${lot.size} sqm</p>
            <p><strong>Price:</strong> $${lot.price}</p>
            <p><strong>Block Number:</strong> ${lot.block_number}</p>
        `;

         // show modal
        modal.style.display = "flex";

        // close modal when clicking close 
        closeButton.onclick = () => {
            modal.style.display = "none";
        };

        // close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } else {
        console.error("Lot details panel not found!");
    }
}















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