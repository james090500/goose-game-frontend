<template>
    <div class="h-100 position-relative">
        <div
            class="position-absolute top-0 start-0 h-100 w-100 d-flex justify-content-center align-items-center rounded pause-screen"
            v-if="!locked"
        >
            <div class="col-4 d-grid">
                <h1 class="text-center">Options</h1>
                <hr />
                <button class="btn btn-primary" @click="lockControls">
                    Resume
                </button>
                <button class="btn btn-danger mt-1" @click="disconnect">
                    Disconnect
                </button>
            </div>
        </div>
        <canvas id="the_game" class="w-100 h-100 border shadow rounded" />
    </div>
</template>

<style scoped>
.pause-screen {
    background: rgba(0, 0, 0, 0.5);
}
</style>

<script>
import TheGame from '../three/index.js'
import store from '@/store'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            theGame: null,
            locked: false,
        }
    },
    mounted() {
        this.theGame = new TheGame({
            canvas: document.getElementById('the_game'),
            username: this.username,
            onLock: () => {
                this.locked = true
            },
            onUnlock: () => {
                this.locked = false
            },
            onUpdatePlayers: (players) => {
                store.commit('updatePlayers', players)
            },
        })

        this.lockControls()
    },
    methods: {
        lockControls() {
            this.theGame.controls.lock()
        },
        disconnect() {
            store.commit('doLogin', null)
            store.commit('updatePlayers', [])
        },
        dispose() {
            this.theGame.dispose()
            this.theGame = null
            this.disconnect()
        },
    },
    unmounted() {
        this.disconnect()
        this.dispose()
    },
    computed: {
        ...mapState(['username']),
    },
}
</script>
