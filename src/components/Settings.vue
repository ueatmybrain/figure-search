<script setup>
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { EyeIcon } from '@heroicons/vue/24/solid';
  import { EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  const fsearch = useFigureSearchStore();
</script>

<template>
  <div class="flex flex-col gap-4 relative">
    <img v-if="!fsearch.nsfwHidden"
      class="h-20 w-40 absolute -bottom-8 right-2 mix-blend-lighten rounded-xl opacity-5 pointer-events-none"
      src="https://i.pinimg.com/736x/3a/8a/aa/3a8aaac530c18f55a6bae6d3ed62752c.jpg"
    />
    <div class="font-bold">Settings</div>
    <div class="">
      <div class="text-sm">Manage IndexedDB</div>
      <button onclick="are_you_sure.showModal()" class="btn text-deathpink">Clear IndexedDB</button>
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
        <span class="text-deathpink text-sm" v-if="fsearch.nsfwHidden"
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
