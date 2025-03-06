import { PerspectiveCamera } from 'three'

class Camera {
    constructor() {
        this.camera = new PerspectiveCamera(
            75,
            GooseGame.instance.config.CANVAS.clientWidth /
                GooseGame.instance.config.CANVAS.clientHeight,
            0.1,
            520
        )
        this.camera.position.y = 30
        this.camera.position.x = 250
        this.camera.position.z = 250

        return this.camera
    }
}

export default Camera
