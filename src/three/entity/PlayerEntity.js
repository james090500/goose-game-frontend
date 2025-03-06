import PlayerRenderer from '../renderer/entity/PlayerRenderer.js'

class Player {
    constructor(id, username) {
        this.id = id
        this.username = username
        this.renderer = new PlayerRenderer(username)
    }

    setPosition(position) {
        this.renderer.setPosition(position.x, position.y - 2, position.z)
    }

    setRotation(rotation) {
        this.renderer.setRotation(rotation.x, rotation.y, rotation.z)
    }
}

export default Player
