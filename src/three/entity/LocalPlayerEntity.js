import GooseGame from '../GooseGame.js'
import { Vector3 } from 'three'
import LocalPlayerRenderer from '../renderer/entity/LocalPlayerRenderer.js'

class LocalPlayerEntity {
    playerHeight = 2 // Height of player
    moveSpeed = 100 // Speed of movement
    jumpSpeed = 1400 // Speed of jump
    jumpDuration = 0.4 // Duration of jump

    //Booleans
    falling = false
    jumping = false
    swimming = false

    constructor() {
        this.renderer = new LocalPlayerRenderer()
        this.respawn()
    }

    updateInteraction(delta) {
        const mouse = GooseGame.instance.input.mouse
        if (mouse.LeftClick) {
            mouse.LeftClick = false

            const camera = GooseGame.instance.renderer.sceneManager.camera

            const eggHeight = camera.position
            const eggDirection = new Vector3(0, 0, -1)

            camera.getWorldDirection(eggDirection)

            GooseGame.instance.gameManager.multiplayer.newEgg(
                eggHeight,
                eggDirection
            )
        }
    }
    // Update movement
    updateMovement(delta) {
        const keys = GooseGame.instance.input.keys

        //Calculate running
        let moveSpeed = this.moveSpeed * delta
        if (keys.ShiftLeft && !this.swimming) {
            moveSpeed = (this.moveSpeed + 10) * delta
        } else if (this.swimming) {
            moveSpeed = (this.moveSpeed - 20) * delta
        }

        // Update movement check based on direction
        if (keys.KeyW) {
            this.renderer.move('forward', moveSpeed)
        }
        if (keys.KeyS) {
            this.renderer.move('backward', moveSpeed)
        }
        if (keys.KeyA) {
            this.renderer.move('left', moveSpeed)
        }
        if (keys.KeyD) {
            this.renderer.move('right', moveSpeed)
        }
        if (keys.Space && !this.jumping && !this.falling) {
            this.renderer.jump()
        }
    }

    hasBeenShot() {
        this.respawn()
    }

    respawn() {
        const randX = Math.random() * 512 - 256
        const randZ = Math.random() * 512 - 256
        this.renderer.setPosition(new Vector3(randX, 50, randZ))
    }

    /**
     * Update the controls
     */
    render(delta) {
        this.updateMovement(delta)
        this.updateInteraction(delta)
        this.renderer.render(delta)
    }
}

export default LocalPlayerEntity
