<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    lang: String,
  });
  const src = ref('');
  if (props.lang === 'jp') {
    src.value = '/japanese.png';
  }
  if (props.lang === 'en') {
    src.value = '/english.png';
  }
</script>

<template>
  <img class="w-4 h-auto border-1 border-base-300" :src="src" :alt="lang" />
</template>

<style scoped></style>
