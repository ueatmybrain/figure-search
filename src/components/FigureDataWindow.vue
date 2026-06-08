<script setup>
  import { onMounted, ref } from 'vue';
  import FlagIcon from './FlagIcon.vue';
  import { figureDelete, figureGet, figureSet } from '../db/idb.js';
  import PrettySm from './PrettySm.vue';
  import { copyToCb, getCategoryColor, getJpValue, transformValue, withoutKeys } from '../utils.js';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { PlusCircleIcon } from '@heroicons/vue/24/outline';
  import { EyeIcon, EyeSlashIcon, PhotoIcon, TagIcon } from '@heroicons/vue/24/solid';
  import { useAlertsStore } from '../stores/alerts.js';
  import GalleryWindow from './GalleryWindow.vue';

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
  async function switchCurrentEntry(key) {
    fsearch.currentEntry = await figureGet(key).then((r) => r);
  }
  const scrollContainer = ref(null);

  function onWheelScroll(e) {
    // if shift is held, let browser handle normal horizontal scroll
    if (e.shiftKey) return;
    // scroll sideways instead of vertically
    scrollContainer.value.scrollLeft += e.deltaY;
  }
  function showFigureTooltip(figure) {
    figureTooltip.value = figure.value;
  }
  function hideFigureTooltip() {
    figureTooltip.value = null;
  }

  function hasAdultTag(entry) {
    if (!entry.value.tags) return false;
    for (const tag of entry.value.tags) {
      for (const adultTag of ['18+', 'nsfw', 'nsfw+']) {
        if (tag.title === adultTag) {
          return true;
        }
      }
    }
    return false;
  }

  const contextMenuSelection = ref(null);
  function showFigureContextMenu(event, entry) {
    event.preventDefault();
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    contextMenuPos.value = { x: centerX, y: centerY };
    contextMenuSelection.value = entry;
  }
  function handleClickOutside(event) {
    if (contextMenuSelection.value && !ctxMenu.value?.contains(event.target)) {
      contextMenuSelection.value = false;
    }
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
      await figureSet(figureObject.id, figureObject);
      await fsearch.updateEntries();
      alerts.push({
        message: 'Added/Updated "' + figureObject.character + '" successfully!',
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
</script>

<template>
  <div v-if="fsearch.entries.length === 0" class="">
    <div class="text-deathpink flex mx-auto">No figure data.</div>
    <button
      class="flex gap-1 cursor-pointer hover:underline mb-8 mt-4 ml-4"
      @click="addFigureFromClipboard()"
    >
      <PlusCircleIcon class="size-6" /> <span> Paste from clipboard (JSON)</span>
    </button>
  </div>
  <div id="FigureDataWindow" v-if="fsearch.entries.length > 0">
    <div
      ref="scrollContainer"
      class="flex gap-3 overflow-x-auto whitespace-nowrap p-4 rounded-lg no-scrollbar"
      @wheel.prevent="onWheelScroll"
    >
      <div v-for="entry in fsearch.entries" :key="entry.id">
        <div
          v-if="fsearch.nsfwHidden && hasAdultTag(entry)"
          class="rounded-full w-16 h-16 object-cover ring-2 ring-offset-2 border-pink-500"
        >
          <div class="pt-5 text-center">N/A</div>
        </div>
        <div class="flex-shrink-0" v-if="!(fsearch.nsfwHidden && hasAdultTag(entry))">
          <div class="relative size-16">
            <div
              v-if="hasAdultTag(entry)"
              class="pointer-events-none select-none absolute text-pink-500 outline-solid rounded-full shadow-white bg-white z-20"
            >
              +18
            </div>
            <img
              :src="entry.value.icon"
              class="rounded-full cursor-pointer w-16 h-16 object-cover ring-2 ring-offset-2 border-deathpink hover:opacity-90"
              :class="entry.value.id === fsearch.currentEntry.value.id ? 'ring-4' : ''"
              :style="{ '--tw-ring-color': getCategoryColor(entry.value.category) }"
              @click.left="switchCurrentEntry(entry.value.id)"
              @click.right="showFigureContextMenu($event, entry)"
              @mousemove="updateMouse"
              @mouseenter="showFigureTooltip(entry)"
              @mouseleave="hideFigureTooltip()"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        class="flex gap-1 cursor-pointer hover:underline mb-2 ml-3"
        @click="addFigureFromClipboard()"
      >
        <PlusCircleIcon class="size-5" />
        <div class="text-xs">Paste from clipboard (JSON)</div>
      </button>
    </div>
    <div
      ref="ctxMenu"
      class="fixed bg-base-100 p-.5 z-200"
      v-if="contextMenuSelection"
      :style="{
        left: contextMenuPos.x + 10 + 'px',
        top: contextMenuPos.y + 20 + 'px',
      }"
    >
      <PrettySm
        ><div class="m-2 w-32">
          <div class="font-bold text-deathpink">
            <img :src="contextMenuSelection?.value.icon" class="mx-auto p-4" />
            <div class="flex justify-center text-center text-primary-content mb-2">
              Delete "{{ contextMenuSelection?.value?.character }}"?
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
    </div>

    <div
      class="fixed p-.5 z-100"
      v-if="figureTooltip && !contextMenuSelection"
      :style="{
        left: mouse.x + 10 + 'px',
        top: mouse.y + 20 + 'px',
      }"
    >
      <PrettySm
        ><div class="m-2 w-32">
          <div class="font-bold text-deathpink">
            {{
              figureTooltip?.character ||
              figureTooltip?.characters ||
              figureTooltip?.title ||
              figureTooltip?.classification
            }}
            <span v-if="figureTooltip.dimensions && figureTooltip.dimensions !== 'non-scale'">{{
              figureTooltip?.dimensions
            }}</span>
          </div>
          <div>
            {{
              figureTooltip?.jp.character ||
              figureTooltip?.jp.characters ||
              figureTooltip?.jp.title ||
              figureTooltip?.jp.classification
            }}
          </div>
          <div :style="'color: ' + getCategoryColor(figureTooltip?.category)">
            {{ figureTooltip?.category }}
          </div>
          <div class="divider"></div>
          <div class="text-sm">
            {{ new Date(figureTooltip.capturedAt).toLocaleString('de-DE') }}
          </div>
        </div></PrettySm
      >
    </div>
    <GalleryWindow v-if="!(hasAdultTag(fsearch.currentEntry) && fsearch.nsfwHidden)" />
    <a
      :href="'https://myfigurecollection.net/item/' + fsearch.currentEntry?.value?.id"
      target="_blank"
    >
      <div class="badge hover:badge-outline cursor-pointer">
        MFC: {{ fsearch.currentEntry?.value?.id }}
      </div></a
    >
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
              v-for="(value, key) in withoutKeys(fsearch.currentEntry.value, [
                'id',
                'icon',
                'images',
                'various',
                'releases',
                'meta_searchterm',
                'meta_link_price',
                'jp',
                'tags',
                'capturedAt',
              ])"
              :key="key"
            >
              <th>{{ key }}</th>
              <td>
                <div
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ transformValue(value) }}
                </div>
              </td>
              <td>
                <div
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ getJpValue(fsearch.currentEntry.value, key) }}
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
