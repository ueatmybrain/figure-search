<script setup>
  import {
    CalculatorIcon as CostIcon,
    Cog6ToothIcon as SettingsIcon,
    BookOpenIcon as DictionaryIcon,
    ChevronDoubleRightIcon as ChevronR,
    DocumentIcon as NotesIcon,
  } from '@heroicons/vue/24/solid';
  import { ref } from 'vue';
  import CostCalculator from './CostCalculator.vue';
  import Settings from './Settings.vue';
  import Dictionary from './Dictionary.vue';
  import Notes from './Notes.vue';
  import { useFigureSearchStore } from '../stores/figuresearch.js';

  const showCalc = ref(false);
  const showSettings = ref(false);
  const showDict = ref(false);
  const showNotes = ref(false);

  const fsearch = useFigureSearchStore();
  function toggleOn(tab) {
    showCalc.value = !showCalc.value;
    showSettings.value = !showSettings.value;
    showDict.value = !showDict.value;
    showNotes.value = !showNotes.value;
    if (!(tab === 'calc')) {
      showCalc.value = false;
    }
    if (!(tab === 'settings')) {
      showSettings.value = false;
    }
    if (!(tab === 'dict')) {
      showDict.value = false;
    }
    if (!(tab === 'notes')) {
      showNotes.value = false;
    }
  }
  function toggleOff() {
    showCalc.value = false;
    showSettings.value = false;
    showDict.value = false;
    showNotes.value = false;
  }
</script>

<template>
  <div class="flex flex-row items-start mr-1">
    <div class="flex flex-row items-end">
      <button
        v-if="showCalc || showSettings || showDict || showNotes"
        @click="toggleOff"
        class="items-center self-stretch p-4 rounded-l-lg bg-base-200 hover:bg-base-300 flex cursor-pointer"
      >
        <ChevronR class="size-5" />
      </button>
      <div
        class="max-w-200 h-auto bg-base-200 rounded-r-lg mr-1"
        :class="showCalc || showSettings || showDict ? 'p-8' : ''"
      >
        <CostCalculator v-if="showCalc" />
        <Settings v-if="showSettings" />
        <Dictionary v-if="showDict" />
        <Notes v-if="fsearch.currentEntry.value?.icon" v-show="showNotes" />
      </div>
    </div>
    <ul class="menu bg-base-200 rounded-box">
      <li><CostIcon class="size-12" @click="toggleOn('calc')" /></li>
      <li><DictionaryIcon class="size-12" @click="toggleOn('dict')" /></li>
      <li><NotesIcon class="size-12" @click="toggleOn('notes')" /></li>
      <li><SettingsIcon class="size-12" @click="toggleOn('settings')" /></li>
    </ul>
  </div>
</template>

<style scoped></style>
