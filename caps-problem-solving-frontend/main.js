require('./node_modules/katex/dist/katex.min.js');

import Vue from 'vue';
import Notifications from 'vue-notification';
import vuetify from './src/plugins/vuetify';
import App from './src/App.vue';
import router from './src/router/router';
import store from './src/store/store';
import VueQuill from 'vue-quill';


Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.use(VueQuill);

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app');