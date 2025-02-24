import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// post processing modules
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
        1000
    );
    camera.position.set(0, 30, 0);
    

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = false; // try lang i-disable shadows





    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = true;
    controls.screenSpacePanning = true; 
    controls.panSpeed = 2;
    controls.update();

    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Increase intensity
    scene.add(ambientLight);

    let light = new THREE.DirectionalLight(0xffffff, 3.0);
    light.position.set(20, 10, 20);
    light.target.position.set(0,0,0);
    scene.add(light);
    scene.add(light.target);

    const lightHelper = new THREE.DirectionalLightHelper(light, 2); // 2 = size of helper
    scene.add(lightHelper);




    const selectableObjects = [];
    let model = null;

    // import model
    const loader = new GLTFLoader(); // no "three" prefix
    
    loader.load('/sample2.glb', function (gltf) {
        model = gltf.scene;
        model.position.set(0, 1, 3);
        model.scale.set(1, 1, 1);
        scene.add(model);
        console.log("model is loaded:", model); 
        selectableObjects.push(model);

        // check if lights were loaded
        gltf.scene.traverse((child) => {
            if (child.isLight) {
                console.log("Imported Light:", child);
                child.intensity *= .0009; // Adjust brightness if needed
            }
        });
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });

    










    

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
    outlinePass.hiddenEdgeColor.set(0x000000);  // black for hidden edges

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
                outlinePass.selectedObjects = [selectedObject]; // put outline
            }
        } else {
            outlinePass.selectedObjects = []; // remove outline
            selectedObject = null;
        }
    });


    let clickedObject = null; 

    // zoom and rotate
    window.addEventListener("click", (event) => {
        if (!model) {
            console.log("model is still null! Click is ignored");
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
       

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;


            console.log("Clicked Object:", clickedObject);
            console.log("Model:", model);
            console.log("Model Children:", model?.children);

            let isChild = false;
            model.traverse((child) => {
                if (child === clickedObject) {
                    isChild = true;
                }
            });

            if (isChild) {
                toggleZoom(clickedObject); 
                console.log("model was clicked!");
            }
      
        }
    });

    // animate model on click
    function toggleZoom(clickedObject) {
        if (!model || !clickedObject) return;

        console.log("zooming on:", clickedObject.name);
        // position ng target
        const targetPosition = new THREE.Vector3();
        clickedObject.getWorldPosition(targetPosition);
    
        if (!isZoomed) {
            
            controls.enabled = false; 

            // zoom in and move camera to eye level
            gsap.to(camera.position, {
                x: targetPosition.x,   
                y: targetPosition.y + 2,    // eye level
                z: targetPosition.z + 13,   // to move closer
                duration: 2,
                ease: "power2.inOut",
                onUpdate: () => requestAnimationFrame(() => controls.update()),
                onComplete: () => { controls.enabled = true; }
            });

            // camera focus on clicked obj
            gsap.to(controls.target, { 
                x: targetPosition.x, 
                y: targetPosition.y, 
                z: targetPosition.z, 
                duration: 2, 
                ease: "power2.inOut",
                onUpdate: () => requestAnimationFrame(() => controls.update()),
                onComplete: () => { controls.enabled = true; }
            });
    
       /*      // rotation slow
            gsap.to(model.rotation, {
                y: "+=2 * Math.PI", // full rot
                duration: 5,
                repeat: -1,         // infinite rot
                ease: "linear"
            }); */
    
        } else {
            console.log("zooming out");
            controls.enabled = false; 
            // reset to top view
            gsap.to(camera.position, {
                x: targetPosition.x,   
                y: targetPosition.y + 28,  
                z: targetPosition.z,      
                duration: 2,
                ease: "power2.inOut",
                onUpdate: () => controls.update(),
                onComplete: () => {
                    // camera look down
                    camera.lookAt(targetPosition);
                    camera.up.set(0, 0, -1);  // to make sure camera "up" vector is correct
                    controls.update();  
                }
            });
            // look down
            gsap.to(controls.target, { 
                x: targetPosition.x, 
                y: targetPosition.y,  // focus sa na select
                z: targetPosition.z, 
                duration: 2, 
                ease: "power2.inOut",
                onUpdate: () => controls.update()
            });
    
          /*   // stop rotating
            gsap.killTweensOf(model.rotation);
            gsap.to(model.rotation, { y: 0, duration: 1 }); */
        }
    
        isZoomed = !isZoomed;
    }













    /*

    // helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper); 
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // orbit
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // the 3d object
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
        color:0x00ff00,
        wireframe: true
    });
    const cube = new THREE.Mesh(geometry,material);
     // object to scene
    scene.add(cube);
    // animate
        // rotate
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
    
    const box2geo = new THREE.BoxGeometry();
    const box2material = new THREE.MeshStandardMaterial({
        color:0x00ff00,
    });
    const box2 = new THREE.Mesh(box2geo, box2material);
    scene.add(box2);
    box2.position.set(0, 4, 0);

    const sphereGeometry = new THREE.SphereGeometry(4, 12, 12);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(4, 4, 0);

    const box3geo = new THREE.BoxGeometry(4, 4, 4);
    const box3material = new THREE.MeshBasicMaterial({
        color:0x00ff00,
    });
    const box3 = new THREE.Mesh(box3geo, box3material);
    scene.add(box3);
    box3.position.set(12, 12, 0);

     const planeGeometry = new THREE.PlaneGeometry(3, 3);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -10;
*/
    

    

   

   

   

    // anim loop
    function animate() {
        requestAnimationFrame(animate);
    
        /* if (isZoomed && model) {
            model.rotation.y += 0.01; 
        } else if (model) {
           gsap.to(model.rotation, { y: 0, duration: 1 }); 
        } */
    
        controls.update();
        composer.render();
    }
    animate();

    

    //adjust scene on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
    });
}

export default initThreeJS;