import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes';
import App from './App.vue'

import 'vue2-slot-calendar/lib/calendar.min.css';


Vue.use(VueRouter)

const router = new VueRouter({routes, mode: 'history'});
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
