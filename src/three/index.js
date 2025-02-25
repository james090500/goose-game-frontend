import {
    Clock,
    WebGLRenderer,
    Scene,
    AmbientLight,
    PerspectiveCamera,
    PointLight,
    TextureLoader,
    MathUtils,
    Vector3,
    DirectionalLight,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import Controls from './controls.js'
import Block from './block.js'

class TheGame {
    clock = new Clock()
    block = new Block()

    constructor(options) {
        this.renderer = new WebGLRenderer({
            canvas: options.canvas,
            alpha: true,
        })
        this.renderer.setClearColor(0x000000, 1)

        this.canvas = this.renderer.domElement

        this.scene = new Scene()
        this.scene.add(new AmbientLight(0xffffff, 1))

        this.camera = new PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            1,
            1000
        )
        this.camera.position.set(0, 0, 10) // Adjust as needed
        this.camera.add(new PointLight(0xffffff, 30))
        this.scene.add(this.camera)

        // Add a block
        this.block.mesh.position.set(0, 0, 5)
        this.scene.add(this.block.mesh)

        // Shaders
        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.fxaaPass = new ShaderPass(FXAAShader)

        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.fxaaPass)

        //Controls
        this.controls = new Controls(this.camera, this.renderer, options)

        // Bind the animate method to ensure the correct context
        this.animate = this.animate.bind(this)

        // Start the animation
        this.animate()
    }
    /**
     * Make sure the renderer is the same size as the canvas
     */
    resizeRendererToDisplaySize() {
        const pixelRatio = window.devicePixelRatio
        const width = Math.floor(this.canvas.clientWidth * pixelRatio)
        const height = Math.floor(this.canvas.clientHeight * pixelRatio)
        const needResize =
            Math.abs(this.canvas.width - width) > 1 ||
            Math.abs(this.canvas.height - height) > 1
        if (needResize) {
            this.renderer.setSize(width, height, false)
            this.composer.setSize(width, height)

            this.fxaaPass.material.uniforms['resolution'].value.x =
                1 / (this.canvas.clientWidth * pixelRatio)
            this.fxaaPass.material.uniforms['resolution'].value.y =
                1 / (this.canvas.clientHeight * pixelRatio)
        }
        return needResize
    }
    /**
     * Animate the scene
     */
    animate() {
        if (this._dispose) return

        requestAnimationFrame(this.animate)

        this.controls.update(this.clock.getDelta())
        this.composer.render()

        if (this.resizeRendererToDisplaySize()) {
            this.camera.aspect =
                this.canvas.clientWidth / this.canvas.clientHeight
            this.camera.updateProjectionMatrix()
        }
    }
    /**
     * Dispose
     */
    dispose() {
        this._dispose = true

        this.renderer.dispose()
        this.composer.dispose()
        this.fxaaPass.dispose()
    }
}

window.TheGame = TheGame

export default TheGame
