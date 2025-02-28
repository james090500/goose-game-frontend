<template>
    <div class="vh-100">
        <div class="row">
            <div class="col-10">
                <div class="w-full vh-100 p-3">
                    <GameCanvas />
                </div>
            </div>
            <div class="col-2">
                <h4 class="mt-3">Players</h4>
                <hr />
                <div
                    class="row border rounded p-2 m-1"
                    v-for="player in players"
                    :key="player.id"
                >
                    <div class="col-4">
                        <img
                            :src="`https://robohash.org/${player.username}`"
                            class="rounded img-fluid"
                        />
                    </div>
                    <div class="col-8">
                        <h3>{{ player.username }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import GameCanvas from '../components/GameCanvas.vue'

export default {
    computed: {
        ...mapState(['username', 'players']),
    },
    components: {
        GameCanvas,
    },
}
</script>
