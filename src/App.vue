<template>
    <MainPage v-if="!username" />
    <GamePage v-else />
</template>

<script>
    import { mapState } from 'vuex'
    import MainPage from '@/pages/MainPage.vue'
    import GamePage from '@/pages/GamePage.vue'

    export default {
        computed: {
            ...mapState(['username'])
        },
        components: {
            MainPage,
            GamePage
        }
    }
</script>