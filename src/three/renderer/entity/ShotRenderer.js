import { Mesh, MeshStandardMaterial, CapsuleGeometry } from 'three'
import GooseGame from '../../GooseGame'

class ShotRenderer {
    constructor() {
        this.mesh = new Mesh(
            new CapsuleGeometry(1, 1, 1, 6),
            new MeshStandardMaterial({
                color: 0xf0ead6,
            })
        )
        GooseGame.instance.renderer.sceneManager.add(this.mesh)

        setTimeout(() => {
            GooseGame.instance.renderer.sceneManager.remove(this.mesh)
        }, 30000)
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z)
    }
}

export default ShotRenderer
