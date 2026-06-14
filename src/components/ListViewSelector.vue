<script setup>
  import {
    getCategoryColor,
    getDisplayName,
    getJpDisplayName,
    stringifyCharacters,
  } from '../utils.js';
  import { figureDelete, figureGet, figureSet } from '../db/idb.js';
  import { computed, onMounted, ref } from 'vue';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { useAlertsStore } from '../stores/alerts.js';
  import PrettySm from './PrettySm.vue';
  import { FaceSmileIcon, ClipboardIcon } from '@heroicons/vue/24/outline';

  const fsearch = useFigureSearchStore();
  const alerts = useAlertsStore();
  const figureTooltip = ref(null);
  const mouse = ref({ x: 0, y: 0 });
  const contextMenuPos = ref({ x: 0, y: 0 });
  const ctxMenu = ref(null);
  const tooltipRef = ref(null);

  function updateMouse(e) {
    mouse.value.x = e.clientX;
    mouse.value.y = e.clientY;
  }
  function handleClickOutside(event) {
    if (contextMenuSelection.value && !ctxMenu.value?.contains(event.target)) {
      contextMenuSelection.value = false;
    }
  }
  onMounted(async () => {
    await fsearch.updateEntries();
    await fsearch.updateNsfwSetting();
    document.addEventListener('mousedown', handleClickOutside);
  });
  async function switchCurrentEntry(key) {
    fsearch.currentEntry = await figureGet(key).then((r) => r);
  }

  function showFigureTooltip(figure) {
    figureTooltip.value = figure.value;
  }
  function hideFigureTooltip() {
    figureTooltip.value = null;
  }

  const contextMenuSelection = ref(null);
  function showFigureContextMenu(event, entry) {
    event.preventDefault();
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();

    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2 - 50;

    console.log(centerY + 200, window.innerHeight);
    if (centerY + 200 > window.innerHeight) {
      centerY = centerY - rect.height - 50;
    }
    if (centerX > window.innerWidth) {
      centerX = window.innerWidth - rect.width;
    }
    console.log(centerY);
    contextMenuPos.value = { x: centerX, y: centerY };
    contextMenuSelection.value = entry;
  }
  async function deleteItem(id) {
    await figureDelete(id);
    contextMenuSelection.value = null;
    await fsearch.updateEntries();
    alerts.push({
      message: 'Successfully removed entry.',
      type: 'info',
    });
  }

  async function addFigureFromClipboard() {
    const blobText = await navigator.clipboard.readText();
    try {
      let figureObject = JSON.parse(blobText);

      let oldData = await figureGet(figureObject.id);
      if (oldData) {
        const mergedFigure = {
          ...oldData.value,
          ...figureObject
        };
      figureObject = mergedFigure;
      }
      await figureSet(figureObject.id, figureObject);
      await fsearch.updateEntries();
      alerts.push({
        message: 'Added/Updated "' + getDisplayName(figureObject) + '" successfully!',
        type: 'success',
      });
    } catch (e) {
      if (e instanceof SyntaxError) {
        alerts.push({
          message: 'Could not add data. No figure data JSON object in clipboard.',
          type: 'error',
        });
        return;
      }
      alerts.push({
        message: e,
        type: 'error',
      });
      throw e;
    }
  }
  const tooltipStyle = computed(() => {
    let left = mouse.value.x + 10;
    let top = mouse.value.y + 20;

    if (tooltipRef.value) {
      const rect = tooltipRef.value.getBoundingClientRect();
      if (top + rect.height > window.innerHeight) {
        top = mouse.value.y - rect.height - 10;
      }
      if (left + rect.width > window.innerWidth) {
        left = window.innerWidth - rect.width - 10;
      }
      top = Math.max(10, top);
      left = Math.max(10, left);
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
    };
  });
</script>

