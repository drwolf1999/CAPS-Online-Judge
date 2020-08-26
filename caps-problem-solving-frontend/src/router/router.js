import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import ProblemList from '@/components/problems/ProblemList.vue';
import ProblemForm from '@/components/problems/ProblemForm';
import ProblemView from '@/components/problems/ProblemView';
import Status from '@/components/status/Status';
import Auth from '@/components/auth/Auth';
import store from '../store/store.js';
import Ranking from "@/components/ranking/Ranking";

Vue.use(Router);

const requireAuth = () => (from, to, next) => {
    if (store.getters.isLogined) return next(); // isAuth === true면 페이지 이동
    next('auth'); // isAuth === false면 다시 로그인 화면으로 이동
};

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'CAPS_OJ',
            component: Home,
            beforeEnter: requireAuth(),
        },
        // Auth
        {
            path: '/auth',
            name: 'Auth',
            component: Auth,
        },
        // Problem
        {
            path: '/problem',
            name: 'ProblemList',
            component: ProblemList,
            beforeEnter: requireAuth(),
        },
        {
            path: '/problem/create',
            name: 'CreateProblem',
            component: ProblemForm,
            beforeEnter: requireAuth(),
        },
        {
            path: '/problem/view/:problemNumber',
            name: 'ProblemView',
            component: ProblemView,
            props: true,
            beforeEnter: requireAuth(),
        },
        {
            path: '/problem/modify/:problemNumber',
            name: 'ProblemModify',
            component: ProblemForm,
            props: true,
            beforeEnter: requireAuth(),
        },
        // Status
        {
            path: '/status',
            name: 'Status',
            component: Status,
            beforeEnter: requireAuth(),
        },
        // Rank
        {
            path: '/rank',
            name: 'Rank',
            component: Ranking,
            beforeEnter: requireAuth(),
        },
    ]
});

export default router;