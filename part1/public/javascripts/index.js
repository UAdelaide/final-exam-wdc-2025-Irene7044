import { createApp, ref } from 'vue';

createApp({
  setup() {
    return {
      count: ref(0)
    };
  }
  methods: {
    fetch_dog_api() {
        fetch('https://dog.ceo/dog-api/documentation/random')
        .then(res =>)
    }
  }
}).mount('#app');