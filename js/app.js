import * as THREE from 'three';
import images from './images';

const scrollable = document.querySelector('.scrollable');

let target = 0;
let current = 0;
let ease = 0.075;

// Linear Interpolation function
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function init(){
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`
}

function smoothScroll(){
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0, ${-current}px, 0)`;
    requestAnimationFrame(smoothScroll)
}

// Mouse coodinates
let targetX = 0;
let targetY = 0;

// Load image textures for Mesh

const textureOne = new THREE.TextureLoader().load(images.imageOne);
const textureTwo = new THREE.TextureLoader().load(images.imageTwo);
const textureThree = new THREE.TextureLoader().load(images.imageThree);
const textureFour = new THREE.TextureLoader().load(images.imageFour);
const textureFive = new THREE.TextureLoader().load(images.imageFive);
const textureSix = new THREE.TextureLoader().load(images.imageSix);

class Sketch {
    constructor(){
        this.container = document.querySelector('main');
        this.links = [...document.querySelectorAll('li')];
        this.scene = new THREE.Scene();
        this.perspective= 1000; // Camera perspective Distance on z axis from the screen
        this.sizes = new THREE.Vector2(0,0); // Mesh sizes
        this.offset = new THREE.Vector2(0,0); // Mesh Position
        this.uniforms = {
            uTexture: {value: textureOne},
            uAlpha: {value: 0.0},
            uOffset: {value: new THREE.Vector2(0.0, 0.0)}
        }
        this.links.forEach((link, idx) => {
            link.addEventListener('mouseenter', () => {
                switch(idx){
                    case 0:
                        this.uniforms.uTexture.value = textureOne;
                        break;
                    case 1: 
                        this.uniforms.uTexture.value = textureTwo;
                        break;
                    case 2: 
                        this.uniforms.uTexture.value = textureThree;
                        break;
                    case 3: 
                        this.uniforms.uTexture.value = textureFour;
                        break;
                    case 4: 
                        this.uniforms.uTexture.value = textureFive;
                        break;
                    case 5: 
                        this.uniforms.uTexture.value = textureSix;
                        break;
                }
            })
        })
        this.addEventListeners(document.querySelector('ul'));
        this.setupCamera();
        this.onMousemove();
        this.createMesh();
        this.render();
    }

    get viewport(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;

        return {
            width,
            height,
            aspectRatio
        }
    }

    onMousemove(){
        window.addEventListener('mousemove', e => {
            targetX = e.clientX;
            targetY = e.clientY;
        })
    }

    addEventListeners(element){
        element.addEventListener('mouseenter', () => {
            this.linksHover = true;            
        })
        element.addEventListener('mouseleave', () => {
            this.linksHover = false;
        })
    }

    setupCamera(){
        // READJUST DIMENSIONS ON WINDOW RESIZE
        window.addEventListener('resize', this.onWindowResize.bind(this));

        let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 1000);

        // Renderer / canvas
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio); // included to ensure meshes look ok on all screen sizes
        this.container.appendChild(this.renderer.domElement);
    }

    onWindowResize(){
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.camera.updateProjectionMatrix();
    }    

    createMesh(){
        this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
        this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.sizes.set(250, 350); // using vector2 defined in constructor
        this.mesh.scale.set(this.sizes.x, this.sizes.y);
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.scene.add(this.mesh);
    }

    render(){
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch();

smoothScroll()

init()