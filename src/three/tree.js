import GameObjects from './gameobjects.js'
import TheGame from '.'
import { Vector3 } from 'three'

class Tree {
    constructor(x, y, z) {
        this.object = GameObjects.tree.clone()
        this.object.position.set(x, y, z)
        TheGame.instance.scene.add(this.object)
    }

    dispose() {
        this.tree.dispose()
    }
}

export default Tree
