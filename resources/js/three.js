import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';

function initThreeJS() {
    // scene
    const scene = new THREE.Scene();

    // cam
    const camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(-10, 30, 30);
    

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper); 
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // the 3d object
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
        color:0x00ff00,
        wireframe: true
    });
    const cube = new THREE.Mesh(geometry,material);

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

    const gui = new dat.GUI();
    const options = {
        sphereColor: '#ffea00',
        wireframe: false
    };

    gui.addColor(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e);
    });

    gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e;
    });
           

    const planeGeometry = new THREE.PlaneGeometry(3, 3);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -10;

    // object to scene
    scene.add(cube);

    // anim loop
    function animate() {
        requestAnimationFrame(animate);

        // rotate
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        //render scene
        renderer.render(scene,camera);
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