import { io } from 'socket.io-client'
import { reactive } from 'vue'

const url = `http://${window.location.hostname}${import.meta.env.DEV ? ':3000' : ''}`

export const state = reactive({
    me: '',
    blocks: {},
})

export const socket = io(url)

socket.on('update', (data) => {
    state.me = socket.id
    state.blocks = data
})
