import './bootstrap';
import * as THREE from 'three';
import initThreeJS from './three';
import '../css/homepage.css';



document.addEventListener('DOMContentLoaded', () =>{
    if (window.location.pathname == "/3dmap") {
        initThreeJS();
    }
});

