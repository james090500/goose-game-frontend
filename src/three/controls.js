import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { Vector3 } from 'three'

class Controls {
    moveSpeed = 0.2 // Speed of movement
    keys = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        Space: false,
        ShiftLeft: false,
    } // Movement keys

    constructor(camera, renderer, options) {
        this.camera = camera
        this.renderer = renderer

        // Controls
        this.controls = new PointerLockControls(camera, renderer.domElement)
        this.controls.addEventListener('lock', options.onLock)
        this.controls.addEventListener('unlock', options.onUnlock)
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
    // Update movement
    updateMovement() {
        const direction = new Vector3()
        this.camera.getWorldDirection(direction) // Get camera facing direction

        // Calculate movement vectors
        const forward = new Vector3(direction.x, 0, direction.z).normalize()
        const right = new Vector3()
            .crossVectors(this.camera.up, forward)
            .normalize()

        // Apply movement
        if (this.keys.KeyW)
            this.camera.position.add(
                forward.clone().multiplyScalar(this.moveSpeed)
            ) // Forward
        if (this.keys.KeyS)
            this.camera.position.add(
                forward.clone().multiplyScalar(-this.moveSpeed)
            ) // Backward

        if (this.keys.KeyA)
            this.camera.position.add(
                right.clone().multiplyScalar(this.moveSpeed)
            ) // Left
        if (this.keys.KeyD)
            this.camera.position.add(
                right.clone().multiplyScalar(-this.moveSpeed)
            ) // Right

        if (this.keys.Space)
            this.camera.position.add(new Vector3(0, this.moveSpeed, 0)) // Up
        if (this.keys.ShiftLeft)
            this.camera.position.add(new Vector3(0, -this.moveSpeed, 0)) // Down
    }
    /**
     * Lock the games controls
     */
    lock() {
        this.controls.lock()
    }
    /**
     * Update the controls
     */
    update(delta) {
        this.updateMovement()
        this.controls.update(delta)
    }
}

export default Controls
