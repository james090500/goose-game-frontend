import GooseGame from '../GooseGame.js'
import ShotRenderer from '../renderer/entity/ShotRenderer.js'
import { Box3, Raycaster, Vector3, Line3, Ray } from 'three'

class ShotEntity {
    constructor(pos, dir) {
        this.renderer = new ShotRenderer()
        this.renderer.mesh.layers.set(1)

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

        const checkHitPlayer = this.checkHitPlayer()
        console.log(checkHitPlayer)

        if (this.checkCollision(this.direction) || checkHitPlayer) {
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

        raycaster.layers.set(0)

        const intersects = raycaster.intersectObjects(
            GooseGame.instance.renderer.sceneManager.scene.children
        )

        if (intersects.length > 0) {
            return true
        }

        return false
    }

    // Function to check ray-capsule intersection
    checkHitPlayer() {
        // Create a Ray
        const ray = new Ray(this.renderer.mesh.position, this.direction)

        const { start, end, radius } =
            GooseGame.instance.gameManager.thePlayer.renderer.playerCollider

        // Project ray onto capsule segment
        const capsuleSegment = new Line3(start, end)
        const closestPoint = new Vector3()
        capsuleSegment.closestPointToPoint(ray.origin, true, closestPoint)

        // Distance from ray to capsule's central line
        const distance = ray.distanceSqToPoint(closestPoint)

        // Check if the distance is within the capsule's radius squared
        if (distance <= 0.5) {
            GooseGame.instance.gameManager.thePlayer.hasBeenShot()
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
