import Multiplayer from './core/Multiplayer.js'
import LocalPlayer from './core/LocalPlayer.js'
import World from './world/World.js'
import GooseGame from './GooseGame.js'

class GameManager {
    constructor() {
        // Multiplayer
        this.multiplayer = new Multiplayer()

        // Local Player
        this.localPlayer = new LocalPlayer()

        // Load the world
        this.world = new World()

        // Start Game Loop
        this.gameTick = this.gameTick.bind(this)
        this.gameTickInterval = setInterval(this.gameTick, 50)
    }
    /**
     * A 20TPS LOOP
     */
    gameTick() {
        this.localPlayer.emitMovement()
        this.world.tick()
    }
    /**
     * The render loop
     */
    gameLoop(delta, time) {
        for (const player of this.multiplayer.players.values()) {
            player.renderer.updateNametag()
        }

        GooseGame.instance.input.controls.update(delta)

        this.world.seaRenderer.render(time)
        this.localPlayer.render(delta)
    }
}

export default GameManager
