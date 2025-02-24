import { createStore } from 'vuex'

export default createStore({
    state () {
      return {
        username: null,
      }
    },
    mutations: {
      doLogin (state, username) {
          state.username = username
      }
    }
})