<script setup>
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
  defineProps({
    data: Object,
  });

  defineEmits(['click']);
</script>
<template>
  <div
    @click="$emit('click')"
    class="bg-white bg-center bg-cover bg-no-repeat transition rounded-lg border-deathpink border-2"
    :style="{ backgroundImage: `url(${data?.image})`, backgroundSize: '100% auto' }"
  >
    <div
      class="flex items-center gap-1 text-deathpink h-full w-full opacity-0 hover:opacity-100 bg-white/70 rounded-md p-2"
    >
      <MagnifyingGlassIcon class="size-4" /> <span class="text-[.8rem]">Search</span>
    </div>
  </div>
</template>

<style scoped></style>
