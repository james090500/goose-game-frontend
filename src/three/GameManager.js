import World from './world/World.js'

import LocalPlayer from './core/LocalPlayer.js'
import GooseGame from './GooseGame.js'

class GameManager {
    constructor() {
        // Local Player
        this.localPlayer = new LocalPlayer()

        // Load the world
        this.world = new World()

        // Start Game Loop
        this.gameTick = this.gameTick.bind(this)
        this.gameTickInterval = setInterval(this.gameTick, 50)
    }
    gameTick() {
        this.world.tick()
    }
    gameLoop(delta, time) {
        GooseGame.instance.input.controls.update(delta)
        this.localPlayer.loop(delta)
    }
}

export default GameManager
