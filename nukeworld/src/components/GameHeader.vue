<template>
<div class="game-header bg-primary">
    <div class="card">
        <div class="card-header">
            <div class="d-flex justify-content-between">
                <strong class="text-capitalize">Player: {{ character.name }} </strong>
                <strong class="text-capitalize">Email: {{ character.email }} </strong>
                <strong class="text-capitalize">Password: {{ character.password }} </strong>
            </div>
        </div>
        <ExpLvl />
    </div>
    <CharacterInfo />
</div>
</template>
<script>
import { mapState } from 'vuex';
import CharacterInfo from './data/CharacterInfo.vue';
import ExpLvl from './data/ExpLvl.vue';


export default {
    name: 'GameHeader',
    components: {
        CharacterInfo,
        ExpLvl,
    },
    computed: {
        ...mapState(['character'])
    }
}
</script>

<style scoped>
/* Your component's styles go here */
</style>