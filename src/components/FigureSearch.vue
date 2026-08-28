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
  const buttonConfigs = [
    //{ label_image: '', label_text: '', search_url: '', and_params: '' },
    {
      label_image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1280px-Google_2015_logo.svg.png',
      label_text: 'Google',
      search_url: 'https://www.google.com/search?q=',
      and_params: '',
    },
    {
      label_image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWIAAAA8CAMAAABrcUB7AAAAXVBMVEUAAAD/////////////////////////////////////////////////////////////////////////////////swX/swX/swb/swX/swb/swb/swX/swf/////swbP+Iu0AAAAHXRSTlMA9BTQ4ArsVCGCdMGzp0iaLpA7Z17sO8pWp2uGIoe+1CIAAAZoSURBVHjapJjpkp0gEIXZRUTAJUllIe//mNnqVlL3ADad82tqZlrpz9OLip9ydSBndFyTEnM6Q96Mk7+i9zVZMSl/H1EbWaXR8bi96ErWjn6Htu/86fuzPnwTv/X158+fiWkuA0iuPksHL4iyd5T0aNSZzVu4yScJMUrGhYP401/CXcR2wTRXP4MYtSWSAbOkR6NsMM1wEywNMUZegJjuYUDMTNNVorbzEfA+KIREANw/iwuWhBilCyAmEgbElDSXGcSoPG6r6zjl+NAukhn7MdEQo25ATCLcQxym03SVLjMwstdP0XIRA+XnJ8xEXA9ATCAMiPlpujqj0B1TlOusoie1UVqV4iGumwXET4QRMT9NiCE4AnXRovdOqymGVkWFh7jugJhCGBHflaRo5xBjuaIOarRWzTZMhSUTD3ENgPiZMCJeyWn6PmJeta/0aG0xvEywKjzENQHiJ8KIODDT3OqsbvGmZSZ6xz5sKl1G8RA7BYjHhBFx4qZ51WmdDBNCzXIf8sZDXDMgHhJGxEWyi13XWWkw4ZQSbms8f8zl7AFxmzAgZqb5z+5mY/2vdjwdLhUM6SndPMQZEDcJA2J2mv7fSg9rRzma9tCBRsztU8pNhzvFQiwtIkbCPcSJkyZRPphRtDXNVrKmoqw/r/jUzI8mxLwUJVRZsmv78UnWX7pRuU/6guw/ij/ipJkEWQETLaNFZvf/JBvkaGT5py9GSVeUJ516+sl87RO+WmmWh09Ym6BL6a6NDRIqb8F5YGM0sXzfCW9JeMVEYZc3DA8P0jzf0jw4Nh6NRItp4Dty1wLxdV3AZ8r47RoHJv3LkmcTXsbvyD0WUcxoa4/1jWQwnBWqA18rUhFdtOKD2mESFpHUdE7ZTLOEy5OOa1oPyBOf2wWM2k/Itc/iHaPLIZmFS1jRuiz6OLxqaeV0NttCZ+ygZvGMitq8TrQHRSs8VxZhTLN3+wPTvOpeSqSND92oukjbi3D9ldDixpvkDjdiLBWBRxjvfndnlgMjav37ClIQtDQs4cj1G7Av0ucRdqTMcnGfMOgvYdwnND3NJNyfo5LKzkpI0oO3RtHoqA1MTLWxZvVinoeFAhP3BWnq11HLaScPvOGmIC093dwogpteQ5K1UbA8jJNA0a2wi7serz+Y8lh24KMwsQZe2FMU/ej4v5y9mEcYjz7QDf+71/XlMFemdgoH0MebSXmrdPyVmZm2hfF2xyI8mabHe8a6vmrYeDFUglI9Jl4IFN77JLsD+/bJ+EbBIoxphuHEqmBEEauGxZ+KOM+8kmMzTTDt6E0uMb60MQmLDNehz7sfzZzbbsIwDIadHifaAKXagibt/V9zG9Dlwq3t2oy4VwgKSj6c1HZ+O7tyyI75jQJPu38lYkW+WEHYijigoTdv4pVXl98oglUBcsXe2hXdZN4oTo8ZDyg05Jy28o87xdkdZ8OYsG2aTV6rM7w1aLWSwUN8rdPWrtwbbEZ8lewSdqdtvL8Yvublw0oaQL8w9MBDDwodBSLM27A99FgmObV1s/zQUZoGKh9A70Hc6wjbA2j4G3AFBwoTzoq15dNAOxBPSsL2NBAsI2jhGBBiPiUfiyYz5YgHLWF7MhPynBEl7mCpfEpeoS9WELal5DNizhAjmqODgyUp4mAkjE1hlB4siRFjDXsEB8ejYiu+mAjLj0fxNKWI5zWpioNDfjHik56w/ZCfR3xLqODvepCqiBF3asJGqQqJ+Hz4vaZYM7JBTnBV/aPgKsi9YjVhm+CKQnxhvEwXskE54lFP2CIbJBCjzAdyzRyKXwP629Zi3rRF+OMdw7eJX0cgEU/0A9qjhDsjPjMVSzLCdgm3HvEMRQsRTsAhhnq7diKJCdsLEdSIJwCX5TSBrN46I8QMYXs5jRpxBPBZFBZQNLZmGElI2F4UpkY8AZQsbQxnYBBvbJzdGuJPlrC9tJFHjM3fa4FuoNdVjxAzhI0FukrE3RHAbZl5oMuOR4SYIWwrM1cijhWA32YJGTHlGicZYWuzBDFiHNc6bvmREVOucRISNrX80CEebu97blyTEVOucZISNjSu4RHjh2dz74/lu/1SRky5xklM+Fntl7qN2KsdHlOrh6m/8/XeRCwjplzjJCf8pCZicTuB0P5c+Ub/rfAyYso1TjsIP6cVXhUDSjTjq1BDxw43dJQj7teTI2kXYXtDx283QU5E2BXwFwAAAABJRU5ErkJggg==',
      label_text: 'Doorzo',
      search_url: 'https://www.doorzo.com/en/search?keywords=',
      and_params: '',
      background_color: 'bg-black',
    },
    {
      label_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLHiZHevA-xm_vzUi30TkjV7W0Yjf_FXzUA&s',
      label_text: 'Mercari',
      search_url: 'https://jp.mercari.com/search?keyword=',
      and_params: '&status=on_sale',
    },
    {
      label_image:
        'https://www.wakuwakumono.com/wp-content/uploads/2017/10/suruga-ya-logo-proxy.jpg',
      label_text: 'Suruga-Ya',
      search_url: 'https://www.suruga-ya.jp/search?category=&search_word=',
      and_params: '',
    },
    {
      label_image:
        'https://image-mall.rakufun.com/crmebimage/public/content/2026/01/14/79c1a6a8f40b426e885a6a46209cbb6ahoitssyzy4.png',
      label_text: 'JDirectItems',
      search_url: 'https://buyee.jp/item/search/query/',
      and_params: '',
    },
  ];

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
              v-for="config in buttonConfigs"
              :href="config.search_url + fsearch.searchInput + config.and_params"
              target="_blank"
              rel="noopener"
              ><StoreButton
                :data="{
                  image: config.label_image,
                  label: config.label_text,
                  bg: config.background_color,
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
