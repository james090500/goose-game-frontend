<template>
    <div class="row justify-content-center vh-100">
        <div class="col-6 text-center align-content-center">
            <div>
                <h1>Welcome to the game!</h1>
                <div class="row">
                    <div class="col-8">
                        <input
                            v-model="username"
                            class="form-control"
                            placeholder="Username"
                            @keyup.enter="login"
                        />
                    </div>
                    <div class="col">
                        <div class="d-grid">
                            <button class="btn btn-primary" @click="login">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'

export default {
    data() {
        return {
            username: '',
        }
    },
    methods: {
        login() {
            if (this.username != null && this.username != '') {
                store.commit('doLogin', this.username)
            }
        },
    },
}
</script>
