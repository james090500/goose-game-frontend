import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import GooseGame from '../GooseGame.js'

class Controls {
    mouse = {
        LeftClick: false,
        RightClick: false,
    }

    keys = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        Space: false,
        ShiftLeft: false,
    } // Movement keys`

    constructor() {
        // Controls
        this.controls = new PointerLockControls(
            GooseGame.instance.renderer.sceneManager.camera,
            GooseGame.instance.renderer.renderer.domElement
        )

        this.controls.addEventListener('lock', (event) => {
            GooseGame.instance.config.PAUSED = false
            GooseGame.instance.config.ON_LOCK(event)
        })
        this.controls.addEventListener('unlock', (event) => {
            GooseGame.instance.config.PAUSED = true
            GooseGame.instance.config.ON_UNLOCK(event)
        })
        this.controls.lookSpeed = 0.1

        // Mouse events
        window.addEventListener('mousedown', (event) => {
            if (!GooseGame.instance.config.PAUSED) {
                if (event.button == 0) {
                    this.mouse.LeftClick = true
                } else if (event.button == 2) {
                    this.mouse.RightClick = true
                }
            }
        })

        // Keyboard event listeners
        window.addEventListener('keydown', (event) => {
            if (!GooseGame.instance.config.PAUSED) {
                if (this.keys.hasOwnProperty(event.code)) {
                    this.keys[event.code] = true
                }
            }
        })
        window.addEventListener('keyup', (event) => {
            if (!GooseGame.instance.config.PAUSED) {
                if (this.keys.hasOwnProperty(event.code)) {
                    this.keys[event.code] = false
                }
            }
        })
    }
    /**
     * Lock the controls
     */
    lock() {
        //https://issues.chromium.org/issues/40662608
        GooseGame.instance.renderer.renderer.domElement.requestPointerLock({
            unadjustedMovement: true,
        })
    }
}

export default Controls
