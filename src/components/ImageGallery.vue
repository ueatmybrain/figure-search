<script setup>
  import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/vue/24/solid';
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { getDisplayName } from '../utils.js';
  import {
    ChevronDoubleRightIcon as ChevronR,
    ChevronDoubleLeftIcon as ChevronL,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';
  const galleryVisible = ref(true);
  const fsearch = useFigureSearchStore();
  const galleryImages = ref([]);
  async function checkImagesLoad() {
    if (!fsearch.currentEntry?.value?.images) {
      return;
    }
    for (const image of fsearch.currentEntry?.value?.images) {
      const testImg = new Image();
      testImg.src = getMfcImage(image);
      testImg.onload = () => {
        galleryImages.value.push(image);
      };
      testImg.onerror = () => {};
    }
  }
  watch(
    () => fsearch.currentEntry,
    () => {
      checkImagesLoad();
    }
  );

  function onKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        modalPrevious();
        break;
      case 'ArrowRight':
        modalNext();
        break;
    }
  }

  function modalNext() {
    modalImgSrcIdx.value = (modalImgSrcIdx.value + 1) % galleryImages.value.length;
  }
  function modalPrevious() {
    modalImgSrcIdx.value =
      (modalImgSrcIdx.value - 1 + galleryImages.value.length) % galleryImages.value.length;
  }

  const modalImgSrcIdx = ref(0);
  const modalOpen = ref(false);
  const modalOverlayVisible = ref(true);
  function openModal(imgSrcIdx) {
    modalImgSrcIdx.value = imgSrcIdx;
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
  }

  onMounted(() => {
    checkImagesLoad();
    window.addEventListener('keydown', onKeyDown);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown);
  });
  function getMfcImage(src) {
    const s = src.replaceAll('/thumbnails/', '/').replaceAll('/1/', '/2/');
    return s;
  }
</script>

<template>
  <div @click="galleryVisible = !galleryVisible" class="m-1 flex cursor-pointer hover:opacity-80">
    <PhotoIcon class="size-5"></PhotoIcon>
    <EyeIcon class="size-5" v-if="galleryVisible" />
    <EyeSlashIcon class="size-5" v-if="!galleryVisible" /><span class="text-sm ml-2"
      >show/hide gallery</span
    >
  </div>

  <div class="flex justify-center" v-if="galleryVisible && galleryImages.length > 0">
    <div class="cursor-zoom-in hover:opacity-85">
      <img @click="openModal(0)" :src="getMfcImage(galleryImages[0])" class="h-60" />
    </div>
    <div class="grid grid-flow-col auto-cols-max grid-rows-2">
      <img
        @click="openModal(idx + 1)"
        :src="getMfcImage(src)"
        class="h-30 w-18 object-cover cursor-zoom-in hover:opacity-85"
        v-for="(src, idx) in galleryImages.slice(1)"
      />
    </div>
  </div>

  <input type="checkbox" class="modal-toggle" v-model="modalOpen" />

  <div class="modal" role="dialog" v-if="galleryImages.length > 0">
    <div class="modal-box w-fit! rounded-none max-w-[70vw] h-screen p-0">
      <img :src="getMfcImage(galleryImages[modalImgSrcIdx])" class="h-full object-cover mx-auto" />
      <button
        v-if="modalOverlayVisible"
        class="absolute inset-y-0 left-0 w-1/3 opacity-0 hover:opacity-100 bg-black/30 cursor-pointer items-center"
        @click="modalPrevious()"
        aria-label="Previous page"
      >
        <ChevronL class="size-8 mx-auto" />
        (<kbd class="kbd">◀︎︎︎</kbd> Left arrow key)
      </button>
      <div
        class="absolute inset-y-0 left-1/3 w-1/3 opacity-0 hover:opacity-100"
        aria-label="Previous page"
      >
        <div class="h-fit flex flex-row mx-auto">
          <div
            class="bg-black/30 w-1/3 p-3 cursor-pointer items-center"
            :class="!modalOverlayVisible ? 'opacity-0 hover:opacity-100 transition' : ''"
            @click="closeModal"
          >
            <XMarkIcon class="size-7 mx-auto" />
          </div>
          <div
            class="bg-black/30 w-1/3 p-3 mx-auto"
            :class="!modalOverlayVisible ? 'opacity-0 hover:opacity-100 transition' : ''"
          >
            <div class="text-center font-bold text-xl">{{ modalImgSrcIdx + 1 }}</div>
          </div>
          <div
            class="bg-black/30 w-1/3 p-3 cursor-pointer items-center"
            :class="!modalOverlayVisible ? 'opacity-0 hover:opacity-100 transition' : ''"
            @click="modalOverlayVisible = !modalOverlayVisible"
          >
            <EyeIcon class="size-7 mx-auto" v-if="modalOverlayVisible" />
            <EyeSlashIcon class="size-7 mx-auto" v-else />
          </div>
        </div>
      </div>
      <button
        v-if="modalOverlayVisible"
        class="absolute inset-y-0 right-0 w-1/3 opacity-0 hover:opacity-100 bg-black/30 cursor-pointer"
        @click="modalNext()"
        aria-label="Next page"
      >
        <ChevronR class="size-8 mx-auto" />
        (Right arrow key <kbd class="kbd">▶︎</kbd>)
      </button>
    </div>

    <label class="modal-backdrop" @click="closeModal"> Close </label>
  </div>
</template>

<style scoped></style>
