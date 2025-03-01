import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            game_version: __BUILD_HASH__,
            username: null,
            players: [],
        }
    },
    mutations: {
        doLogin(state, username) {
            state.username = username
        },
        updatePlayers(state, players) {
            state.players = players
        },
    },
})
