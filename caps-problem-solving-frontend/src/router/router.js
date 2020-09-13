import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import ProblemList from '@/components/problems/ProblemList.vue';
import ProblemForm from '@/components/problems/ProblemForm.vue';
import ProblemView from '@/components/problems/ProblemView.vue';
import Status from '@/components/status/Status.vue';
import SubmitCode from '@/components/status/SubmissionCode.vue';
import Auth from '@/components/auth/Auth.vue';
import store from '@/store/store.js';
import Ranking from "@/components/ranking/Ranking.vue";
import Testcase from "@/components/testcase/Testcase.vue";
import Rejudge from "@/components/DangerZone/Rejudge.vue";
import Profile from "@/components/profile/Profile";

Vue.use(Router);

const requireAuth = () => (from, to, next) => {
    if (store.getters.isLogined) return next(); // isAuth === true면 페이지 이동
    next('/auth'); // isAuth === false면 다시 로그인 화면으로 이동
};

const requireAdmin = () => (from, to, next) => {
    if (!store.getters.isLogined) return next('/auth');
    if (store.getters.getUserData.permission === 0) {
        alert('비정상적인 접근입니다.');
        return next('/');
    }
    next();
}

const index = new Router({
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
        {
            path: '/profile/:username',
            name: 'Profile',
            component: Profile,
            props: true,
            beforeEnter: requireAuth(),
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
            beforeEnter: requireAdmin(),
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
            beforeEnter: requireAdmin(),
        },
        {
            path: '/problem/testcase/modify/:problemNumber',
            name: 'ProblemTestcase',
            component: Testcase,
            props: true,
            beforeEnter: requireAdmin(),
        },
        // Status
        {
            path: '/status',
            name: 'Status',
            component: Status,
            beforeEnter: requireAuth(),
        },
        {
            path: '/status/submission/:submitNumber',
            name: 'SubmitCodeView',
            component: SubmitCode,
            props: true,
            beforeEnter: requireAuth(),
        },
        // Rank
        {
            path: '/rank',
            name: 'Rank',
            component: Ranking,
            beforeEnter: requireAuth(),
        },
        // Admin
        {
            path: '/admin/rejudge',
            name: 'Rejudge',
            component: Rejudge,
            beforeEnter: requireAdmin(),
        },
    ]
});

export default index;