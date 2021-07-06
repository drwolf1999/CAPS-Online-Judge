<template>
    <v-card>
        <v-toolbar color="primary" dark class="indigo">
            <v-app-bar-nav-icon v-if="isAdmin" @click="flipNav"></v-app-bar-nav-icon>
            <v-toolbar-title @click="GoHome">CAPS OJ</v-toolbar-title>
            <v-spacer></v-spacer>
            <Button
                v-bind:to="{name: 'ProblemList'}"
                v-bind:content="`문제`"
                v-bind:text-btn="true"></Button>
            <Button
                v-bind:to="{name: 'Status'}"
                v-bind:content="`채점 현황`"
                v-bind:text-btn="true"></Button>
            <Button
                v-bind:to="{name: 'Rank'}"
                v-bind:content="`순위`"
                v-bind:text-btn="true"></Button>
            <Button
                v-bind:to="{name: 'Profile', params: {username: this.$store.getters.getUserData.username}}"
                v-bind:content="this.$store.getters.getUserData.username"
                v-bind:text-btn="true"></Button>
            <Button v-bind:content="`로그아웃`" v-bind:text-btn="true" v-on:click.native="LOGOUT"></Button>
        </v-toolbar>
    </v-card>
</template>

<script>
import Button from '@/components/form/Button';

export default {
    name: 'Header',
    data() {
        return {
            items: [
                {title: 'Home', icon: 'dashboard'},
                {title: 'About', icon: 'question_answer'},
            ],
        }
    },
    computed: {
        isLogined() {
            return this.$store.getters.isLogined;
        },
        isAdmin() {
            return this.$store.getters.getUserData.permission >= 1;
        }
    },
    props: {
        sideNav: [Object, Boolean],
    },
    methods: {
        flipNav() {
            this.$emit('change-nav', !this.sideNav);
        },
        GoHome() {
            if (this.$route.path !== '/') this.$router.push('/').catch(() => {
            });
        },
        LOGOUT() {
            this.$store.dispatch('LOGOUT').then(() => this.$router.push('/auth').catch(() => {
            }));
        },
    },
    components: {
        Button,
    },
};
</script>