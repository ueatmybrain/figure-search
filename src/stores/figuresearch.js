import { defineStore } from 'pinia';
import { figureEntries } from '../db/idb.js';
import { settingsAlter, settingsGet } from '../db/idb.js';
import { removeInvalid } from '../utils.js';

export const useFigureSearchStore = defineStore('fsearch', {
  // arrow function recommended for full type inference
  state: () => ({
    searchInput: '',
    entries: [],
    currentEntry: {},
    inputHistory: [],
    autoRemoveInvalid: true,
    nsfwHidden: true,
  }),
  getters: {
    filteredEntries() {
      if (!this.nsfwHidden){return this.entries;}
      let filtered = []
      for (const entry of this.entries) {
        if (!this.hasAdultTag(entry)){
          filtered.push(entry)
        }
      }
      return filtered
    }
  },
  actions: {
    pasteToSearch(event) {
      this.searchInput = [this.searchInput, event.currentTarget.innerText].join(' ');
      if (this.autoRemoveInvalid) this.removeInvalidSearchCharacters();
    },
    async updateEntries() {
      figureEntries().then((entries) => {
        this.entries = entries.sort((a, b) => b.value.capturedAt - a.value.capturedAt);
        if (this.nsfwHidden) {
        for (const entry of this.entries) {
          if (!this.hasAdultTag(entry)) {
            this.currentEntry = entry;
            break;
          }
        }
        }else{this.currentEntry = this.entries[0];}

      });
    },
    hasAdultTag(entry) {
  if (!entry.value.tags) return false;
  for (const tag of entry.value.tags) {
    for (const adultTag of ['18+', 'nsfw', 'nsfw+']) {
      if (tag.title === adultTag) {
        return true;
      }
    }
  }
  return false;
  },
    removeInvalidSearchCharacters() {
      if (this.searchInput === '') {
        return;
      }
      this.searchInput = removeInvalid(this.searchInput);
    },
    clearSearchInput() {
      if (this.searchInput === '') {
        return;
      }
      this.searchInput = '';
    },
    async updateNsfwSetting() {
      this.nsfwHidden = await settingsGet('nsfw');
    },
    async toggleNsfw() {
      await this.updateNsfwSetting();
        await settingsAlter('nsfw', !this.nsfwHidden);
      await this.updateNsfwSetting();
    },
  },
});
