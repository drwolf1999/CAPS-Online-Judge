import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import ProblemList from '@/components/problems/ProblemList.vue';
import CreateProblem from '@/components/problems/ProblemCreate';
// import store from '../store/store.js';

Vue.use(Router);

// const requireAuth = () => (from, to, next) => {
//     if (store.getters.isLogined) return next(); // isAuth === true면 페이지 이동
//     next('auth'); // isAuth === false면 다시 로그인 화면으로 이동
// };

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'CAPS OJ',
            component: Home,
        },
        {
            path: '/problem',
            name: 'Problem List',
            component: ProblemList,
        },
        {
            path: '/problem/create',
            name: 'Create Problem',
            component: CreateProblem,
        },
    ]
});

export default router;