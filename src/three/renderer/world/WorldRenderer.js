import {
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    DirectionalLight,
    HemisphereLight,
    Fog,
    Color,
    MathUtils,
    Float32BufferAttribute,
} from 'three'
import TextureManager from '../../utils/TextureManager.js'
import GooseGame from '../../GooseGame.js'

class WorldRenderer {
    constructor(worldSize) {
        //Variables
        this.worldSize = worldSize

        this.renderer = GooseGame.instance.renderer

        // Sky
        this.renderer.sceneManager.scene.background = new Color(0x99ddff)

        // Fog
        this.renderer.sceneManager.scene.fog = new Fog(0x99ddff, 128, 512)

        // The Sun
        this.sun = new DirectionalLight(0xffffff, 3)
        this.renderer.sceneManager.add(this.sun)

        // Ambient Light
        this.ambientLight = new HemisphereLight(0xffffff, 0xffffff, 1)
        this.renderer.sceneManager.add(this.ambientLight)
    }
    renderWorld(terrain) {
        const geometry = new PlaneGeometry(
            this.worldSize,
            this.worldSize,
            this.worldSize / 16,
            this.worldSize / 16
        )

        this.mesh = new Mesh(
            geometry,
            new MeshStandardMaterial({
                map: TextureManager.grass,
            })
        )

        this.mesh.material.onBeforeCompile = (shader) => {
            shader.uniforms.sandTexture = { value: TextureManager.sand }
            shader.uniforms.grassTexture = { value: TextureManager.grass }
            shader.uniforms.heightThreshold = {
                value: GooseGame.instance.gameManager.world.seaHeight + 2,
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

        this.mesh.rotation.x = -Math.PI / 2

        const bufferArray = new Float32BufferAttribute(terrain, 3)
        this.mesh.geometry.attributes.position = bufferArray

        GooseGame.instance.renderer.sceneManager.add(this.mesh)
    }
}

export default WorldRenderer
