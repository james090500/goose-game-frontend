import { Clock, WebGLRenderer, PerspectiveCamera, PointLight } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import scene from './scene.js'
import Controls from './controls.js'
import Multiplayer from './multiplayer.js'

class TheGame {
    static instance
    clock = new Clock()

    constructor(options) {
        if (TheGame.instance) {
            throw new Error('There can only be one instance of TheGame')
        }

        //Set the instance
        TheGame.instance = this

        //Stats
        this.stats = new Stats()
        options.canvas.parentElement.appendChild(this.stats.dom)

        this.renderer = new WebGLRenderer({
            canvas: options.canvas,
            alpha: true,
        })

        this.canvas = this.renderer.domElement

        this.camera = new PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            1,
            1000
        )
        this.camera.add(new PointLight(0xffffff, 5))
        this.camera.position.y = 10
        scene.add(this.camera)

        // Shaders
        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(scene, this.camera)
        this.fxaaPass = new ShaderPass(FXAAShader)

        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.fxaaPass)

        //Controls
        this.controls = new Controls(options)

        // Start Multiplayer
        this.multiplayer = new Multiplayer(options.username)

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

        this.delta = this.clock.getDelta()

        requestAnimationFrame(this.animate)

        this.controls.update(this.delta)
        this.composer.render()

        if (this.resizeRendererToDisplaySize()) {
            this.camera.aspect =
                this.canvas.clientWidth / this.canvas.clientHeight
            this.camera.updateProjectionMatrix()
        }

        // FPS Stats
        this.stats.update()
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
