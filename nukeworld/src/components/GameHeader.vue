<template>
<div class="game-header bg-primary">
    <div class="card">
        <div class="card-header">
            <div class="d-flex justify-content-between">
                <strong class="text-capitalize">Player: {{ character.name }} </strong>
                <p>Player Class: {{ character.class }} </p>

                <p>Player Gender: {{ character.gender }} </p>
            </div>
        </div>
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <p>Strength: {{ character.attributes.strength }} </p>
                <p>Perception: {{ character.attributes.perception }} </p>
                <p>Endurance: {{ character.attributes.endurance }} </p>
                <p>Charisma: {{ character.attributes.charisma }} </p>
                <p>Agility: {{ character.attributes.agility }} </p>
                <p>Intelligence: {{ character.attributes.intelligence }} </p>
                <p>Luck: {{ character.attributes.luck }} </p>
                <p>ProjectX: {{ character.attributes.projectX }} </p>
                <p>FreePoints: {{ character.freePoints }} </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'GameHeader',
    computed: {
        ...mapState(['character'])
    }
}
</script>

<style scoped>
/* Your component's styles go here */
</style>