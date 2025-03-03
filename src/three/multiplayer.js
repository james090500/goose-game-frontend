import { io } from 'socket.io-client'
import Player from './entity/player.js'
import GooseGame from './index.js'

class Multiplayer {
    players = new Map()

    constructor() {
        const url = import.meta.env.DEV
            ? `http://${window.location.hostname}:3000`
            : `https://goose-game-api.james090500.com`

        this.io = io(`${url}?username=${GooseGame.instance.options.username}`)

        this.io.on('update', (data) => {
            this.updatePlayers(data)
        })

        // Set the existing players location
        this.io.on('all_players', (data) => {
            for (const player of data) {
                this.updatePlayers(player)
            }
        })

        // Remove a player on leave
        this.io.on('player_leave', (data) => {
            this.players.get(data).dispose()
            this.players.delete(data)
        })

        // Load the world
        this.io.on('world', (data) => {
            GooseGame.instance.world.seaHeight = data.seaHeight
            GooseGame.instance.world.maxHeight = data.maxHeight

            GooseGame.instance.world.createWorld(data.terrain)
            GooseGame.instance.world.createTrees(data.trees)
        })

        // Sync time
        this.io.on('time', (data) => {
            GooseGame.instance.world.worldTime = data
        })
    }
    disconnect() {
        this.io.disconnect()
    }
    updatePosition(position) {
        this.io.emit('move', { x: position.x, y: position.y, z: position.z })
    }
    updateRotation(rotation) {
        this.io.emit('rotation', {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
        })
    }
    updatePlayers(data) {
        // Find or create a player
        let player = this.players.get(data.id)
        if (!player) {
            player = new Player(data.id, data.username)

            this.players.set(data.id, player)
        }

        // Set players positions
        player.setPosition(data.position)
        player.setRotation(data.rotation)

        // Player List
        let playerList = []
        for (const value of this.players.values()) {
            playerList.push({
                id: value.id,
                username: value.username,
            })
        }
        GooseGame.instance.options.onUpdatePlayers(playerList)
    }
}

export default Multiplayer
