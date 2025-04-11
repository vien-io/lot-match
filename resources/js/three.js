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
    // scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(80, 20);
    // scene.add(gridHelper);

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
    // scene.add(lightHelper);


    // house models
    const selectableObjects = [];

    const houseLoader = new GLTFLoader();
    const houseModelLoader = new GLTFLoader();

    // load the scene GLB (the one with Empty objects)
    houseLoader.load("/models/housespawn.glb", (gltf) => {
        const sceneModel = gltf.scene;
        scene.add(sceneModel);

        // console.log("Loaded scene:", sceneModel);

        // find all empties
        const spawnPoints = [];
        const spawnObjects = [];

        sceneModel.traverse((child) => {
            if (child.name.startsWith("lot")) { 
                // console.log(`Found Empty: ${child.name}, Position: ${child.position.x}, ${child.position.y}, ${child.position.z}`);
                spawnPoints.push(child.position.clone());

                // extract lot id and block id from obj name
                const parts = child.name.split("_"); 
                const lotId = parts[1];  
                const blockId = parts[3]; 

                // check id if ends with _r
                const shouldMirror = child.name.endsWith("_r");

                // store rotation of spawn point
                spawnObjects.push({ position: child.position.clone(), rotation: child.rotation.clone(), lotId, blockId, shouldMirror });
            }




            // detect & add blocks
            if (child.name.startsWith("block_")) {
                // console.log(`Found Block: ${child.name}`);
                selectableObjects.push(child); // add to selectable objects
            }
        });

        // console.log("Spawn points found:", spawnPoints);

        // load the house model and place them at the spawn points
        spawnObjects.forEach(({ position, rotation, lotId, blockId, shouldMirror }) => {

            const lod = new THREE.LOD();

            // helper func to load and add to lod
            const loadLODLevel = (url, distance, onLoad) => {
                houseModelLoader.load(url, (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);
                    if (shouldMirror) model.scale.x *= -1;
                    onLoad(model, distance);
                });
            };

            loadLODLevel("/models/modelH.glb", 0, (model, dist) => {
                model.frustumCulled = true;
                lod.addLevel(model, dist);
            });

            loadLODLevel("/models/modelH_medium.glb", 25, (model, dist) => {
                model.frustumCulled = true;
                lod.addLevel(model, dist);
            });

            loadLODLevel("/models/modelH_low.glb", 50, (model, dist) => {
                model.frustumCulled = true;
                lod.addLevel(model, dist);
            });

            // set global rot and pos
            lod.position.copy(position);
            lod.rotation.copy(rotation);

            // assign id 
            lod.userData.lotId = lotId;
            lod.userData.blockId = blockId;

            lod.frustumCulled = true;

            scene.add(lod);
            selectableObjects.push(lod);
        });
    });

    
    
    

































    document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.getElementById('toggle-panel');
        console.log("toggleBtn:", toggleBtn);
    
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                let panel = document.getElementById('side-panel');
                const currentTransform = window.getComputedStyle(panel).transform;
    
                if (currentTransform === 'matrix(1, 0, 0, 1, 0, 0)') {
                    panel.style.transform = 'translateX(-100%)';
                } else {
                    panel.style.transform = 'translateX(0)';
                }
            });
        }
    });
    
    
    
    
    function fetchLots(blockId, blockItem) {
        console.log(`Fetching lots for block ID: ${blockId}`);
    
        // Hide lots from other blocks
        document.querySelectorAll(".lots-container").forEach(container => {
            if (container.parentElement !== blockItem) {
                container.style.display = "none";
            }
        });
    
        let lotsContainer = blockItem.querySelector(".lots-container");
    
        if (!lotsContainer) {
            lotsContainer = document.createElement("ul");
            lotsContainer.classList.add("lots-container");
            blockItem.appendChild(lotsContainer);
        }
    
        // Toggle visibility of the clicked block's lots
        if (lotsContainer.style.display === "block") {
            lotsContainer.style.display = "none";
            return;
        } else {
            lotsContainer.style.display = "block";
        }
    
        // Show loading state
        lotsContainer.innerHTML = "<li>Loading lots...</li>";
    
        fetch(`/lots/${blockId}`)
            .then(response => response.json())
            .then(lots => {
                console.log("Lots received:", lots);
    
                lotsContainer.innerHTML = ""; 
    
                if (lots.length === 0) {
                    lotsContainer.innerHTML = "<li>No lots available</li>";
                    return;
                }
    
                lots.forEach(lot => {
                    console.log(`Processing lot: ${JSON.stringify(lot)}`);
                    const lotItem = document.createElement("li");
                    lotItem.textContent = `${lot.name}`;
                    lotsContainer.appendChild(lotItem);
                });
            })
            .catch(error => {
                console.error("Error fetching lots:", error);
                lotsContainer.innerHTML = "<li>Error loading lots</li>";
            });
    }






    

    


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedHouse = null;
    let selectedBlock = null;
    const tooltip = document.getElementById('tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    
    window.addEventListener("mousemove", (event) => {
        // check if mouse is on left panel
        const leftPanel = document.getElementById("side-panel"); 
        const panelRect = leftPanel.getBoundingClientRect();
        if (
            event.clientX >= panelRect.left &&
            event.clientX <= panelRect.right &&
            event.clientY >= panelRect.top &&
            event.clientY <= panelRect.bottom
        ) {
            return;
        }




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
                }
                tooltip.style.left = `${event.clientX + 10}px`;
                tooltip.style.top = `${event.clientY + 10}px`;
                return;
                
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
    
                // apply glow to all meshes in the house grp
                selectedHouse.traverse(child => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.emissive.set(0xffff00); // yellow
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
                const blockId = hoveredObject.userData.blockId; 
                tooltipText.textContent = `Lot: ${lotId}, Block: ${blockId}`;
                tooltip.style.display = 'block'; 
                
                tooltip.style.left = `${event.clientX + 10}px`; 
                tooltip.style.top = `${event.clientY + 10}px`; 
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
    
    let modalOpen = false;
    let isDragging = false;
    let mouseDownPosition = { x: 0, y: 0 };
    const dragThreshold = 5; 

    document.addEventListener("mousedown", (event) => {
        // reset position of mouse
        mouseDownPosition.x = event.clientX;
        mouseDownPosition.y = event.clientY;
        isDragging = false; 
    });

    document.addEventListener("mousemove", (event) => {
        // check if mouse moved
        const distance = Math.sqrt(
            Math.pow(event.clientX - mouseDownPosition.x, 2) +
            Math.pow(event.clientY - mouseDownPosition.y, 2)
        );
    
        if (distance > dragThreshold) {
            isDragging = true; 
        }
    });

    document.addEventListener("mouseup", (event) => {
        if (isDragging) {
            return;
        }

        if (modalOpen) return;

        // ignore raycasting in left panel
        const leftPanel = document.getElementById("side-panel"); 
        const panelRect = leftPanel.getBoundingClientRect();
        
        if (
            event.clientX >= panelRect.left &&
            event.clientX <= panelRect.right &&
            event.clientY >= panelRect.top &&
            event.clientY <= panelRect.bottom
        ) {
            return;
        }

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
                        // console.log('lot data received:', data); 
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
    
    function showLotDetails(lot) {
        console.log("showLotDetails called with:", lot);
        // console.log("Lot Model URL:", lot.modelUrl);
        const detailsPanel = document.getElementById("lot-details");
        const modal = document.getElementById("lot-modal");
        const closeButton = document.querySelector(".close-btn");
        const modal2 = document.getElementById("modal2");
    
        if (!detailsPanel || !modal) {
            console.error("Lot details panel or modal not found!");
            return;
        }

        modalOpen = true;
    
        // clear previous model if exists
        let existingModelContainer = document.getElementById("house-3d-container");
        if (existingModelContainer) {
            existingModelContainer.remove();
        }
        
       
        const modelContainer = document.createElement("div");
        modelContainer.id = "house-3d-container";
        modelContainer.style.width = "100%";
        modelContainer.style.height = "300px"; 
    
        detailsPanel.innerHTML = `
            <h3>Lot ID: ${lot.id}</h3>
            <p><strong>Name:</strong> ${lot.name}</p>
            <p><strong>Description:</strong> ${lot.description}</p>
            <p><strong>Size:</strong> ${lot.size} sqm</p>
            <p><strong>Price:</strong> $${lot.price}</p>
            <p><strong>Block Number:</strong> ${lot.block_id}</p>
        `;
    
        detailsPanel.appendChild(modelContainer); // Append model container inside modal
        modal.style.display = "flex";
    
        // Load and display 3D model
        if (lot.modelUrl) {
            init3DModel(modelContainer, lot.modelUrl);
        }
    
        // Close modal when clicking close
        closeButton.onclick = () => {
            modal.style.display = "none";
            stop3DModel();  // Stop 3D model animation when modal is closed
            modalOpen = false;
        };
    
        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                stop3DModel();
                modalOpen = false;
            }
        };
    }




   
    








    var model, animationFrameId;

    function init3DModel(container, modelUrl) {
        // console.log("init3dmodel called with URL:", modelUrl);
    
        // make sure container has no laman
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);
    
        // set globally
        window.scene = scene;     
        window.camera = camera;  
        window.renderer = renderer;  
    
        // light
        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
        
        // 3d
        const loader = new GLTFLoader();
        loader.load(
            modelUrl,
            (gltf) => {
                // console.log("model loaded", modelUrl);
    
                model = gltf.scene;
    
                // remove unwanted parts if model has multi meshes
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
    
                scene.add(model);
                model.rotation.x = Math.PI / 6;
                model.rotation.y = Math.PI / 4;
                camera.position.set(0, 1, 10);
    
                animate();
            },
            undefined,
            (error) => {
                console.error("Error loading model:", error);
            }
        );
    
        // rotate mdl
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
             if (model) {
        model.rotation.y += 0.009;
    }
            renderer.render(scene, camera);
        }
    }
    
    function stop3DModel() {
    
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;  
        } else {
        }
    
        if (window.scene) {
            if (window.model) {
                window.scene.remove(window.model);
                window.model.rotation.set(0, 0, 0); 
    
                window.model.traverse((child) => {
                    if (child.geometry) {
                        
                        child.geometry.dispose();
                    }
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => {
                                mat.dispose();
                            });
                        } else {
                            child.material.dispose();
                        }
                    }
                });
                window.model = null;
            }
    
            // dispose renderer
            if (window.renderer) {
                window.renderer.dispose();
                if (window.renderer.domElement) {
                    window.renderer.domElement.remove();
                }
                window.renderer = null;
            }
    
            // clear scene
            window.scene.clear();
            window.scene = null;
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