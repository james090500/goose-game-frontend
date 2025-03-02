import { Mesh, PlaneGeometry, MeshStandardMaterial, DoubleSide } from 'three'
import GooseGame from '..'

class Sea {
    constructor() {
        let worldSize = GooseGame.instance.world.worldSize

        this.sea = new Mesh(
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

        this.sea.rotation.x = -Math.PI / 2
        this.sea.position.y = GooseGame.instance.world.seaHeight

        GooseGame.instance.scene.add(this.sea)
    }
}

export default Sea
