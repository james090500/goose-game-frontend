import { createStore } from 'vuex'
import { socket } from './socket.js'

export default createStore({
    state() {
        return {
            username: null,
        }
    },
    mutations: {
        doLogin(state, username) {
            state.username = username
        },
    },
})
