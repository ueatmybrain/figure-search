<script setup>
  import { onMounted, ref } from 'vue';
  import { getRandomInt } from './utils.js';
  import Alert from './components/Alert.vue';

  const clockTime = ref('');

  onMounted(() => {
    updateClock();
    setInterval(updateClock, 1000);
  });
  function updateClock() {
    let timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      //second: '2-digit',
    });
    clockTime.value = timeString;
  }
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <RouterView :key="$route.fullPath" class="flex-grow" />
  </div>
  <Alert class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" />
</template>

<style scoped></style>
