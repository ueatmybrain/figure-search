import { defineStore } from 'pinia';

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    queue: [],
  }),
  actions: {
    push(alert) {
      this.queue.push(alert);
      console.log(alert);
      setTimeout(() => {
        const index = this.queue.indexOf(alert);
        if (index !== -1) {
          this.queue.splice(index, 1);
        }
      }, 8000);
    },
    remove(alert) {
      const index = this.queue.indexOf(alert);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    },
  },
});
