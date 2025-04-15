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
        const detailsPanel = document.getElementById("lot-details");
        const modal = document.getElementById("lot-modal");
        const closeButton = document.querySelector(".close-btn");
    
        if (!detailsPanel || !modal) {
            console.error("Lot details panel or modal not found!");
            return;
        }

        modalOpen = true;
    
    
        detailsPanel.innerHTML = `
            <h3>Lot ID: ${lot.id}</h3>
            <p><strong>Name:</strong> ${lot.name}</p>
            <p><strong>Description:</strong> ${lot.description}</p>
            <p><strong>Size:</strong> ${lot.size} sqm</p>
            <p><strong>Price:</strong> $${lot.price}</p>
            <p><strong>Block Number:</strong> ${lot.block_id}</p>
        `;

        // target the right column 
        const rightColumn = document.querySelector(".right-column");
        if (rightColumn) {
            // remove previous container if it exists
            const existing = rightColumn.querySelector("#house-3d-container");
            if (existing) existing.remove();

            // create new container for model
            const modelContainer = document.createElement("div");
            modelContainer.id = "house-3d-container";
            modelContainer.style.width = "100%";
            modelContainer.style.height = "300px";

            // add to the right column
            rightColumn.appendChild(modelContainer);

            setTimeout(() => {
                if (lot.modelUrl) {
                    init3DModel(modelContainer, lot.modelUrl);
                }
            }, 0);
        }
    
    
      
     modal.style.display = "flex";
     
        closeButton.onclick = () => {
            modal.style.display = "none";
            stop3DModel(); 
            modalOpen = false;
        };
    
      
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
                stop3DModel();
                modalOpen = false;
            }
        };
        renderReviewSection(lot);

    }




   
    








    var model, animationFrameId;

    function init3DModel(container, modelUrl) {
        // make sure container has no laman
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

         // fallback dimensions if container is invisible or collapsed
        const width = container.offsetWidth || 300;
        const height = container.offsetHeight || 300;
    
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        // set renderer size based on the container's actual width and height (CSS-controlled)
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
        
        // 3D model loading
        const loader = new GLTFLoader();
        loader.load(
            modelUrl,
            (gltf) => {
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
                camera.lookAt(0, 0, 0)
    
                animate();
            },
            undefined,
            (error) => {
                console.error("Error loading model:", error);
            }
        );
    
        // Rotate the model
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
    
    





    function renderReviewSection(lot) {
        const reviewSection = document.getElementById('review-section');
        const reviews = lot.reviews ?? [];
    
        reviewSection.innerHTML = `
            <h3>Leave a Review</h3>
            <form id="review-form">
                <label for="review-comment">Your Review:</label>
                <textarea id="review-comment" name="comment" rows="3" required></textarea>
    
                <div class="star-rating">
                    <span data-value="5">&#9733;</span>
                    <span data-value="4">&#9733;</span>
                    <span data-value="3">&#9733;</span>
                    <span data-value="2">&#9733;</span>
                    <span data-value="1">&#9733;</span>
                </div>
    
                <!-- hidden input to hold the selected star rating -->
                <input type="hidden" name="rating" id="rating-value" required>
    
                <button type="submit">Submit Review</button>
            </form>
    
            <h3>Reviews</h3>
            <div id="reviews-container">
                ${reviews.map(review => `
                    <div class="review" data-review-id="${review.id}">
                        <strong>${review.user_name}</strong> - ${review.rating}/5<br>
                        <p>${review.comment}</p>
                        <small>${review.created_at}</small><br>
    
                        ${review.user_id === Auth.userId ? `
                            <button class="edit-review">Edit</button>
                            <button class="delete-review">Delete</button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    
        // Handle form submission and star rating
        const reviewForm = document.getElementById('review-form');
        const ratingInput = document.getElementById('rating-value');
    
        if (reviewForm) {
            reviewForm.addEventListener('submit', async function (e) {
                e.preventDefault(); // Prevent the form from submitting normally
    
                const comment = document.getElementById('review-comment').value;
                const rating = ratingInput.value;
    
                const formData = new FormData();
                formData.append('lot_id', reviewForm.querySelector('[name="lot_id"]').value);
                formData.append('rating', rating);
                formData.append('comment', comment);
    
                try {
                    const response = await fetch('/reviews', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        }
                    });
    
                    const data = await response.json();
    
                    if (response.ok) {
                        // Handle successful review submission (e.g., add review to the page)
                        renderReviewSection(data.lot); // Re-render the review section with updated reviews
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error submitting review:', error);
                    alert('Something went wrong!');
                }
            });
        }
    
        // Handle star rating click
        document.querySelectorAll('.star-rating span').forEach(star => {
            star.addEventListener('click', function () {
                const rating = this.getAttribute('data-value');
                ratingInput.value = rating;
            });
        });
    
        // Handle edit
        document.querySelectorAll('.edit-review').forEach(button => {
            button.addEventListener('click', function() {
                const reviewId = this.closest('.review').getAttribute('data-review-id');
                // Fetch the review details and show an edit form
            });
        });
    
        // Handle delete
        document.querySelectorAll('.delete-review').forEach(button => {
            button.addEventListener('click', function() {
                const reviewId = this.closest('.review').getAttribute('data-review-id');
                // Send AJAX request to delete review
            });
        });
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