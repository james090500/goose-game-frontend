import GameObjects from '../../../utils/GameObjects.js'
import GooseGame from '../../../GooseGame.js'

class TreeEntity {
    constructor(x, y, z) {
        GameObjects.tree.then((tree) => {
            this.mesh = tree.clone()
            this.mesh.position.set(x, y, z)
            GooseGame.instance.renderer.sceneManager.add(this.mesh)

            // console.log(1)
            // GooseGame.instance.gameManager.world.octree.fromGraphNode(this.mesh)
        })
    }

    dispose() {
        this.tree.dispose()
    }
}

export default TreeEntity
