import TreeRenderer from '../../renderer/entity/world/TreeRenderer.js'

class TreeEntity {
    constructor(x, y, z) {
        this.renderer = new TreeRenderer(x, y, z)
    }
}

export default TreeEntity
