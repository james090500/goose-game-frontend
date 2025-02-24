<template>
    <h1>Move some blocks</h1>
    <MainBlockItem />
    <BlockItem v-for="(block, key) in this.blocks" :key="key" :block="block" />
    <strong>{{ this.me }}</strong>
    <br>
    <pre>
        {{ this.blocks }}
    </pre>
</template>

<script>
    import { socket, state } from "@/socket";
    import { mapState } from 'vuex';
    import MainBlockItem from '@/components/MainBlockItem.vue';
    import BlockItem from "@/components/BlockItem.vue";

    export default {
        created() {
            socket.connect()
            socket.emit('username', this.username)
        },
        computed: {
            ...mapState(['username']),
            me() {
                return state.me
            },
            blocks() {
                return state.blocks.filter(block => block.id !== state.me)
            }
        },
        components: {
            MainBlockItem,
            BlockItem
        }
    }
</script>
