import GameObjects from '../utils/gameobjects.js'
import TheGame from '../index.js'

class Tree {
    constructor(x, y, z) {
        GameObjects.tree.then((tree) => {
            this.object = tree.clone()
            this.object.position.set(x, y, z)
            TheGame.instance.scene.add(this.object)
        })
    }

    dispose() {
        this.tree.dispose()
    }
}

export default Tree
