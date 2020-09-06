import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import RestAPI from "./constants/RestAPI";
require('./node_modules/katex/dist/katex.min.js');
import Notifications from 'vue-notification';
import vuetify from './plugins/vuetify';
// @ts-ignore
import VueQuill from 'vue-quill';
import firebase from 'firebase';
import 'firebase/messaging';

Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.use(VueQuill);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALcmjx6k2GM6nSGWgTMlexKURtB3kCx0c",
  authDomain: "caps-pusher.firebaseapp.com",
  databaseURL: "https://caps-pusher.firebaseio.com",
  projectId: "caps-pusher",
  storageBucket: "caps-pusher.appspot.com",
  messagingSenderId: "110000960034",
  appId: "1:110000960034:web:df381f6ed1725cdb26907b",
  measurementId: "G-FRG44BGH7K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.usePublicVapidKey('BKRGc_Xvg7tGNpYFoPU73kumtUTutTinmr3cwSr9YuuKvSjaNAr5SBzj6t4DI5ONahR9d0hrItFdiqCbmew1Gpw');

firebase.analytics();

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');