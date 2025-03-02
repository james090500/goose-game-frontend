import { io } from 'socket.io-client'
import Player from './entity/player.js'
import GooseGame from './index.js'

class Multiplayer {
    players = []

    constructor() {
        const url = import.meta.env.DEV
            ? `http://${window.location.hostname}:3000`
            : `https://goose-game-api.james090500.com`

        this.io = io(`${url}?username=${GooseGame.instance.options.username}`)

        this.io.on('update', (data) => {
            this.me = this.io.id
            this.updatePlayers(data)
        })

        this.io.on('world', (data) => {
            GooseGame.instance.world.seaHeight = data.seaHeight
            GooseGame.instance.world.maxHeight = data.maxHeight

            GooseGame.instance.world.createWorld(data.terrain);
            GooseGame.instance.world.createTrees(data.trees)
        })

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
    updatePlayers(newPlayers) {
        // Remove players that are not in the newPlayers array
        this.players = this.players.filter((player) => {
            if (!newPlayers.some((newPlayer) => newPlayer.id === player.id)) {
                player.dispose();
                return false; // Remove from this.players
            }
            return true; // Keep in this.players
        });


        // Update existing players or add new players
        newPlayers.forEach((player) => {
            //Don't add myself
            if (player.id === this.me) return

            //Find the player index
            let index = this.players.findIndex((item) => item.id === player.id)
            if (index !== -1) {
                this.players[index].setPosition(player.position)
                this.players[index].setRotation(player.rotation)
            } else {
                this.players.push(
                    new Player(
                        player.id,
                        player.username,
                        player.position,
                        player.rotation
                    )
                )
            }
        })

        const playerList = newPlayers.map((player) => {
            return {
                id: player.id,
                username: player.username,
            }
        })
        GooseGame.instance.options.onUpdatePlayers(playerList)
    }
}

export default Multiplayer
