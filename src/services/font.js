import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as THREE from 'three'

export class FontService {
    fontLoader = new FontLoader()
    fontSource = '/fonts/helvetiker_regular.typeface.json'
    font;

    constructor(scene) {
        this.scene = scene
        this.loadFont()
    }

    async loadFont() {
        this.font = await this.fontLoader.loadAsync(this.fontSource)
    }

    async addFontGeometry(text, material, props) {

        if (this.font == null) {
            await this.loadFont();
        }

        const textGeometry = new TextGeometry(
            text,
            {
                font: this.font,
                size: props?.size ?? 0.5,
                height: props?.height ?? 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
            }
        )
        textGeometry.center()
        const mesh = new THREE.Mesh(textGeometry, material)
        mesh.position.x = props?.position?.x ?? 0
        mesh.position.y = props?.position?.y ?? 0
        mesh.position.z = props?.position?.z ?? 0
        this.scene.add(mesh)

        return mesh
    }
}
