import Config from './Config.js'
import Renderer from './renderer/Renderer.js'
import Input from './core/Input.js'
import GameManager from './GameManager.js'
import Multiplayer from './core/Multiplayer.js'
import { Clock } from 'three'

class GooseGame {
    static instance
    clock = new Clock()

    constructor(options) {
        if (GooseGame.instance) {
            throw new Error('There can only be one instance of GooseGame')
        }

        //Set the instance
        GooseGame.instance = this

        // Config
        this.config = new Config(options)

        // Instances
        this.renderer = new Renderer()
        this.input = new Input()

        // Game Logic
        this.gameManager = new GameManager()
        this.multiplayer = new Multiplayer()
        // this.world = new World()
        // this.debug = new Debug()

        // Start game loop
        // 50ms, aka 20 TPS
        // this.gameLoop = this.gameLoop.bind(this)
        // this.gameLoopInterval = setInterval(this.gameLoop, 50)

        // Start the animation

        this.loop = this.loop.bind(this)
        this.loop()
    }
    loop() {
        requestAnimationFrame(this.loop)

        const delta = this.clock.getDelta()
        const time = this.clock.getElapsedTime()

        this.renderer.render(delta, time)
        this.gameManager.gameLoop(delta, time)
    }
    /**
     * Dispose
     */
    dispose() {
        console.log('Disposed')
    }
    /**
     * API Methods
     */
    lock() {
        this.input.lock()
    }
}

window.GooseGame = GooseGame

export default GooseGame
