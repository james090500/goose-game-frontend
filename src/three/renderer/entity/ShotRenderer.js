import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import GooseGame from '../../GooseGame'

class ShotRenderer {
    constructor() {
        this.mesh = new Mesh(new SphereGeometry(), new MeshStandardMaterial())
        GooseGame.instance.renderer.sceneManager.add(this.mesh)
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z)
    }

    setRotation(x, y, z) {
        this.mesh.rotation.set(x, y, z)
    }
}

export default ShotRenderer