<template>
  <ul class="menu w-full grow">
    <li>
      <div
        @click="addFigureFromClipboard()"
        class="flex flex-row gap-4 cursor-pointer p-4 hover:bg-base-300 rounded-lg max-w-80"
      >
        <div type="icon">
          <div class="fixed text-xs size-16 text-center mt-11 font-stroke">JSON</div>
          <div class="rounded-full w-16 h-16 object-cover ring-2 ring-offset-2 ring-gray-500">
            <FaceSmileIcon class="size-16 p-5 fixed" /><ClipboardIcon class="size-16 pb-2 pt-1" />
          </div>
        </div>
        <div type="title" class="truncate overflow-ellipsis is-drawer-close:hidden">
          <div class="font-bold">Paste new/updated figure data</div>
        </div>
      </div>
    </li>
    <li v-for="entry in fsearch.filteredEntries" :key="entry.id">
      <div
        class="flex flex-row gap-4 cursor-pointer p-4 hover:bg-base-300 rounded-lg max-w-80"
        @click.left="switchCurrentEntry(entry.value.id)"
        @click.right="showFigureContextMenu($event, entry)"
        @mousemove="updateMouse"
        @mouseenter="showFigureTooltip(entry)"
        @mouseleave="hideFigureTooltip()"
      >
        <div type="icon">
          <div class="flex-shrink-0">
            <div class="relative size-16">
              <div
                v-if="fsearch.hasAdultTag(entry)"
                class="pointer-events-none select-none absolute text-pink-500 outline-solid rounded-full shadow-white bg-white z-20"
              >
                +18
              </div>
              <img
                :src="entry.value.icon"
                class="rounded-full cursor-pointer w-16 h-16 object-cover ring-2 ring-offset-2 border-deathpink hover:opacity-90"
                :class="entry.value.id === fsearch.currentEntry.value.id ? 'ring-6' : ''"
                :style="{ '--tw-ring-color': getCategoryColor(entry.value.category) }"
              />
            </div>
          </div>
        </div>
        <div type="title" class="text-xs truncate overflow-ellipsis is-drawer-close:hidden">
          <div>
            <div class="font-bold text-deathpink">
              {{ getDisplayName(entry.value) }}
              <span v-if="entry.value.dimensions && entry.value.dimensions !== 'non-scale'">{{
                entry.value?.dimensions
              }}</span>
            </div>
            <div>
              {{ getJpDisplayName(entry.value) }}
            </div>
            <div :style="'color: ' + getCategoryColor(entry.value?.category)">
              {{ entry.value?.category }}
            </div>
            <div>Last updated: {{ new Date(entry.value.capturedAt).toLocaleString('de-DE') }}</div>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div
    ref="ctxMenu"
    class="fixed bg-base-100 p-.5 z-50"
    v-if="contextMenuSelection"
    :style="{
      left: contextMenuPos.x + 10 + 'px',
      top: contextMenuPos.y + 20 + 'px',
    }"
  ></div>
  <Teleport to="body">
    <div
      ref="tooltipRef"
      class="fixed p-.5 z-200"
      v-if="figureTooltip && !contextMenuSelection"
      :style="tooltipStyle"
    >
      <PrettySm
        ><div class="m-2 w-32">
          <div class="font-bold text-deathpink">
            {{ getDisplayName(figureTooltip) }}
            <span v-if="figureTooltip.dimensions && figureTooltip.dimensions !== 'non-scale'">{{
              figureTooltip?.dimensions
            }}</span>
          </div>
          <div>
            {{ getJpDisplayName(figureTooltip) }}
          </div>
          <div :style="'color: ' + getCategoryColor(figureTooltip?.category)">
            {{ figureTooltip?.category }}
          </div>

          <div class="text-sm">
            {{ new Date(figureTooltip.capturedAt).toLocaleString('de-DE') }}
          </div>
        </div></PrettySm
      >
    </div></Teleport
  >
  <Teleport to="body">
    <div
      ref="ctxMenu"
      class="fixed bg-base-100 p-.5 z-50"
      v-if="contextMenuSelection"
      :style="{
        left: contextMenuPos.x + 10 + 'px',
        top: contextMenuPos.y + 20 + 'px',
      }"
    >
      <PrettySm
        ><div class="m-2 w-32">
          <div class="font-bold text-deathpink">
            <img
              :src="contextMenuSelection?.value.icon"
              class="rounded-full mx-auto m-2 cursor-pointer w-16 h-16 object-cover ring-2 ring-offset-2 border-deathpink hover:opacity-90"
              :style="{ '--tw-ring-color': getCategoryColor(contextMenuSelection?.value.category) }"
            />
            <div class="flex justify-center text-center text-primary-content mb-2">
              Delete
              {{ getDisplayName(contextMenuSelection?.value) }}?
            </div>
            <div class="flex gap-2 items-center justify-center">
              <button
                @click="deleteItem(contextMenuSelection?.value.id)"
                class="btn btn-xs text-error"
              >
                Delete
              </button>
              <button @click="contextMenuSelection = null" class="btn btn-xs">Cancel</button>
            </div>
          </div>
        </div></PrettySm
      >
    </div></Teleport
  >
</template>

<style scoped>
  .font-stroke {
    -webkit-text-stroke: 2px var(--color-base-200);
    color: white;

    /* Set Paint-Order property */
    paint-order: stroke;
  }
</style>
