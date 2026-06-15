import { defineStore } from 'pinia';

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    queue: [],
  }),
  actions: {
    //alertObject = {message: string, type: 'error'||'info'||'warning'||'success' ('info' is the default)}
    push(alertObject) {
      this.queue.push(alertObject);
      console.log(alertObject);
      setTimeout(() => {
        const index = this.queue.indexOf(alertObject);
        if (index !== -1) {
          this.queue.splice(index, 1);
        }
      }, 8000);
    },
    remove(alertObject) {
      const index = this.queue.indexOf(alertObject);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    },
  },
});
