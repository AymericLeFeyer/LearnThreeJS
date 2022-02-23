import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

export class GLTFService {
    gltfLoader = new GLTFLoader()

    constructor(scene) {
        this.scene = scene
    }

    async addToScene(source, props) {
        const gltf = await this.gltfLoader.loadAsync(source)

        const object = gltf.scene;

        object.position.x = props?.position?.x ?? 0
        object.position.y = props?.position?.y ?? 0
        object.position.z = props?.position?.z ?? 0

        this.scene.add(object)

        const mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0])
        action.play()

        return mixer
    }
}
