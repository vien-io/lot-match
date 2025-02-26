import './bootstrap';
import * as THREE from 'three';
import initThreeJS from './three';

/* document,addEventListener('DOMContentLoaded', () => {
    initThreeJS();
}) */

document.addEventListener('DOMContentLoaded', () =>{
    if (window.location.pathname == "/3dmap") {
        initThreeJS();
    }
});