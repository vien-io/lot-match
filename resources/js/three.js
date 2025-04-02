import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

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

    const houseLoader = new GLTFLoader();
    const houseModelLoader = new GLTFLoader();

    // load the scene GLB (the one with Empty objects)
    houseLoader.load("/models/housespawn2.glb", (gltf) => {
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

                // Now also store the rotation of the spawn point
                spawnObjects.push({ position: child.position.clone(), rotation: child.rotation.clone(), lotId, blockId });
            }




            // detect & add blocks
            if (child.name.startsWith("block_")) {
                console.log(`Found Block: ${child.name}`);
                selectableObjects.push(child); // add to selectable objects
            }
        });

        console.log("Spawn points found:", spawnPoints);

        // load the house model and place them at the spawn points
        spawnObjects.forEach(({ position, rotation, lotId, blockId }) => {
            houseModelLoader.load("/models/modelH.glb", (houseGltf) => {
                const house = houseGltf.scene;
                house.position.copy(position);  // Copy position
                house.rotation.copy(rotation);  // Copy rotation
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

    
    
    


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedHouse = null;
    let selectedBlock = null;
    const tooltip = document.getElementById('tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    
    window.addEventListener("mousemove", (event) => {
        // updt mouse coords
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(selectableObjects, true);
    
        if (intersects.length > 0) {
            let hoveredObject = intersects[0].object;













            // handle block highlightings
            if (hoveredObject.name.startsWith("block_")) {
                if (hoveredObject !== selectedBlock) {
                    // reset prev block glow
                    if (selectedBlock) {
                        selectedBlock.traverse(child => {
                            if (child.isMesh && child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(mat => {
                                        mat.emissive.set(0x000000);
                                        mat.emissiveIntensity = 0;
                                    });
                                } else {
                                    child.material.emissive.set(0x000000);
                                    child.material.emissiveIntensity = 0;
                                }
                            }
                        });
                    }

                    selectedBlock = hoveredObject; // set new block selection

                    // apply emissive glow to all meshes in the block
                    selectedBlock.traverse(child => {
                        if (child.isMesh && child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    mat.emissive.set(0xffffff); // purple glow for blocks
                                    mat.emissiveIntensity = 1;
                                });
                            } else {
                                child.material.emissive.set(0xffffff);
                                child.material.emissiveIntensity = 1;
                            }
                        }
                    });

                    // show tooltip for blocks
                    tooltipText.textContent = `Block: ${hoveredObject.name.split("_")[1]}`;
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${event.clientX + 10}px`;
                    tooltip.style.top = `${event.clientY + 10}px`;
                }

                return; // exit early to prevent highlighting houses while on blocks
            }












            // reset block highlight when switching to a house
            if (selectedBlock) {
                selectedBlock.traverse(child => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.emissive.set(0x000000);
                                mat.emissiveIntensity = 0;
                            });
                        } else {
                            child.material.emissive.set(0x000000);
                            child.material.emissiveIntensity = 0;
                        }
                    }
                });
                selectedBlock = null;
            }


















            
    
            // find the top-level house group
            while (hoveredObject.parent && !selectableObjects.includes(hoveredObject)) {
                hoveredObject = hoveredObject.parent;
            }
    
            if (hoveredObject !== selectedHouse) {
                // reset prev house glow
                if (selectedHouse) {
                    selectedHouse.traverse(child => {
                        if (child.isMesh && child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    mat.emissive.set(0x000000);
                                    mat.emissiveIntensity = 0;
                                });
                            } else {
                                child.material.emissive.set(0x000000);
                                child.material.emissiveIntensity = 0;
                            }
                        }
                    });
                }
    
                selectedHouse = hoveredObject; // set new selection
    
                // apply emissive glow to all meshes in the house group
                selectedHouse.traverse(child => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.emissive.set(0xffff00); // yellow glow
                                mat.emissiveIntensity = 1;
                            });
                        } else {
                            child.material.emissive.set(0xffff00);
                            child.material.emissiveIntensity = 1;
                        }
                    }
                });
            }
    
            // highlight lots tooltip
            // traverse up to find the group if necessary
            while (hoveredObject && !hoveredObject.userData.lotId && hoveredObject.parent) {
                hoveredObject = hoveredObject.parent;
            }
    
            // if hovered object has lotId
            if (hoveredObject.userData.lotId) {
                const lotId = hoveredObject.userData.lotId;
                tooltipText.textContent = `Lot: ${lotId}`;  // set tooltip text
                tooltip.style.display = 'block';  // show tooltip
                const position = hoveredObject.getWorldPosition(new THREE.Vector3());
                tooltip.style.left = `${event.clientX + 10}px`; // adjust x position
                tooltip.style.top = `${event.clientY + 10}px`; // adjust y position
            }
    
        } else {
             // reset block highlight when hovering over nothing
            if (selectedBlock) {
                selectedBlock.traverse(child => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.emissive.set(0x000000);
                                mat.emissiveIntensity = 0;
                            });
                        } else {
                            child.material.emissive.set(0x000000);
                            child.material.emissiveIntensity = 0;
                        }
                    }
                });
                selectedBlock = null;
            }







            // reset prev house glow when nothing is hovered
            if (selectedHouse) {
                selectedHouse.traverse(child => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.emissive.set(0x000000);
                                mat.emissiveIntensity = 0;
                            });
                        } else {
                            child.material.emissive.set(0x000000);
                            child.material.emissiveIntensity = 0;
                        }
                    }
                });
                selectedHouse = null;
            }
    
            // hide tooltip when no object hovered
            tooltip.style.display = 'none';
        }
    });
    










    // hndling mouse clicks to fetch lot details
    document.addEventListener("mousedown", (event) => { 
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // conv mouse pos to ndc (-1 to 1)
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
                console.log(`clicked on house with lot id: ${lotId}`);
    
                // fetch lot details from backend
                fetch(`/lot/${lotId}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('✅ lot data received:', data); 
                        if (data.error) {
                            console.error(data.error);
                        } else {
                            showLotDetails(data); // display lot details
                        }
                    })
                    .catch(err => {
                        console.error('error fetching lot details:', err);
                    });
            } else {
                console.log("no lot id assigned to this object!");
            }
        } else {
            console.log("clicked on empty space.");
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