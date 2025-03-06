import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import GooseGame from '../GooseGame.js'

class Controls {
    keys = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        Space: false,
        ShiftLeft: false,
    } // Movement keys

    constructor() {
        // Controls
        this.controls = new PointerLockControls(
            GooseGame.instance.renderer.sceneManager.camera,
            GooseGame.instance.renderer.renderer.domElement
        )
        this.controls.addEventListener(
            'lock',
            GooseGame.instance.config.ON_LOCK
        )
        this.controls.addEventListener(
            'unlock',
            GooseGame.instance.config.ON_UNLOCK
        )
        this.controls.lookSpeed = 0.1

        // Keyboard event listeners
        window.addEventListener('keydown', (event) => {
            if (this.keys.hasOwnProperty(event.code)) {
                this.keys[event.code] = true
            }
        })
        window.addEventListener('keyup', (event) => {
            if (this.keys.hasOwnProperty(event.code)) {
                this.keys[event.code] = false
            }
        })
    }
    /**
     * Lock the games controls
     */
    lock() {
        this.controls.lock()
    }
}

export default Controls
