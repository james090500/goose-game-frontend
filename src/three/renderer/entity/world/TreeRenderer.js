import GameObjects from '../../../utils/GameObjects.js'
import GooseGame from '../../../GooseGame.js'

class TreeEntity {
    constructor(x, y, z) {
        GameObjects.tree.then((tree) => {
            this.object = tree.clone()
            this.object.position.set(x, y, z)
            GooseGame.instance.renderer.sceneManager.add(this.object)
        })
    }

    dispose() {
        this.tree.dispose()
    }
}

export default TreeEntity
