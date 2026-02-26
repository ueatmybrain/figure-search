<script setup>
  import { onMounted, ref, useTemplateRef, watch } from 'vue';
  import FlagIcon from './FlagIcon.vue';
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
  import { EyeIcon } from '@heroicons/vue/24/solid';
  import { EyeSlashIcon } from '@heroicons/vue/24/solid';
  import { PencilSquareIcon } from '@heroicons/vue/24/solid';
  import StoreButton from './StoreButton.vue';
  import { invalidInputs, wordDict } from '../constants.js';
  import FigureDataWindow from './FigureDataWindow.vue';
  import { copyToCb, hasInvalid } from '../utils.js';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { deleteDictEntry, dictionaryEntries, idbClear, setDictEntry } from '../db/idb.js';
  import { useAlertsStore } from '../stores/alerts.js';
  import PrettySm from './PrettySm.vue';

  const fsearch = useFigureSearchStore();
  const customSearchLink = ref('https://www.ebay.de/sch/i.html?_nkw=');
  const customSearchLabel = ref('ebay');
  const jpCustomDict = ref([]);
  const englishCustomDict = ref('');
  const customDictionary = ref([]);
  const editCustomVisible = ref(false);
  function clearInputs() {
    englishCustomDict.value = '';
    jpCustomDict.value = [];
  }
  async function addToDict() {
    if (!englishCustomDict.value) {
      return;
    }
    const cleaned = jpCustomDict.value.filter((v) => v != null && v !== '');
    if (cleaned.length <= 0) {
      cleaned.push('---');
    }
    const payload = { en: englishCustomDict.value, jp: cleaned };
    await setDictEntry(payload);
    clearInputs();
    customDictionary.value = await dictionaryEntries();
  }
  async function deleteFromDict(id) {
    await deleteDictEntry(id);
    customDictionary.value = await dictionaryEntries();
  }
  let searchInputElem = ref();
  onMounted(async () => {
    customDictionary.value = await dictionaryEntries();
    console.log(customDictionary.value);
    searchInputElem = useTemplateRef('search-input');
  });

  function hasContent(arr) {
    for (const item of arr) {
      if (item) {
        return true;
      }
    }
    return false;
  }
  function clearIndexedDb() {
    idbClear();
    useAlertsStore().push({
      message: 'Indexed DB was cleared successfully! Please refresh this page.',
    });
  }
</script>

<template>
  <div class="w-150">
    <FigureDataWindow></FigureDataWindow>
    <PrettySm
      ><div class="w-135 m-4">
        <p class="text-sm font-bold mb-4 text-base-content">Advanced Search</p>
        <div>
          <div class="mb-4">
            <label class="input w-120">
              <MagnifyingGlassIcon class="size-5" />
              <input
                type="search"
                class="grow"
                placeholder="Search"
                ref="search-input"
                v-model="fsearch.searchInput"
              />
            </label>
            <button class="btn hover:text-error" @click="fsearch.clearSearchInput()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
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
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                  label: 'Google',
                }"
              />
            </a>
            <a
              :href="'https://jp.mercari.com/search?keyword=' + fsearch.searchInput"
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
            <button @click="clearIndexedDb()" class="btn text-error mr-10">Clear IndexedDB</button>
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
    <div class="collapse collapse-arrow mt-4">
      <input type="checkbox" />
      <div class="collapse-title text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-5 inline"
        >
          <path
            d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
          />
        </svg>
        FigureSearch dictionary
      </div>
      <div class="collapse-content text-sm">
        <table class="table table-xs">
          <thead>
            <tr>
              <th><FlagIcon lang="en" /></th>
              <th><FlagIcon lang="jp" /></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="word in wordDict">
              <td>
                <div
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ word.en }}
                </div>
              </td>
              <td>
                <div
                  v-for="entry in word.jp"
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ entry }}
                </div>
              </td>
            </tr>

            <tr v-for="word in customDictionary">
              <td>
                <div
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ word.value.en }}
                </div>
              </td>
              <td>
                <div
                  v-for="entry in word.value.jp"
                  class="badge hover:badge-outline cursor-pointer"
                  @click.left="fsearch.pasteToSearch"
                  @click.right="copyToCb"
                >
                  {{ entry }}
                </div>
              </td>
              <td>
                <button class="btn btn-sm hover:text-error" @click="deleteFromDict(word.id)">
                  Delete
                </button>
              </td>
            </tr>

            <tr>
              <td class="p-2">Add custom entry:</td>
            </tr>
            <tr id="addDictEntryForm">
              <td>
                <input
                  type="text"
                  placeholder="English"
                  class="input-xs w-15"
                  v-model="englishCustomDict"
                />
              </td>
              <td class="max-w-30">
                <div v-for="i in jpCustomDict.length + 1" class="m-2 inline">
                  <input
                    type="text"
                    placeholder="日本語"
                    class="input-xs w-10"
                    v-model="jpCustomDict[i - 1]"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td :class="!englishCustomDict && hasContent(jpCustomDict) ? 'text-error' : ''">
                You need to enter at least an English keyword to submit.
              </td>
              <td>
                <div class="inline">
                  <button
                    class="btn btn-sm mr-2"
                    :class="jpCustomDict.length >= 1 ? '' : ''"
                    :disabled="!jpCustomDict.length >= 1 && !(englishCustomDict !== '')"
                    @click="clearInputs()"
                  >
                    Cancel
                  </button>

                  <button
                    class="btn btn-sm"
                    :class="englishCustomDict ? 'bg-deathpink' : 'opacity-70'"
                    :disabled="!englishCustomDict"
                    @click="addToDict()"
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="collapse collapse-arrow mt-4">
      <input type="checkbox" />
      <div class="collapse-title text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-5 inline"
        >
          <path
            fill-rule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
            clip-rule="evenodd"
          />
        </svg>
        Settings
      </div>
      <div class="collapse-content text-sm">
        <button onclick="are_you_sure.showModal()" class="btn text-error">Clear IndexedDB</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
