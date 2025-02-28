import {
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    RepeatWrapping,
} from 'three'
import { Noise } from 'noisejs'
import Tree from './entity/tree.js'

class World {
    maxHeight = 0
    worldSize = 1024

    worldNoise = new Noise(65536)
    biomeNoise = new Noise(65536)

    constructor() {
        //Ground
        let loader = new TextureLoader()
        const texture = loader.load('grass.png', function (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping
            texture.offset.set(0, 0)
            texture.repeat.set(32, 32)
        })

        const geometry = new PlaneGeometry(
            this.worldSize,
            this.worldSize,
            this.worldSize / 16,
            this.worldSize / 16
        )
        const position = geometry.attributes.position

        // Height Map
        for (let i = 0; i < position.count; i++) {
            const frequency = 10
            let x = position.getX(i)
            let y = position.getY(i)

            let nx = x / this.worldSize - 0.5
            let ny = y / this.worldSize - 0.5

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

        this.world = new Mesh(
            geometry,
            new MeshStandardMaterial({
                map: texture,
            })
        )

        this.world.rotation.x = -Math.PI / 2

        // Trees
        this.generateTrees()
    }
    getWorld() {
        return this.world
    }
    getHeight(x, z) {
        const worldSize = this.worldSize
        const segments = worldSize / 16
        const pos = this.world.geometry.attributes.position.array

        // Convert world (x, z) to local grid space
        const halfSize = worldSize / 2
        const gridX = ((x + halfSize) / worldSize) * segments
        const gridZ = ((z + halfSize) / worldSize) * segments

        const x1 = Math.floor(gridX) // Bottom-left vertex in the grid
        const x2 = Math.min(x1 + 1, segments) // Right neighbor
        const z1 = Math.floor(gridZ) // Bottom-left vertex in the grid
        const z2 = Math.min(z1 + 1, segments) // Top neighbor

        const idx = (gx, gz) => (gz * (segments + 1) + gx) * 3
        const y11 = pos[idx(x1, z1) + 2] // Bottom-left vertex height
        const y12 = pos[idx(x1, z2) + 2] // Top-left vertex height
        const y21 = pos[idx(x2, z1) + 2] // Bottom-right vertex height
        const y22 = pos[idx(x2, z2) + 2] // Top-right vertex height

        //Interpolate in the x-direction (left-to-right):
        const r1 = y11 * (1 - (gridX - x1)) + y21 * (gridX - x1)
        const r2 = y12 * (1 - (gridX - x1)) + y22 * (gridX - x1)

        //Interpolate in the z-direction (bottom-to-top):
        return r1 * (1 - (gridZ - z1)) + r2 * (gridZ - z1)
    }
    generateTrees() {
        for (let x = 0; x < this.worldSize; x++) {
            for (let z = 0; z < this.worldSize; z++) {
                const worldX = x - this.worldSize / 2 // Shifting 0 to 1023 into -512 to +512
                const worldZ = z - this.worldSize / 2 // Same for Z axis

                const frequency = 5000

                let nx = worldX / this.worldSize - 0.5
                let nz = worldZ / this.worldSize - 0.5

                // Get result
                let noiseResult = this.biomeNoise.perlin2(
                    frequency * nx,
                    frequency * nz
                )

                // Normalize from [-1, 1] to [0, 1]
                noiseResult = (noiseResult + 1) / 2

                if (noiseResult > 0.85) {
                    let y = this.getHeight(worldX, worldZ)
                    new Tree(worldX, y, worldZ)
                }
            }
        }
    }
}

export default World
