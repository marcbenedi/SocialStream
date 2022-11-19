import { createApp } from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

const app=createApp(App);
app.use(Buefy);
app.mount('#app')  


// import Vue from 'vue'
// import App from './App.vue'
// 
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
