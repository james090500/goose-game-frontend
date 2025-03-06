import TreeRenderer from '../../renderer/entity/TreeRenderer.js'

class TreeEntity {
    constructor(x, y, z) {
        this.renderer = new TreeRenderer(x, y, z)
    }
}

export default TreeEntity
