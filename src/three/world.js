import {
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    Box3,
} from 'three'
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js'

class World {
    constructor() {
        //Ground
        let loader = new TextureLoader()
        const texture = loader.load('grass.png', function (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping
            texture.offset.set(0, 0)
            texture.repeat.set(4096 / 32, 4096 / 32)
        })

        const geometry = new PlaneGeometry(4096, 4096, 256, 256)
        const position = geometry.attributes.position
        const noise = new ImprovedNoise()

        const scale = 5 // Lower frequency for larger hills/valleys
        const height = 10 // Height of mountains
        const noiseOffset = 439.3298492 // Random starting point Math.random() * 1000

        for (let i = 0; i < position.count; i++) {
            let x = position.getX(i) * scale
            let y = position.getY(i) * scale

            // Get Perlin noise value
            let z = noise.noise(x, y, noiseOffset)

            // Apply easing for smoother transitions
            z = (z + 1) / 2 // Normalize from [-1, 1] to [0, 1]
            z = z ** 2.5 // Exaggerate valleys & plateaus (eases terrain)

            // Add a threshold for flat areas (plains)
            if (z < 0.3) z = 0 // Low noise = flat plains

            position.setZ(i, z * height)
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
    }
    getWorld() {
        return this.world
    }
}

export default World
