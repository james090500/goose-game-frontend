<template>
    <div>
        <h1>Welcome to the game!</h1>
        <input v-model="username" placeholder="Username">
        <button @click="login">
            Log in
        </button>
    </div>
</template>

<script>
    import store from '@/store'

    export default {
        data() {
            return {
                username: ''
            }
        },
        methods: {
            login() {
                store.commit('doLogin', this.username)
            }
        },
    }
</script>