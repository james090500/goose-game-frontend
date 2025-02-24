<template>
    <div class="main-block block" :style="{ transform: `translate(${this.translateX}px, ${this.translateY}px)` }" />
</template>

<script>
    import { socket } from "@/socket";
    import { onKeyStroke } from '@vueuse/core'

    export default {
        data() {
            return {
                translateX: 0,
                translateY: 0
            }
        },
        mounted() {
            onKeyStroke(['w', 'W', 'ArrowUp'], (e) => {
                this.translateY -= 10
                this.sendMovement()
            })

            onKeyStroke(['s', 'S', 'ArrowDown'], (e) => {
                this.translateY += 10
                this.sendMovement()
            })

            onKeyStroke(['a', 'A', 'ArrowLeft'], (e) => {
                this.translateX -= 10
                this.sendMovement()
            })

            onKeyStroke(['d', 'D', 'ArrowRight'], (e) => {
                this.translateX += 10
                this.sendMovement()
            })
        },
        methods: {
            sendMovement() {
                socket.emit('move', { x: this.translateX, y: this.translateY })
            }
        }
    }
</script>

<style scoped>
    .main-block {
        background: blue !important;
        z-index: 100;
    }
</style>