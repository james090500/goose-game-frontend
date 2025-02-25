<template>
    <div class="vh-100">
        <div class="w-full h-100 p-3">
            <BlockCavas :blocks="blocks" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { socket, state } from '@/socket'
import BlockCavas from '../components/BlockCavas.vue'

export default {
    created() {
        socket.connect()
        socket.emit('username', this.username)
    },
    computed: {
        ...mapState(['username']),
        blocks() {
            return state.blocks
        },
    },
    components: {
        BlockCavas,
    },
}
</script>
