import { Noise } from 'noisejs'
import Tree from '../entity/tree.js'
import TheGame from '../index.js'

class Terrain {
    constructor() {
        this.worldNoise = new Noise(65536)
        this.biomeNoise = new Noise(65536)

        this.generateWorld()
        this.generateTrees()
    }
    generateWorld() {
        const position =
            TheGame.instance.world.getWorld().geometry.attributes.position

        // Height Map
        for (let i = 0; i < position.count; i++) {
            const frequency = 10
            let x = position.getX(i)
            let y = position.getY(i)

            let nx = x / TheGame.instance.world.worldSize - 0.5
            let ny = y / TheGame.instance.world.worldSize - 0.5

            // Get Perlin noise value
            let noiseResult = this.worldNoise.perlin2(
                frequency * nx,
                frequency * ny
            )

            // Normalize from [-1, 1] to [0, 1]
            noiseResult = (noiseResult + 1) / 2

            // Exaggerate valleys & plateaus (eases terrain)
            let height = noiseResult * 50

            // Set max world height
            if (this.maxHeight < height) {
                this.maxHeight = height
            }

            // Set final position
            position.setZ(i, height)
        }

        // Ensure Three.js updates the geometry
        position.needsUpdate = true
    }
    generateTrees() {
        const worldSize = TheGame.instance.world.worldSize

        for (let x = 0; x < worldSize; x++) {
            for (let z = 0; z < worldSize; z++) {
                const worldX = x - worldSize / 2 // Shifting 0 to 1023 into -512 to +512
                const worldZ = z - worldSize / 2 // Same for Z axis

                const frequency = 5000
                let nx = worldX / worldSize - 0.5
                let nz = worldZ / worldSize - 0.5

                // Get result
                let noiseResult = this.biomeNoise.perlin2(
                    frequency * nx,
                    frequency * nz
                )

                // Normalize from [-1, 1] to [0, 1]
                noiseResult = (noiseResult + 1) / 2

                if (noiseResult > 0.85) {
                    let y = TheGame.instance.world.getHeight(worldX, worldZ)
                    new Tree(worldX, y, worldZ)
                }
            }
        }
    }
}

export default Terrain
