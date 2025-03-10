import ShotRenderer from '../renderer/entity/ShotRenderer.js'

class ShotEntity {
    constructor(position) {
        this.renderer = new ShotRenderer()
        this.setPosition(position)
    }

    setPosition(position) {
        this.renderer.setPosition(position.x, position.y, position.z)
    }
}

export default ShotEntity
