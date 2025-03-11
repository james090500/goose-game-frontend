import GooseGame from '../GooseGame.js'
import { Euler, Vector3, Clock, Raycaster } from 'three'

class LocalPlayer {
    playerHeight = 2 // Height of player
    moveSpeed = 7 // Speed of movement
    jumpSpeed = 10 // Speed of jump
    jumpDuration = 0.4 // Duration of jump
    fallVelocity = 0

    constructor() {
        this.camera = GooseGame.instance.renderer.sceneManager.camera

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
    updateInteraction(delta) {
        const mouse = GooseGame.instance.input.mouse
        if (mouse.LeftClick) {
            mouse.LeftClick = false

            const eggHeight = this.camera.position
                .clone()
                .sub(new Vector3(0, this.playerHeight, 0))
            GooseGame.instance.gameManager.multiplayer.newEgg(eggHeight)
        }
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

        const keys = GooseGame.instance.input.keys

        //Calculate running
        let moveSpeed = this.moveSpeed * delta
        if (keys.ShiftLeft && !this.swimming) {
            moveSpeed = (this.moveSpeed + 2) * delta
        } else if (this.swimming) {
            moveSpeed = (this.moveSpeed - 2) * delta
        }

        // Update movement check based on direction
        if (keys.KeyW && !this.checkCollision(forward)) {
            this.camera.position.add(forward.clone().multiplyScalar(moveSpeed))
        }
        if (keys.KeyS && !this.checkCollision(backward)) {
            this.camera.position.add(backward.clone().multiplyScalar(moveSpeed))
        }
        if (keys.KeyA && !this.checkCollision(left)) {
            this.camera.position.add(left.clone().multiplyScalar(moveSpeed))
        }
        if (keys.KeyD && !this.checkCollision(right)) {
            this.camera.position.add(right.clone().multiplyScalar(moveSpeed))
        }
        if (keys.Space && !this.jumping && !this.falling) {
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
            this.camera.position.sub(new Vector3(0, this.jumpSpeed * delta, 0)) // Down
        }
        this.checkGroundCollision()

        //Check if swimming
        if (
            this.camera.position.y <
            GooseGame.instance.gameManager.world.seaHeight
        ) {
            this.swimming = true
        } else {
            this.swimming = false
        }

        // Make sure player never leaves this world
        if (this.camera.position.y < 0) {
            this.camera.position.set(
                0,
                GooseGame.instance.gameManager.world.maxHeight,
                0
            )
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
            GooseGame.instance.renderer.sceneManager.scene.children
        )
        return intersects.length > 0
    }

    checkGroundCollision() {
        if (!GooseGame.instance.gameManager.world.worldRenderer.mesh) return

        const raycaster = new Raycaster()
        const downVector = new Vector3(0, -1, 0)

        raycaster.set(this.camera.position, downVector)
        const intersects = raycaster.intersectObjects(
            GooseGame.instance.renderer.sceneManager.scene.children
        )

        if (intersects.length > 0) {
            const terrainHeight = intersects[0].point.y + this.playerHeight
            if (this.camera.position.y <= terrainHeight) {
                this.camera.position.y = terrainHeight // Prevent sinking
                this.fallVelocity = 0
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
            GooseGame.instance.gameManager.multiplayer.updatePosition(
                clonedPosition
            )
            this.previousPosition.copy(this.camera.position)
        }

        if (!this.camera.rotation.equals(this.previousRotation)) {
            const clonedRotation = this.camera.rotation.clone()
            GooseGame.instance.gameManager.multiplayer.updateRotation(
                clonedRotation
            )
            this.previousRotation.copy(this.camera.rotation)
        }
    }
    /**
     * Update the controls
     */
    render(delta) {
        this.updateInteraction(delta)
        this.updateMovement(delta)
    }
}

export default LocalPlayer
