import GooseGame from '../GooseGame.js'
import ShotRenderer from '../renderer/entity/ShotRenderer.js'
import { Box3, Raycaster, Vector3 } from 'three'

class ShotEntity {
    constructor(pos, dir) {
        this.renderer = new ShotRenderer()

        this.boundingBox = new Box3().setFromObject(this.renderer.mesh)

        this.direction = new Vector3(dir.x, dir.y, dir.z)

        const position = new Vector3(pos.x, pos.y, pos.z)
        position.add(dir)

        this.renderer.setPosition(position)

        // Variables
        this.speed = 20
        this.age = 0
        this.maxAge = 60

        // Make Tickable
        GooseGame.instance.gameManager.addTickable(this)
    }

    moveEgg(delta) {
        // Apply gravity: acceleration effect over time
        const gravity = 0.25
        this.direction.y -= gravity * delta // Increase downward velocity over time

        const newDir = this.direction.clone()
        newDir.multiplyScalar(this.speed * delta)

        this.renderer.mesh.position.add(newDir)

        if (this.checkCollision(this.direction)) {
            this.dispose()
        }
    }

    // Function to check movement collision
    checkCollision(direction) {
        const raycaster = new Raycaster(
            this.renderer.mesh.position,
            direction,
            0,
            1
        )
        const intersects = raycaster.intersectObjects(
            GooseGame.instance.renderer.sceneManager.scene.children
        )

        const temp = raycaster.intersectObject(
            GooseGame.instance.renderer.sceneManager.camera
        )
        if (temp.length > 0) {
            console.log(temp)
        }

        if (intersects.length > 0) {
            // console.log(intersects[0])
            if (intersects[0].name == 'LocalPlayer') {
                GooseGame.instance.gameManager.localPlayer.hasBeenShot()
            }

            return true
        }

        return false
    }

    tick(delta) {
        this.age += 1 * delta
        if (this.age > this.maxAge) {
            this.dispose()
            return
        }

        this.moveEgg(delta)
    }

    dispose() {
        this.renderer.dispose()
        GooseGame.instance.gameManager.removeTickable(this)
    }
}

export default ShotEntity
