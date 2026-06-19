<script setup>
  import { useFigureSearchStore } from '../stores/figuresearch.js';

  const fsearch = useFigureSearchStore();
</script>

<template>
  <div class="flex flex-col">
    <select
      class="select input-xs"
      v-if="fsearch.entries.length > 0"
      v-model="fsearch.categoryFilter"
    >
      <option :value="null">Category</option>
      <option v-for="category in fsearch.categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <input
      type="text"
      placeholder="Search character..."
      class="input input-xs"
      v-model="fsearch.searchFilter"
    />
  </div>
</template>

<style scoped></style>
