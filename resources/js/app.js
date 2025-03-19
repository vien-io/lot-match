import './bootstrap';
import * as THREE from 'three';
import initThreeJS from './three';
import '../css/homepage.css';
import { gsap } from "gsap";


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

        // Fetch and populate block list dynamically
        const blockList = document.getElementById("block-list");

        fetch('/blocks')
            .then(response => response.json())
            .then(blocks => {
                blockList.innerHTML = ""; // Clear default list
                blocks.forEach(block => {
                    const blockItem = document.createElement("li");
                    blockItem.textContent = block.name;
                    blockItem.dataset.blockId = block.id;
                    blockItem.dataset.blockName = block.name.toLowerCase().replace(" ", ""); // Normalize name
                    blockItem.classList.add("block-item");

                    // Click event to fetch lots and move camera
                    blockItem.addEventListener("click", function () {
                        fetchLots(block.id, blockItem);
                        moveCameraToBlock(blockItem.dataset.blockName);
                    });

                    blockList.appendChild(blockItem);
                });
            })
            .catch(error => console.error("Error fetching blocks:", error));
    }
});
/* 
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
 */
document.getElementById('toggle-panel').addEventListener('click', function () {
    let panel = document.getElementById('side-panel');
    if (panel.style.transform === 'translateX(-100%)' || panel.style.transform === '') {
        panel.style.transform = 'translateX(0)';
    } else {
        panel.style.transform = 'translateX(-100%)';
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


// profile
document.addEventListener("DOMContentLoaded", function () {
    const profileIcon = document.getElementById("profile-icon");
    const profileDropdown = document.getElementById("profile-dropdown");

    profileIcon.addEventListener("click", function () {
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = "none";
        }
    });
});


/* 
// camera mode
let isTopDownMode = false;

document.getElementById('camera-mode-btn').addEventListener('click', function () {
    isTopDownMode = !isTopDownMode; // Toggle mode

    if (isTopDownMode) {
        switchToTopDownCamera();
    } else {
        switchToDefaultCamera();
    }
});

function switchToTopDownCamera() {
    if (!window.threeCamera) return;

    gsap.to(window.threeCamera.position, {
        x: 0,
        y: 50, // Higher elevation
        z: 50, // Position at an angle
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
            window.threeCamera.lookAt(0, 0, 0);
        }
    });

    console.log("Switched to Top-Down Camera Mode");
}

function switchToDefaultCamera() {
    if (!window.threeCamera) return;

    gsap.to(window.threeCamera.position, {
        x: 0,
        y: 90, // Normal elevation
        z: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
            window.threeCamera.lookAt(0, 0, 0);
        }
    });

    console.log("Switched to Default Camera Mode");
}
 */