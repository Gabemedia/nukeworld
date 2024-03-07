<template>
    <div class="d-flex justify-content-between bg-primary bg-gradient p-2">
        <div class="col-4 text-capitalize d-flex justify-content-start text-light text-center">Player: {{ character.name }} </div>
        <div class="col-4 text-capitalize d-flex justify-content-center text-light text-center">Money: {{ character.money }}</div>
        <div class="col-4 text-capitalize d-flex justify-content-end text-light text-center">Level: {{ character.level }} </div>
    </div>
    <ExpLvl />
    <CharacterInfo />
    <QuestsLines />
    <LokalNyt />
</template>
<script>
import { mapState } from 'vuex';
import CharacterInfo from './data/CharacterInfo.vue';
import ExpLvl from './data/ExpLvl.vue';
import QuestsLines from './data/QuestsLines.vue';
import LokalNyt from './data/LokalNyt.vue';

export default {
    name: 'GameHeader',
    components: {
        CharacterInfo,
        ExpLvl,
        QuestsLines,
        LokalNyt,
    },
    computed: {
        ...mapState(['character'])
    }
}
</script>

<style scoped>
/* Your component's styles go here */
</style>