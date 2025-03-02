import {
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    RepeatWrapping,
    DirectionalLight,
    HemisphereLight,
    Fog,
    Color,
    MathUtils,
} from 'three'
import GooseGame from '..'

class World {
    seaHeight = 15
    maxHeight = 0
    worldSize = 1024
    worldTime = 6000

    constructor() {
        //Ground
        let loader = new TextureLoader()
        const grassTexture = loader.load('grass.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })
        const sandTexture = loader.load('sand.png', (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping
        })

        // Sky
        GooseGame.instance.scene.background = new Color(0x99ddff)

        // Fog
        GooseGame.instance.scene.fog = new Fog(0x99ddff, 256, 512)

        // The Sun
        this.sun = new DirectionalLight(0xffffff, 3)
        GooseGame.instance.scene.add(this.sun)

        // Ambient Light
        this.ambientLight = new HemisphereLight(0xffffff, 0xffffff, 1)
        GooseGame.instance.scene.add(this.ambientLight)

        const geometry = new PlaneGeometry(
            this.worldSize,
            this.worldSize,
            this.worldSize / 16,
            this.worldSize / 16
        )

        this.world = new Mesh(
            geometry,
            new MeshStandardMaterial({
                map: grassTexture,
            })
        )

        this.world.material.onBeforeCompile = (shader) => {
            shader.uniforms.sandTexture = { value: sandTexture }
            shader.uniforms.grassTexture = { value: grassTexture }
            shader.uniforms.heightThreshold = {
                value: GooseGame.instance.world.seaHeight + 2,
            } // Change this value to control blending

            // Modify vertex shader: Pass position & UV to fragment shader
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `
                #include <common>
                varying vec2 vUv;
                varying vec3 vPosition;
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_vertex>',
                `
                #include <uv_vertex>
                vUv = uv * 32.0; // Pass UV coordinates
                vPosition = position; // Pass world position
                `
            )

            // Modify fragment shader: Use both textures & blend by height
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform sampler2D sandTexture;
                uniform sampler2D grassTexture;
                uniform float heightThreshold;
                varying vec2 vUv;
                varying vec3 vPosition;
                `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                vec4 sandColor = texture2D(sandTexture, vUv);
                vec4 grassColor = texture2D(grassTexture, vUv);

                // Blend based on height (vPosition.z)
                //float blendFactor = step(heightThreshold, vPosition.z);
                float blendFactor = smoothstep(heightThreshold - 0.5, heightThreshold + 0.5, vPosition.z);
                vec4 finalColor = mix(sandColor, grassColor, blendFactor);

                diffuseColor = finalColor;
                `
            )
        }

        this.world.rotation.x = -Math.PI / 2
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
    updateTime() {
        this.worldTime++

        // Reset if after midnight to 1 as 24000 == 0
        if (this.worldTime > 24000) {
            this.worldTime = 1
        }

        //Get the light value of the world
        const worldLight = this.getWorldLight(this.worldTime)
        this.sun.intensity = worldLight

        // Get the colour of the sky and adjust lighting
        const skyColor = new Color(this.getSkyColor(this.worldTime))
        GooseGame.instance.scene.background = skyColor
        GooseGame.instance.scene.fog.color = skyColor
        this.ambientLight.skyColor = skyColor
        this.ambientLight.groundColor = skyColor
    }
    getWorldLight(tick) {
        let transition

        // Dawn (Midnight to Orange)
        if (tick >= 6000 && tick < 6500) {
            transition = (tick - 6000) / 500 // Normalize between 6000-6500
            return MathUtils.lerp(1, 1.5, transition)
        }
        // Sunrise (Orange to Daylight)
        else if (tick >= 6500 && tick < 7000) {
            transition = (tick - 6500) / 500 // Normalize between 6500-7000
            return MathUtils.lerp(1.5, 2, transition)
        }
        // Daylight (Static 2.0)
        else if (tick >= 7000 && tick < 18000) {
            return 2
        }
        // Sunset (Daylight to Orange)
        else if (tick >= 18000 && tick < 18500) {
            transition = (tick - 18000) / 500 // Normalize between 18000-18500
            return MathUtils.lerp(2, 1.5, transition)
        }
        // Dusk (Orange to Midnight)
        else if (tick >= 18500 && tick < 19000) {
            transition = (tick - 18500) / 500 // Normalize between 18500-19000
            return MathUtils.lerp(1.5, 1, transition)
        }
        // Night (Static 0.0)
        else {
            return 0
        }
    }
    getSkyColor(tick) {
        const midnight = [8, 8, 32]
        const orange = [254, 135, 20]
        const blue = [153, 221, 255]

        const rgbToHex = (rgb) => {
            return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]
        }

        const lerpRgbToHex = (start, end, tick, tickStart) => {
            let t = (tick - tickStart) / 500

            const r = MathUtils.lerp(start[0], end[0], t)
            const g = MathUtils.lerp(start[1], end[1], t)
            const b = MathUtils.lerp(start[2], end[2], t)

            return rgbToHex([Math.round(r), Math.round(g), Math.round(b)])
        }

        //Dawn
        if (tick >= 6000 && tick < 6500) {
            return lerpRgbToHex(midnight, orange, tick, 6000)
        } else if (tick >= 6500 && tick < 7000) {
            return lerpRgbToHex(orange, blue, tick, 6500)
            //Daylight
        } else if (tick >= 7000 && tick < 18000) {
            return rgbToHex(blue)
            //Evening
        } else if (tick >= 18000 && tick < 18500) {
            return lerpRgbToHex(blue, orange, tick, 18000)
        } else if (tick >= 18500 && tick < 19000) {
            return lerpRgbToHex(orange, midnight, tick, 18500)
            //Night
        } else {
            return rgbToHex(midnight)
        }
    }
}

export default World
