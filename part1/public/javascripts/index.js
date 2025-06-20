import { createApp, ref } from 'vue';

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