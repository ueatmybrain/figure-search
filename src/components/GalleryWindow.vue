<script setup>
  import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/vue/24/solid';
  import { ref } from 'vue';
  import { useFigureSearchStore } from '../stores/figuresearch.js';

  const galleryVisible = ref(true);
  const fsearch = useFigureSearchStore();
</script>

<template>
  <div
    @click="galleryVisible = !galleryVisible"
    class="m-1 flex cursor-pointer justify-end hover:opacity-80"
  >
    <span class="text-sm mr-2">show/hide gallery</span>
    <PhotoIcon class="size-5"></PhotoIcon>
    <EyeIcon class="size-5" v-if="galleryVisible" />
    <EyeSlashIcon class="size-5" v-if="!galleryVisible" />
  </div>
  <label class="modal-backdrop select-none" for="gallery_modal" v-show="galleryVisible">
    <figure
      class="cursor-zoom-in max-w-80 mx-auto"
      :class="(fsearch.currentEntry.value?.images?.length ?? 0) > 1 ? 'hover-gallery' : ''"
    >
      <img
        :src="src.replaceAll('/thumbnails/', '/').replaceAll('/1/', '/2/')"
        class="object-scale-down h-60"
        v-for="src in fsearch.currentEntry.value?.images"
      /></figure
  ></label>

  <input type="checkbox" id="gallery_modal" class="modal-toggle cursor-zoom-out" />
  <div class="modal" role="dialog">
    <div class="modal-box bg-transparent double-scale">
      <figure
        class=""
        :class="
          (fsearch.currentEntry.value?.images?.length ?? 0) > 1
            ? 'hover-gallery cursor-w-resize'
            : 'cursor-move'
        "
      >
        <img
          :src="src.replaceAll('/thumbnails/', '/').replaceAll('/1/', '/2/')"
          class="w-200"
          v-for="src in fsearch.currentEntry?.value?.images"
        />
      </figure>
    </div>
    <label class="modal-backdrop cursor-zoom-out" for="gallery_modal">Close</label>
  </div>
</template>

<style scoped></style>
