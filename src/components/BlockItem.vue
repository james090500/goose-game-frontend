<template>
    <div class="block" :style="{ transform: `translate(${this.block.x}px, ${this.block.y}px)` }">
        <strong>{{ this.block.username }}</strong>
    </div>
</template>

<script>
    export default {
        props: {
            block: {
                type: Object,
                default: null
            }
        }
    }
</script>


<style>
    .block {
        position: absolute;
        width: 40px;
        height: 40px;
        background: green;
        border-radius: 0.25rem;
    }
</style>