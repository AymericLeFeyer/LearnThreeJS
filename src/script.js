import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

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

/**
 * Object
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTextures[params.currentIndex - 1] })
const donuts = [];

for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)
    randomPos(donut)
    scene.add(donut)
    donuts.push(donut)
}

function randomPos(obj) {
    obj.position.x = (Math.random() - 0.5) * 10
    obj.position.y = (Math.random() - 0.5) * 10
    obj.position.z = (Math.random() - 0.5) * 10
    obj.rotation.x = Math.random() * Math.PI
    obj.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    obj.scale.set(scale, scale, scale)
}

params.resetPos = () => {
    donuts.forEach((donut) => {
        randomPos(donut)
    });
}
/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello, \nWorld.',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
    }
)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    donuts.forEach((donut) => {
        donut.rotation.x += 0.01 * Math.random()
        donut.rotation.y += 0.01 * Math.random()

    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// Debug
const gui = new dat.GUI()

gui.add(camera.position, 'z').min(2).max(5).step(0.2).name('Camera')
gui.add(params, 'currentIndex').min(1).max(8).step(1).name('Texture').onChange(() => {
    material.matcap = matcapTextures[params.currentIndex - 1]
})
gui.add(params, 'resetPos')

tick()