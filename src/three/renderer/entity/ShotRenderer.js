import { Mesh, MeshStandardMaterial, CapsuleGeometry } from 'three'
import GooseGame from '../../GooseGame'

class ShotRenderer {
    constructor() {
        this.mesh = new Mesh(
            new CapsuleGeometry(0.5, 0.5, 1, 6),
            new MeshStandardMaterial({
                color: 0xf0ead6,
            })
        )

        GooseGame.instance.renderer.sceneManager.add(this.mesh)
    }

    setPosition(position) {
        this.mesh.position.set(position.x, position.y, position.z)
    }

    dispose() {
        GooseGame.instance.renderer.sceneManager.remove(this.mesh)
    }
}

export default ShotRenderer
