import enemies from '../enemy';

export default {
  characterById: (state) => (id) => state.characters.find((ch) => ch.id === id),
  characterInArray: (state) => (email) => state.characters.find((ch) => ch.email === email),
  getResource: (state) => (resourceId) => {
    return state.character.resources.find(r => r.id === resourceId);
  },
  currentStoryLine: (state) => state.storyLines.find(sl => sl.id === state.currentStoryLineId),
  currentStoryStep: (state, getters) => {
    const storyLine = getters.currentStoryLine;
    return storyLine ? storyLine.steps[storyLine.currentStepIndex || 0] : null;
  },
  availableStoryLines: (state) => state.storyLines.filter(sl => {
    if (sl.completed) return false;
    if (state.character.level < sl.levelRequirement) return false;
    if (sl.requiredStoryLineId) {
      const requiredStoryLine = state.storyLines.find(rsl => rsl.id === sl.requiredStoryLineId);
      if (!requiredStoryLine || !requiredStoryLine.completed) return false;
    }
    return true;
  }),  
  completedStoryLines: (state) => state.storyLines.filter(sl => sl.completed),
  currentEnemy: (state) => {
    return state.currentEnemyId ? enemies.find(e => e.id === state.currentEnemyId) : null;
  },
};
