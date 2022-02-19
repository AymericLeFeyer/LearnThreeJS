import './style.css'
import * as THREE from 'three'
import { FontService } from "./services/font"
import { DonutModel } from "./models/donuts"
import { Camera } from "./cameras/camera"

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
const params = {
    currentIndex: 2
}
for (let i = 1; i <= numberTextures; i++) {
    matcapTextures.push(textureLoader.load(`/textures/matcaps/${i}.png`))
}

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTextures[params.currentIndex - 1] })

/**
 * Models
 */
const donutModel = new DonutModel(scene, material);

/**
 * Services
 */
const fontService = new FontService(scene);

/**
 * Objects
 */
donutModel.initializeDonuts()
fontService.addFontGeometry("Salut", material)


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
// const clock = new THREE.Clock()

const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    donutModel.update();
    camera.update();

    // Render
    renderer.render(scene, camera.get())

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick()