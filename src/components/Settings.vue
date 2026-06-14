<script setup>
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { EyeIcon } from '@heroicons/vue/24/solid';
  import { EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  const fsearch = useFigureSearchStore();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="font-bold">Settings</div>
    <div class="">
      <div class="text-sm">Manage IndexedDB</div>
      <button onclick="are_you_sure.showModal()" class="btn text-error">Clear IndexedDB</button>
    </div>
    <div>
      <span class="text-sm">Show NSFW figures</span>
      <div class="flex flex-row gap-2 w-80">
        <input
          @click.prevent="fsearch.toggleNsfw()"
          type="checkbox"
          :checked="!fsearch.nsfwHidden"
          class="toggle toggle-secondary"
        />
        <span class="text-red-400 text-sm" v-if="fsearch.nsfwHidden"
          ><EyeSlashIcon class="size-5 inline" /> NSFW hidden</span
        >
        <div class="text-pink-500 text-sm" v-if="!fsearch.nsfwHidden">
          <EyeIcon class="size-5 inline" /> NSFW shown
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
