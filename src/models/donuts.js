import * as THREE from 'three'

export class DonutModel {
    donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    donuts = [];

    numberDonuts = 100

    constructor(scene, material) {
        this.scene = scene;
        this.material = material
    }

    initializeDonuts() {
        for (let i = 0; i < this.numberDonuts; i++) {
            const donut = new THREE.Mesh(this.donutGeometry, this.material)
            this.randomPos(donut)
            this.scene.add(donut)
            this.donuts.push(donut)
        }
    }

    randomPos(obj) {
        obj.position.x = (Math.random() - 0.5) * 10
        obj.position.y = (Math.random() - 0.5) * 10
        obj.position.z = (Math.random() - 0.5) * 10
        obj.rotation.x = Math.random() * Math.PI
        obj.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        obj.scale.set(scale, scale, scale)
    }

    update() {
        this.donuts.forEach((donut) => {
            donut.rotation.x += 0.01 * Math.random()
            donut.rotation.y += 0.01 * Math.random()
        })
    }

}