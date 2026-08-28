<script setup>
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
  import { ref } from 'vue';
  defineProps({
    data: Object,
  });
  defineEmits(['click']);
  const imageError = ref(false);
</script>
<template>
  <img :src="data?.image" @error="imageError = true" @load="imageError = false" class="hidden" />
  <div
    @click="$emit('click')"
    class="bg-center bg-cover bg-no-repeat transition rounded-lg border-deathpink border-2 w-20 h-10"
    :class="data?.bg ? data?.bg : 'bg-white'"
    :style="{ backgroundImage: `url(${data?.image})`, backgroundSize: '90% auto' }"
  >
    <div v-if="imageError" class="text-black absolute w-20 h-10 text-xs">
      <div class="w-full h-full text-center">{{ data?.label }}</div>
    </div>
    <div class="absolute">
      <div
        class="flex items-center text-deathpink h-10 w-20 m-[-.1rem] opacity-0 border-2 hover:opacity-100 bg-white/90 rounded-md p-2"
      >
        <MagnifyingGlassIcon class="size-4" /> <span class="text-[.8rem]">Search</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
