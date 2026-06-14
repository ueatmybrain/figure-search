<script setup>
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { TrashIcon } from '@heroicons/vue/24/solid';
  import { figureSet } from '../db/idb.js';
  import { onMounted, ref, toRaw, watch } from 'vue';

  const fsearch = useFigureSearchStore();
  const notes = ref('');
  function initNotes() {
    if (fsearch.currentEntry.value && fsearch.currentEntry.value.notes) {
      notes.value = fsearch.currentEntry.value.notes;
    } else {
      notes.value = '';
    }
  }
  let saveTimer;

  watch(
    () => fsearch.currentEntry,
    () => {
      initNotes();
    }
  );
  watch(notes, () => {
    if (!fsearch.currentEntry.value) {
      return;
    }
    clearTimeout(saveTimer);

    saveTimer = setTimeout(async () => {
      await figureSet(fsearch.currentEntry.value.id, {
        ...toRaw(fsearch.currentEntry.value),
        notes: notes.value,
      });
    }, 50);
  });

  onMounted(() => {
    initNotes();
  });
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="font-bold flex-row">
      Notes<span v-if="fsearch.currentEntry">
        for
        <img
          class="size-6 inline mx-1 rounded-full ring-1"
          :src="fsearch.currentEntry.value.icon"
          alt=""
      /></span>
    </div>
    <textarea
      class="textarea w-100"
      v-model="notes"
      placeholder="Enter your notes here..."
    ></textarea>
  </div>
</template>

<style scoped></style>
