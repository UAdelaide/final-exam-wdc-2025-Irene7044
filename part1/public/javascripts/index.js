import { createApp, ref } from 'vue';

createApp({
  setup() {
    return {
      count: ref(0)
    };
  },

  data: {
    dogImage: ''
  },

  methods: {
    fetch_dog_api() {
        fetch('https://dog.ceo/dog-api/documentation/random')
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