import { io } from 'socket.io-client'
import Player from './player.js'

class Multiplayer {
    players = []

    constructor(username) {
        const url = import.meta.env.DEV ?
        `http://${window.location.hostname}:3000`
        : `https://mb-api.james090500.com`

        this.io = io(`${url}?username=${username}`)

        this.io.on('update', (data) => {
            this.me = this.io.id
            this.updatePlayers(data)
        })
    }
    updatePosition(x, y, z) {
        this.io.emit('move', { x, y, z })
    }
    updateRotation(x, y, z) {
        this.io.emit('rotation', { x, y, z })
    }
    updatePlayers(newPlayers) {
        // Remove players that are not in the newPlayers array
        this.players.forEach(player => {
            if (!newPlayers.some(newPlayer => newPlayer.id === player.id)) {
                player.dispose(); // Dispose the player before filtering
            }
        });


        // Update existing players or add new players
        newPlayers.forEach((player) => {
            //Don't add myself
            if(player.id === this.me) return

            //Find the player index
            let index = this.players.findIndex(item => item.id === player.id);
            if (index !== -1) {
                this.players[index].setPosition(player.position)
                this.players[index].setRotation(player.rotation)
            } else {
                this.players.push(new Player(player.id, player.username, player.position, player.rotation))
            }
        })

        console.log(this.players)
    }
}

export default Multiplayer;