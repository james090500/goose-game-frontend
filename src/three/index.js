import {
    Clock,
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Color,
    DirectionalLight,
    Fog,
    AmbientLight,
} from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import Controls from './controls.js'
import Multiplayer from './multiplayer.js'
import World from './world/world.js'
import Terrain from './world/terrain.js'

class TheGame {
    static instance
    options = null
    gameLoopInterval = null
    clock = new Clock()

    constructor(options) {
        if (TheGame.instance) {
            throw new Error('There can only be one instance of TheGame')
        }

        //Set the instance
        TheGame.instance = this

        //Options
        this.options = options

        //Stats
        this.stats = new Stats()
        this.options.canvas.parentElement.appendChild(this.stats.dom)

        this.renderer = new WebGLRenderer({
            canvas: this.options.canvas,
            alpha: true,
        })

        this.canvas = this.renderer.domElement

        // Scene
        this.scene = new Scene()

        // Camera
        this.camera = new PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            520
        )
        this.camera.position.y = 30
        this.scene.add(this.camera)

        // Shaders
        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.fxaaPass = new ShaderPass(FXAAShader)

        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.fxaaPass)

        //Controls
        this.controls = new Controls()

        // Start Multiplayer
        this.multiplayer = new Multiplayer()

        // World
        this.world = new World()
        new Terrain()
        this.scene.add(this.world.getWorld())

        // Start game loop
        // 50ms, aka 20 TPS
        this.gameLoop = this.gameLoop.bind(this)
        this.gameLoopInterval = setInterval(this.gameLoop, 50)

        // Start the animation
        this.animate = this.animate.bind(this)
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

    gameLoop() {
        this.controls.emitMovement()
        this.world.updateTime()
    }

    /**
     * Dispose
     */
    dispose() {
        this._dispose = true

        // Clear interval
        clearInterval(this.gameLoopInterval)

        //Disconnect socket
        this.multiplayer.disconnect()

        //Dispose the renderer
        this.renderer.dispose()
        this.composer.dispose()
        this.fxaaPass.dispose()

        //Goodbye camera
        this.camera.children.forEach((child) => {
            child.dispose()
        })
        this.camera = null

        // Goodbye
        TheGame.instance = null
    }
}

window.TheGame = TheGame

export default TheGame
