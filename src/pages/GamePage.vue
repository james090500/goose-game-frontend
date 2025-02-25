<template>
    <div class="vh-100">
        <div class="w-full h-100 p-3">
            <BlockCavas />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import BlockCavas from '../components/BlockCavas.vue'

export default {
    computed: {
        ...mapState(['username']),
    },
    components: {
        BlockCavas,
    },
}
</script>
