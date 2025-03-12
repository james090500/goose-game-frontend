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

        return this.camera
    }
}

export default Camera
