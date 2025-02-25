import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three'

class Block {
    constructor() {
        this.mesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshStandardMaterial({ color: 0x00ff00 })
        )
    }
}

export default Block
