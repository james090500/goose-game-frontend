<template>
    <div class="row justify-content-center vh-100">
        <div class="col-6 text-center align-content-center">
            <div>
                <h1>Welcome to Goose Game!</h1>
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
                <div class="mt-2">
                    Game Version:
                    <strong
                        ><a
                            :href="`https://github.com/james090500/goose-game-frontend/tree/${game_version}`"
                            target="_blank"
                            >{{ game_version }}</a
                        ></strong
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            username: '',
        }
    },
    created() {
        if (import.meta.env.DEV) {
            this.username = Math.floor(Math.random() * Date.now()).toString(36)
            this.login()
        }
    },
    methods: {
        login() {
            if (this.username != null && this.username != '') {
                store.commit('doLogin', this.username)
            }
        },
    },
    computed: {
        ...mapState(['game_version']),
    },
}
</script>
