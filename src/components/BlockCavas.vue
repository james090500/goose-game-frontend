<template>
    <div class="h-100">
        <div
            class="position-absolute h-100 w-100 d-flex justify-content-center align-items-center"
            v-if="!locked"
        >
            <div class="text-center" @click="lockControls">
                <h1>Paused</h1>
                <p>Click to unpause</p>
            </div>
        </div>
        <canvas id="the_game" class="w-100 h-100 border shadow rounded" />
    </div>
</template>

<script>
import TheGame from '../three/index.js'
import { mapState } from 'vuex'
import { state } from '../socket.js'

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
    watch: {
        blocks: {
            immediate: true,
            handler() {
                if (this.ctx != null) {
                    this.update()
                }
            },
        },
    },
    computed: {
        ...mapState(['me']),
    },
    props: {
        blocks: {
            type: Array,
            required: true,
        },
    },
}
</script>
