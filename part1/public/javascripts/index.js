import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
        dogImage: ''
    };
  },

  methods: {
    fetch_dog_api() {
        fetch('https://dog.ceo/api/breeds/image/random')
        .then((res) => res.json())
        .then((data) => {
            this.dogImage = data.message;
        });
    }
  },
  mounted() {
    this.fetch_dog_api();
  }
}).mount('#app');