<script setup>
  import { computed, onMounted, ref, toRaw, useTemplateRef, watch } from 'vue';
  import FlagIcon from './FlagIcon.vue';
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
  import { EyeIcon } from '@heroicons/vue/24/solid';
  import { EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  import StoreButton from './StoreButton.vue';
  import { invalidInputs, wordDict } from '../constants.js';
  import FigureDataWindow from './FigureDataWindow.vue';
  import { hasInvalid } from '../utils.js';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import {
    deleteDictEntry,
    dictionaryEntries,
    figureGet,
    figureSet,
    idbClear,
    setDictEntry,
    settingsAlter,
    settingsGet,
  } from '../db/idb.js';
  import { useAlertsStore } from '../stores/alerts.js';
  import PrettySm from './PrettySm.vue';
  const fsearch = useFigureSearchStore();
  const customSearchLink = ref('');
  const customSearchLabel = ref('');

  const editCustomVisible = ref(false);
  async function initCustom() {
    const cs = await settingsGet('custom-search');
    if (cs) {
      customSearchLink.value = cs.link;
      customSearchLabel.value = cs.label;
    } else {
      customSearchLink.value = 'https://www.ebay.de/sch/i.html?_nkw=';
      customSearchLabel.value = 'ebay';
    }
  }
  async function updateCustomSearch() {
    await settingsAlter('custom-search', {
      link: customSearchLink.value,
      label: customSearchLabel.value,
    });
  }

  function initSearch() {
    if (fsearch.currentEntry?.value && fsearch.currentEntry?.value?.meta_searchterm) {
      fsearch.searchInput = fsearch.currentEntry.value.meta_searchterm;
    } else {
      fsearch.searchInput = '';
    }
  }
  let searchInputElem = ref();
  onMounted(async () => {
    searchInputElem = useTemplateRef('search-input');
    initSearch();
    await initCustom();
  });
  function clearIndexedDb() {
    idbClear();
    useAlertsStore().push({
      message: 'Indexed DB was cleared successfully! Please refresh this page.',
    });
  }
  watch(
    () => fsearch.currentEntry,
    () => {
      initSearch();
    }
  );
  watch(customSearchLink, async () => {
    await updateCustomSearch();
  });
  watch(customSearchLabel, async () => {
    await updateCustomSearch();
  });
  let saveTimer;
  watch(
    () => fsearch.searchInput,
    (newValue) => {
      if (!fsearch.currentEntry.value) {
        return;
      }
      clearTimeout(saveTimer);

      saveTimer = setTimeout(async () => {
        await figureSet(fsearch.currentEntry.value.id, {
          ...toRaw(fsearch.currentEntry.value),
          meta_searchterm: newValue,
        });
      }, 50);
    }
  );
</script>

<template>
  <div class="w-150 mb-8">
    <FigureDataWindow></FigureDataWindow>
    <PrettySm
      ><div class="w-135 m-4">
        <p class="text-sm font-bold mb-4 text-base-content">Advanced Search</p>
        <div>
          <div class="mb-4">
            <label class="input w-135">
              <MagnifyingGlassIcon class="size-5" />
              <input
                type="search"
                class="grow"
                placeholder="Search"
                ref="search-input"
                v-model="fsearch.searchInput"
              />
            </label>
            <div class="justify-center inline-flex gap-4">
              <label class="label font-bold text-xs text-primary-content">
                <input
                  type="checkbox"
                  checked="checked"
                  class="checkbox-xs"
                  v-model="fsearch.autoRemoveInvalid"
                />
                Auto-remove invalid characters ({{ invalidInputs.join(',') }})
              </label>
              <button
                @click="fsearch.removeInvalidSearchCharacters()"
                class="font-bold text-xs"
                :class="
                  !hasInvalid(fsearch.searchInput)
                    ? 'opacity-20'
                    : 'hover:underline cursor-pointer text-orange-400'
                "
              >
                Remove invalid characters
              </button>
              <div class="flex gap-1">
                <button class="btn btn-sm hover:text-error" @click="fsearch.clearSearchInput()">
                  <TrashIcon class="size-3 px-.7" />
                </button>
              </div>
            </div>
          </div>
          <div class="gap-2 flex justify-center">
            <a
              :href="'https://www.google.com/search?q=' + fsearch.searchInput"
              target="_blank"
              rel="noopener"
              ><StoreButton
                :data="{
                  image:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1280px-Google_2015_logo.svg.png',
                  label: 'Google',
                }"
              />
            </a>
            <a
              :href="
                'https://jp.mercari.com/search?keyword=' + fsearch.searchInput + '&status=on_sale'
              "
              target="_blank"
              rel="noopener"
              ><StoreButton
                :data="{
                  image:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLHiZHevA-xm_vzUi30TkjV7W0Yjf_FXzUA&s',
                  label: 'Mercari',
                }"
              />
            </a>
            <a
              :href="'https://www.suruga-ya.jp/search?category=&search_word=' + fsearch.searchInput"
              target="_blank"
              rel="noopener"
              ><StoreButton
                :data="{
                  image:
                    'https://www.wakuwakumono.com/wp-content/uploads/2017/10/suruga-ya-logo-proxy.jpg',
                  label: 'Suruga-ya',
                }"
              />
            </a>

            <a
              :href="'https://buyee.jp/item/search/query/' + fsearch.searchInput"
              target="_blank"
              rel="noopener"
              ><StoreButton
                :data="{
                  image: 'https://rajikaru.co.uk/wp-content/uploads/2018/02/YAJ.jpg',
                  label: 'YahooAJ',
                }"
              />
            </a>
            <div class="flex items-end">
              <a :href="customSearchLink + fsearch.searchInput" target="_blank"
                ><button
                  class="h-10 p-2 text-[.7rem] rounded-lg border-deathpink border-2 cursor-pointer bg-white min-w-19 text-black hover:text-deathpink"
                >
                  <div class="m-[-.2rem]">{{ customSearchLabel }}</div>
                  <div class="text-[.5rem]">(custom)</div>
                </button>
              </a>
              <div @click="editCustomVisible = !editCustomVisible" class="m-1 flex cursor-pointer">
                <PencilSquareIcon class="size-3"></PencilSquareIcon>
                <EyeIcon class="size-3" v-if="editCustomVisible" />
                <EyeSlashIcon class="size-3" v-if="!editCustomVisible" />
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-center gap-2" v-show="editCustomVisible">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs">Label</legend>
              <input
                type="text"
                placeholder="Example"
                class="input input-xs"
                v-model="customSearchLabel"
              />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs">Search URL</legend>
              <input
                type="text"
                placeholder="https://example.com/?search="
                class="input input-xs w-65"
                v-model="customSearchLink"
              />
            </fieldset>
          </div>
        </div></div
    ></PrettySm>
    <dialog id="are_you_sure" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Are you sure?</h3>
        <p class="py-4">This will delete all DB entries and can't be undone.</p>
        <div class="flex flex-row ml-50">
          <form method="dialog" class="flex">
            <button @click="clearIndexedDb()" class="btn text-deathpink mr-10">
              Clear IndexedDB
            </button>
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
