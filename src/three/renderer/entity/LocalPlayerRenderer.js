import GooseGame from '../../GooseGame.js'
import { Euler, Vector3, Raycaster, Clock } from 'three'
import { Capsule } from 'three/addons/math/Capsule.js'

class LocalPlayerRenderer {
    colliderHeight = 2
    playerVelocity = new Vector3()
    clock = new Clock()
    jumpStartTime = 0

    constructor() {
        this.camera = GooseGame.instance.renderer.sceneManager.camera

        this.playerCollider = new Capsule(
            new Vector3(0, 0, 0),
            new Vector3(0, 2, 0),
            1
        )
        this.playerCollider.name = 'LocalPlayer'

        // Store the previous position and rotation
        this.previousPosition = new Vector3()
        this.previousRotation = new Euler()
        this.previousPosition.copy(this.camera.position)
        this.previousRotation.copy(this.camera.rotation)
    }

    move(direction, moveSpeed) {
        const dir = new Vector3()
        this.camera.getWorldDirection(dir)
        dir.y = 0
        dir.normalize()

        switch (direction) {
            case 'backward':
                dir.negate()
                break
            case 'left':
                dir.cross(new Vector3(0, -1, 0))
                dir.normalize()
                break
            case 'right':
                dir.cross(new Vector3(0, 1, 0))
                dir.normalize()
                break
        }

        if (this.checkCollision(dir)) {
            return
        }

        this.playerVelocity.add(dir.multiplyScalar(moveSpeed))
    }

    // Initiate jump
    jump() {
        const thePlayer = GooseGame.instance.gameManager.thePlayer
        thePlayer.jumping = true
        this.jumpStartTime = this.clock.getElapsedTime()
    }

    // Update movement
    updateMovement(delta) {
        const thePlayer = GooseGame.instance.gameManager.thePlayer

        // Handle jumping
        if (thePlayer.jumping) {
            const elapsedTime = this.clock.getElapsedTime() - this.jumpStartTime
            if (elapsedTime < thePlayer.jumpDuration) {
                this.playerVelocity.y += 100 * delta
            } else {
                thePlayer.jumping = false
            }
        }

        // Make the character fall
        if (thePlayer.falling && !thePlayer.jumping) {
            this.playerVelocity.y -= 100 * delta
        }
        this.checkGroundCollision()

        //Check if swimming
        if (
            this.playerVelocity.y <
            GooseGame.instance.gameManager.world.seaHeight
        ) {
            this.swimming = true
        } else {
            this.swimming = false
        }

        // Make sure player never leaves this world
        if (this.playerCollider.end.y < 0) {
            this.setPosition(new Vector3(0, 100, 0))
        }

        // Damping to slow down the player gradually
        this.playerVelocity.addScaledVector(this.playerVelocity, -10 * delta)
        const deltaPosition = this.playerVelocity.clone().multiplyScalar(delta)
        this.playerCollider.translate(deltaPosition)

        this.camera.position.copy(this.playerCollider.end)
    }

    // Function to check movement collision
    checkCollision(direction) {
        const raycaster = new Raycaster(
            this.playerCollider.end,
            direction,
            0,
            2
        )
        const intersects = raycaster.intersectObjects(
            GooseGame.instance.renderer.sceneManager.scene.children
        )
        return intersects.length > 0
    }

    checkGroundCollision() {
        if (!GooseGame.instance.gameManager.world.worldRenderer.mesh) return

        const thePlayer = GooseGame.instance.gameManager.thePlayer
        const raycaster = new Raycaster()
        const downVector = new Vector3(0, -1, 0)

        raycaster.set(this.playerCollider.end, downVector, 0, 2)
        const intersects = raycaster.intersectObjects(
            GooseGame.instance.renderer.sceneManager.scene.children
        )

        if (intersects.length > 0) {
            const terrainHeight = intersects[0].point.y
            if (this.playerCollider.start.y <= terrainHeight) {
                this.playerCollider.start.y = terrainHeight
                this.playerCollider.end.y = terrainHeight + this.colliderHeight
                thePlayer.falling = false
            } else {
                thePlayer.falling = true
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

    setPosition(position) {
        let [x, y, z] = position

        this.playerCollider.start.set(x, y, z)
        this.playerCollider.end.set(x, y + this.colliderHeight, z)
        this.playerCollider.radius = 1
        this.camera.position.copy(this.playerCollider.end)
    }

    /**
     * Update the controls
     */
    render(delta) {
        this.updateMovement(delta)
    }
}

export default LocalPlayerRenderer
