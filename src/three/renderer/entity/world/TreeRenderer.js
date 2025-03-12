import GameObjects from '../../../utils/GameObjects.js'
import GooseGame from '../../../GooseGame.js'

class TreeEntity {
    constructor(x, y, z) {
        GameObjects.tree.then((tree) => {
            this.mesh = tree.clone()
            this.mesh.position.set(x, y, z)
            GooseGame.instance.renderer.sceneManager.add(this.mesh)
        })
    }

    dispose() {
        this.tree.dispose()
    }
}

export default TreeEntity
