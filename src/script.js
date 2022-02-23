import './style.css'
import * as THREE from 'three'
import { FontService } from "./services/font"
import { DonutModel } from "./models/donuts"
import { Camera } from "./cameras/camera"
import { GLTFService } from './services/gltf'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTextures = []
const numberTextures = 8
for (let i = 1; i <= numberTextures; i++) {
    matcapTextures.push(textureLoader.load(`/textures/matcaps/${i}.png`))
}

let mixers = []

const materialSilver = new THREE.MeshMatcapMaterial({ matcap: matcapTextures[2] })
const materialOrange = new THREE.MeshMatcapMaterial({ matcap: matcapTextures[1] })

/**
 * Models
 */
const donutModel = new DonutModel(scene, materialOrange);

/**
 * Services
 */
const fontService = new FontService(scene);
const gltfService = new GLTFService(scene);

/**
 * Objects
 */
donutModel.initializeDonuts()
fontService.addFontGeometry("Flutter <3", materialSilver, {
    position: {
        x: 1,
        y: 0,
        z: 0
    }
})

gltfService.addToScene('models/flutter.glb', {
    position: {
        x: -1.5,
        y: -1,
        z: 0
    }
}).then((mixer) => {
    mixers.push(mixer)
})

const gltfLoader = new GLTFLoader()

let mixer = null

// gltfLoader.load(
//     '/models/flutter.glb',
//     (gltf) => {
//         scene.add(gltf.scene)

//         // Animation
//         mixer = new THREE.AnimationMixer(gltf.scene)
//         const action = mixer.clipAction(gltf.animations[0])
//         action.play()
//     }
// )

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Camera
 */
// Base camera
const camera = new Camera(scene, sizes)
camera.setControls(canvas);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    donutModel.update();
    camera.update();

    // Render
    renderer.render(scene, camera.get())

    // Mixers
    mixers.forEach((mixer) => {
        mixer.update(deltaTime)
    })

    // Model animation
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick()