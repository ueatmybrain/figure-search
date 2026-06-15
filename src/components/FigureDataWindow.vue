<script setup>
  import { onMounted, ref, toRaw, watch } from 'vue';
  import FlagIcon from './FlagIcon.vue';
  import { figureDelete, figureGet, figureSet } from '../db/idb.js';
  import PrettySm from './PrettySm.vue';
  import {
    copyToCb,
    getCategoryColor,
    getDisplayName,
    getJpValue,
    isIterable,
    transformValue,
    withoutKeys,
  } from '../utils.js';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { PlusCircleIcon } from '@heroicons/vue/24/outline';
  import { EyeIcon, EyeSlashIcon, PhotoIcon, TagIcon } from '@heroicons/vue/24/solid';
  import { useAlertsStore } from '../stores/alerts.js';
  import GalleryWindow from './GalleryWindow.vue';
  import { tableExclusionList } from '../constants.js';
  import ImageGallery from './ImageGallery.vue';
  const fsearch = useFigureSearchStore();
  const alerts = useAlertsStore();
  const denpa = ref(null);
  const figureTooltip = ref(null);
  const mouse = ref({ x: 0, y: 0 });
  const contextMenuPos = ref({ x: 0, y: 0 });
  const ctxMenu = ref(null);
  const tagsVisible = ref(false);

  function updateMouse(e) {
    mouse.value.x = e.clientX;
    mouse.value.y = e.clientY;
  }

  const componentKey = ref(0);

  watch(
    () => fsearch.currentEntry,
    () => {
      componentKey.value++;
    }
  );

  onMounted(async () => {
    await fsearch.updateEntries();
    await fsearch.updateNsfwSetting();
    document.addEventListener('mousedown', handleClickOutside);
  });

  window.addEventListener('message', async (e) => {
    if (e.source !== window) return;
    const msg = e.data;
    if (msg?.type === 'EXT_EVENT') {
      denpa.value = {
        ts: Date.now(),
        source: 'extension',
        kind: msg.payload?.type || 'generic',
        payload: msg.payload,
      };
      await figureSet(msg.payload.id, msg.payload);
      fsearch.currentEntry = msg.payload;
      await fsearch.updateEntries();
    }
  });

  const contextMenuSelection = ref(null);

  function handleClickOutside(event) {
    if (contextMenuSelection.value && !ctxMenu.value?.contains(event.target)) {
      contextMenuSelection.value = false;
    }
  }

  function splitDataString(str) {
    return str.split('_$split$_');
  }

  async function copyFigureJsonToCb() {
    const stringifiedData = JSON.stringify(fsearch.currentEntry?.value, null, 2);
    await navigator.clipboard.writeText(stringifiedData);
    alerts.push({message:'Copied data for ' + getDisplayName(fsearch.currentEntry?.value) + '!'});
  }
</script>

<template>
  <div id="FigureDataWindow" v-if="fsearch.entries.length > 0">
    <ImageGallery
      :key="componentKey"
      v-if="!(fsearch.hasAdultTag(fsearch.currentEntry) && fsearch.nsfwHidden)"
    />
    <div class="flex flex-row my-2 gap-2">
      <a
        :href="'https://myfigurecollection.net/item/' + fsearch.currentEntry?.value?.id"
        target="_blank"
      >
        <button class="badge hover:badge-outline cursor-pointer">
          Open entry on<img
            class="size-6 p-1"
            src="https://static.myfigurecollection.net/ressources/assets/webicon.png"
          /></button
      ></a>
      <div class="badge hover:badge-outline cursor-pointer" @click="copyFigureJsonToCb">Copy JSON</div>
    </div>
    <div>
      <div class="overflow-x-auto w-150">
        <table class="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th><FlagIcon lang="en" /></th>
              <th><FlagIcon lang="jp" /></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(value, key) in withoutKeys(fsearch.currentEntry.value, tableExclusionList)"
              :key="key"
            >
              <th>{{ key }}</th>
              <td>
                <div>
                  <div
                    v-for="subval in splitDataString(transformValue(value))"
                    class="badge hover:badge-outline cursor-pointer h-auto"
                    @click.left="fsearch.pasteToSearch"
                    @click.right="copyToCb"
                  >
                    {{ subval }}
                  </div>
                </div>
              </td>
              <td>
                <div
                  v-for="subval in splitDataString(getJpValue(fsearch.currentEntry.value, key))"
                  class="badge hover:badge-outline cursor-pointer h-auto"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ subval }}
                </div>
              </td>
            </tr>
            <tr>
              <th>product id</th>
              <td>
                <div v-for="release in fsearch.currentEntry.value.releases">
                  <div class="tooltip" :data-tip="release.date">
                    <div
                      class="badge hover:badge-outline cursor-pointer"
                      @click.left="fsearch.pasteToSearch"
                      @click.right="copyToCb"
                    >
                      {{ release.productId }}
                    </div>
                  </div>
                  <span class="ml-2">{{ release.date }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="fsearch.currentEntry?.value?.various" class="text-red-400 text-xs py-8">
          {{ fsearch.currentEntry?.value?.various }}
        </div>
      </div>
      <div
        v-if="fsearch.currentEntry.value.tags"
        @click="tagsVisible = !tagsVisible"
        class="mb-4 flex cursor-pointer hover:opacity-80"
      >
        <TagIcon class="size-5"></TagIcon>
        <EyeIcon class="size-5" v-if="tagsVisible" />
        <EyeSlashIcon class="size-5" v-if="!tagsVisible" />
        <span class="text-sm select-none ml-2">show/hide tags</span>
      </div>
      <div v-if="fsearch.currentEntry.value.tags && tagsVisible" class="m-4 flex gap-2 flex-wrap">
        <a
          class="badge"
          :href="'https://myfigurecollection.net' + tag.link"
          target="_blank  "
          v-for="tag in fsearch.currentEntry.value.tags"
          >{{ tag.title }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
  @layer utilities {
    .modal {
      @layer daisyui.modifier {
        &.modal-open,
        &[open],
        &:target,
        .modal-toggle:checked + & {
          & .modal-box {
            translate: 0 0;
            scale: 2;
            opacity: 1;
          }
        }
      }
    }
  }
</style>
