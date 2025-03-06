import './bootstrap';
import * as THREE from 'three';
import initThreeJS from './three';
import '../css/homepage.css';



document.addEventListener('DOMContentLoaded', () =>{
    if (window.location.pathname == "/3dmap") {
        initThreeJS();
    }
});





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








document.addEventListener("scroll", function () {
    let scrollPosition = window.scrollY;
    document.querySelector(".parallax-section").style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});
