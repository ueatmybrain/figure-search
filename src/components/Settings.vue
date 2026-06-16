<script setup>
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { EyeIcon } from '@heroicons/vue/24/solid';
  import { EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  import {
    ArrowDownOnSquareIcon as ImportIcon,
    FaceSmileIcon,
    ArchiveBoxIcon as ArchiveIcon,
    ArrowUpIcon,
  } from '@heroicons/vue/24/outline';
  import { getDisplayName, tryAddFigure } from '../utils.js';
  import { useAlertsStore } from '../stores/alerts.js';
  const fsearch = useFigureSearchStore();
  const alerts = useAlertsStore();

  async function copyExportDataToCb() {
    const stringifiedData = JSON.stringify(
      fsearch.entries.map((entry) => entry.value).reverse(),
      null,
      2
    );
    await navigator.clipboard.writeText(stringifiedData);
    alerts.push({
      message: 'Copied export data JSON for ' + fsearch.entries.length + ' figures!',
    });
  }
  async function pasteExportDataFromCb() {
    const blobText = await navigator.clipboard.readText();
    let figuresArray = [];
    try {
      figuresArray = JSON.parse(blobText);
      if (!figuresArray[Symbol.iterator]) {
        throw SyntaxError("Object not iterable.")
      }
    } catch (err) {
      alerts.push({
        message: 'Invalid data. ' +err.message,
        type: 'error',
      });
    }
    for (let figureObject of figuresArray) {
      await tryAddFigure(figureObject);
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4 relative">
    <img
      v-if="!fsearch.nsfwHidden"
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
    <span class="text-sm">Export/Import figure data</span>
    <div class="flex flex-row gap-2">
      <div
        @click="pasteExportDataFromCb"
        class="flex flex-col items-center w-24 cursor-pointer p-4 rounded-lg hover:bg-base-300"
      >
        <div type="icon">
          <div class="fixed text-xs size-16 text-center mt-11 font-stroke">JSON</div>
          <div
            class="rounded-full w-16 h-16 relative object-cover ring-2 ring-offset-2 ring-gray-500"
          >
            <div class="pt-[.3rem] w-16 flex flex-col items-center">
              <FaceSmileIcon class="size-4 mx-5" />
              <div class="flex flex-row gap-1 mx-1 my-[-.3rem]">
                <FaceSmileIcon class="size-4" /><FaceSmileIcon class="size-4" />
              </div>
            </div>
            <ImportIcon class="size-6 mx-5 absolute bottom-4" />
          </div>
        </div>
        <div class="text-xs pt-2 text-center">Paste batch import</div>
      </div>
      <div
        @click="copyExportDataToCb"
        class="flex flex-col items-center w-24 cursor-pointer p-4 rounded-lg hover:bg-base-300"
      >
        <div type="icon">
          <div class="fixed text-xs size-16 text-center mt-11 font-stroke">JSON</div>
          <div
            class="rounded-full w-16 h-16 relative object-cover ring-2 ring-offset-2 ring-gray-500"
          >
            <ArrowUpIcon class="size-5 p-1 mx-auto" />

            <div class="pt-3 w-16 flex flex-col items-center">
              <FaceSmileIcon class="size-3 mx-5" />
            </div>
            <ArchiveIcon class="size-10 mx-3 absolute bottom-3" />
          </div>
        </div>
        <div class="text-xs text-center pt-2">Export/Copy all data</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
