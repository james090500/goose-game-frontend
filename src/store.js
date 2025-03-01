import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            game_version: import.meta.env.CF_PAGES_COMMIT_SHA ?? 'DEV',
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
