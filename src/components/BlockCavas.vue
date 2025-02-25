<template>
    <div class="h-100">
        <div
            class="position-absolute h-100 w-100 start-0 top-0 d-flex justify-content-center align-items-center pause-screen"
            v-if="!locked" @click="lockControls"
        >
            <div class="text-center text-black border rounded shadow p-3">
                <h1>Paused</h1>
                <p>Click to unpause</p>
            </div>
        </div>
        <canvas id="the_game" class="w-100 h-100 border shadow rounded" />
    </div>
</template>

<style scoped>
    .pause-screen {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.5);
    }
</style>

<script>
import TheGame from '../three/index.js'
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
        })
    },
    methods: {
        lockControls() {
            this.theGame.controls.lock()
        },
    },
    unmounted() {
        this.theGame.dispose()
    },
    computed: {
        ...mapState(['username']),
    }
}
</script>
