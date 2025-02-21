<template>
    <h1>Move some blocks</h1>
    <MainBlockItem />
    <BlockItem v-for="(block, key) in this.blocks" :key="key" :block="block" />
    <strong>{{ this.me  }}</strong>
    <br>
    <pre>
        {{ this.blocks }}
    </pre>
</template>

<script>
    import { socket, state } from "@/socket";
    import MainBlockItem from './components/MainBlockItem.vue';
    import BlockItem from "./components/BlockItem.vue";

    export default {
        created() {
            socket.connect()
        },
        computed: {
            me() {
                return state.me
            },
            blocks() {
                return state.blocks
            }
        },
        components: {
            MainBlockItem,
            BlockItem
        }
    }
</script>
