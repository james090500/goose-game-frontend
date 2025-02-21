<template>
    <div class="block" :style="{ transform: `translate(${this.block.x}px, ${this.block.y}px)` }" />
</template>

<script>
    export default {
        props: {
            block: {
                type: Object,
            }
        }
    }
</script>


<style scoped>
    .block {
        position: absolute;
        width: 30px;
        height: 30px;
        background: green;
    }
</style>