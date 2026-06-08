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
  getters: {},
  actions: {
    pasteToSearch(event) {
      this.searchInput = [this.searchInput, event.currentTarget.innerText].join(' ');
      if (this.autoRemoveInvalid) this.removeInvalidSearchCharacters();
    },
    async updateEntries() {
      figureEntries().then((entries) => {
        this.entries = entries.sort((a, b) => b.value.capturedAt - a.value.capturedAt);
        console.log(this.entries);
        this.currentEntry = this.entries[0];
      });
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
      console.log(await settingsGet('nsfw'))
    },
    async toggleNsfw() {
      await this.updateNsfwSetting();
        await settingsAlter('nsfw', !this.nsfwHidden);
      await this.updateNsfwSetting();
    },
  },
});
