import { Mesh, PlaneGeometry, MeshStandardMaterial, DoubleSide } from 'three'
import GooseGame from '../../GooseGame.js'

class Sea {
    seaHeight = 2

    constructor(worldSize) {
        this.mesh = new Mesh(
            new PlaneGeometry(
                worldSize * 2,
                worldSize * 2,
                worldSize / 16,
                worldSize / 16
            ),
            new MeshStandardMaterial({
                color: 0x006994,
                opacity: 0.75,
                transparent: true,
                side: DoubleSide,
            })
        )

        this.mesh.rotation.x = -Math.PI / 2

        GooseGame.instance.renderer.sceneManager.add(this.mesh)
    }
    setSeaHeight(seaHeight) {
        this.mesh.position.y = seaHeight
    }
    render(time) {
        const seaPosition = this.mesh.geometry.attributes.position
        for (let i = 0; i < seaPosition.count; i++) {
            const waveAmount = 0.5
            const waveSpeed = time * 2
            const wave = Math.sin(i / 5 + (waveSpeed + i) / 7) * waveAmount
            if (i == 0) {
            }
            seaPosition.setZ(i, wave)
        }
        seaPosition.needsUpdate = true
    }
}

export default Sea
