import { createApp, ref } from 'vue';

createApp({
  setup() {
    return {
      count: ref(0)
    };
  }
  methods: {
    fetch_dog_api
  }
}).mount('#app');