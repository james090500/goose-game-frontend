import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import TheGame from './index.js'
import { Euler, Vector3, Clock, Raycaster } from 'three'

class Controls {
    playerHeight = 2 // Height of player
    moveSpeed = 5 // Speed of movement
    jumpSpeed = 10 // Speed of jump
    jumpDuration = 0.4 // Duration of jump
    keys = {
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        Space: false,
        ShiftLeft: false,
    } // Movement keys

    constructor() {
        this.options = TheGame.instance.options
        this.camera = TheGame.instance.camera
        this.renderer = TheGame.instance.renderer

        // Controls
        this.controls = new PointerLockControls(
            this.camera,
            this.renderer.domElement
        )
        this.controls.addEventListener('lock', this.options.onLock)
        this.controls.addEventListener('unlock', this.options.onUnlock)
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

        // Store the previous position and rotation
        this.previousPosition = new Vector3()
        this.previousRotation = new Euler()
        this.previousPosition.copy(this.camera.position)
        this.previousRotation.copy(this.camera.rotation)

        // Jumping state
        this.falling = false
        this.jumping = false
        this.jumpStartTime = 0
        this.clock = new Clock()
    }
    // Update movement
    updateMovement(delta) {
        // Get directions
        const forward = new Vector3(0, 0, -1)
        this.camera.getWorldDirection(forward)
        forward.y = 0
        forward.normalize()

        // Normalize camera directions
        const backward = forward.clone().negate()
        const left = forward
            .clone()
            .cross(new Vector3(0, -1, 0))
            .normalize() // Left is cross product of forward and up vector
        const right = left.clone().negate() // Right is opposite of left

        //Calculate running
        let moveSpeed = this.moveSpeed * delta
        if(this.keys.ShiftLeft) {
            // Normalize movement speed using delta
            moveSpeed = (this.moveSpeed + 2) * delta
        }

        // Update movement check based on direction
        if (this.keys.KeyW && !this.checkCollision(forward)) {
            this.camera.position.add(forward.clone().multiplyScalar(moveSpeed))
        }
        if (this.keys.KeyS && !this.checkCollision(backward)) {
            this.camera.position.add(backward.clone().multiplyScalar(moveSpeed))
        }
        if (this.keys.KeyA && !this.checkCollision(left)) {
            this.camera.position.add(left.clone().multiplyScalar(moveSpeed))
        }
        if (this.keys.KeyD && !this.checkCollision(right)) {
            this.camera.position.add(right.clone().multiplyScalar(moveSpeed))
        }
        if (this.keys.Space && !this.jumping && !this.falling) {
            this.jump()
        }

        // Handle jumping
        if (this.jumping) {
            const elapsedTime = this.clock.getElapsedTime() - this.jumpStartTime
            if (elapsedTime < this.jumpDuration) {
                const jumpHeight =
                    Math.sin((elapsedTime / this.jumpDuration) * Math.PI) *
                    this.jumpSpeed *
                    delta
                this.camera.position.y += jumpHeight
            } else {
                this.jumping = false
            }
        }

        // Make the character fall
        if (this.falling && !this.jumping) {
            //TODO velocity
            this.camera.position.add(new Vector3(0, -this.jumpSpeed * delta, 0)) // Down
        }
        this.checkGroundCollision()

        // Make sure player never leaves this world
        if (this.camera.position.y < 0) {
            this.camera.position.set(0, TheGame.instance.world.maxHeight, 0)
        }
    }

    // Initiate jump
    jump() {
        this.jumping = true
        this.jumpStartTime = this.clock.getElapsedTime()
    }

    // Function to check movement collision
    checkCollision(direction) {
        const raycaster = new Raycaster(this.camera.position, direction, 0, 1)
        const intersects = raycaster.intersectObjects(
            TheGame.instance.scene.children
        )
        return intersects.length > 0
    }

    checkGroundCollision() {
        const raycaster = new Raycaster()
        const downVector = new Vector3(0, -1, 0)

        raycaster.set(this.camera.position, downVector)
        const intersects = raycaster.intersectObject(
            TheGame.instance.world.getWorld()
        )

        if (intersects.length > 0) {
            const terrainHeight = intersects[0].point.y + this.playerHeight
            if (this.camera.position.y <= terrainHeight) {
                this.camera.position.y = terrainHeight // Prevent sinking
                this.falling = false
            } else {
                this.falling = true
            }
        }
    }

    /**
     * Emit movement speed if the player has moved
     * and at a rate of 20 TPS
     */
    emitMovement() {
        if (!this.camera.position.equals(this.previousPosition)) {
            const clonedPosition = this.camera.position.clone()
            TheGame.instance.multiplayer.updatePosition(clonedPosition)
            this.previousPosition.copy(this.camera.position)
        }

        if (!this.camera.rotation.equals(this.previousRotation)) {
            const clonedRotation = this.camera.rotation.clone()
            TheGame.instance.multiplayer.updateRotation(clonedRotation)
            this.previousRotation.copy(this.camera.rotation)
        }
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
        this.updateMovement(delta)
        this.controls.update(delta)
    }
}

export default Controls
