<script setup>
  import { wordDict } from '../constants.js';
  import { copyToCb } from '../utils.js';
  import FlagIcon from './FlagIcon.vue';
  import { useFigureSearchStore } from '../stores/figuresearch.js';
  import { deleteDictEntry, dictionaryEntries, setDictEntry } from '../db/idb.js';
  import { onMounted, ref, useTemplateRef } from 'vue';

  const fsearch = useFigureSearchStore();
  const jpCustomDict = ref([]);
  const englishCustomDict = ref('');
  const customDictionary = ref([]);
  function hasContent(arr) {
    for (const item of arr) {
      if (item) {
        return true;
      }
    }
    return false;
  }
  onMounted(async () => {
    customDictionary.value = await dictionaryEntries();
  });
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
  function clearInputs() {
    englishCustomDict.value = '';
    jpCustomDict.value = [];
  }
</script>

<template>
  <div class="font-bold">Dictionary</div>
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
</template>

<style scoped></style>
