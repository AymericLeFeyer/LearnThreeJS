import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



export class Camera {

    constructor(scene, sizes) {
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        this.camera.position.z = 3
        this.scene = scene

        this.scene.add(this.camera)
    }

    setControls(canvas) {
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
    }

    get() {
        return this.camera
    }

    update() {
        this.controls.update()
    }

}