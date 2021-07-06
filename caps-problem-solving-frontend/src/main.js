import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router.js';
import store from './store/store.js';
import VueNotifications from 'vue-notification';
import vuetify from './plugins/vuetify.js';
import VueQuill from 'vue-quill';
require('../node_modules/katex/dist/katex.min.js');
import IO from 'socket.io-client';
import RestAPI from "@/constants/RestAPI";
const IO_STATUS_URL = 'getStatus';

Vue.config.productionTip = false;

Vue.use(VueNotifications);
Vue.use(VueQuill);
Vue.prototype.$statusSocket = IO(RestAPI.SERVER_DOMAIN + IO_STATUS_URL);
Vue.prototype.$contestMOD = true;

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app');