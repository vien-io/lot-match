import './bootstrap';
import * as THREE from 'three';
import initThreeJS from './three';
import '../css/homepage.css';







document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".btn-primary");

    buttons.forEach(button => {
        button.addEventListener("mousedown", function () {
            button.style.transform = "scale(0.9)";
        });

        button.addEventListener("mouseup", function () {
            button.style.transform = "scale(1)";
        });

        button.addEventListener("mouseleave", function () {
            button.style.transform = "scale(1)";
        });
    });
});



document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === "/3dmap") {
        initThreeJS();

        document.querySelectorAll("#block-list li").forEach(item => {
            item.addEventListener("click", function () {
                const blockName = this.getAttribute("data-block");
                moveCameraToBlock(blockName);
            });
        });
    }
});

// Function to move camera smoothly
function moveCameraToBlock(blockName) {
    if (!window.threeCamera) return;

    let targetPosition;
    switch (blockName) {
        case "block1":
            targetPosition = { x: 10, y: 30, z: 10 };
            break;
        case "block2":
            targetPosition = { x: -10, y: 30, z: 10 };
            break;
        case "block3":
            targetPosition = { x: 10, y: 30, z: -10 };
            break;
        case "block4":
            targetPosition = { x: -10, y: 30, z: -10 };
            break;
        default:
            return;
    }

    gsap.to(window.threeCamera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
            window.threeCamera.lookAt(0, 0, 0);
        }
    });
}

document.getElementById('toggle-panel').addEventListener('click', function () {
    let panel = document.getElementById('side-panel');
    panel.style.transform = panel.style.transform === 'translateX(-100%)' ? 'translateX(0)' : 'translateX(-100%)';
});


/* detect block selection */
