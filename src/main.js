import Vue from 'vue'
import App from './App.vue'
import VueFire from 'vuefire'
var VueGoogleApps = require('vue2-google-maps')
Vue.use(VueFire);
Vue.use(VueGoogleApps, {
  load: {
    key: 'AIzaSyDfVVSKQjGSDWKsN1U-bF9atJSfWXaYWhw',
    libraries: 'places'
  }
});
new Vue({
  el: '#app',
  render: h => h(App)
})
