<template>
    <v-card color="grey lighten-4" flat>
        <v-toolbar color="primary" dark>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title @click="GoHome">CAPS OJ</v-toolbar-title>
            <v-spacer></v-spacer>
            <Button v-bind:content="`문제`" v-bind:text-btn="true" v-on:click.native="GoProblem"></Button>
            <Button v-bind:content="`채점 현황`" v-bind:text-btn="true" v-on:click.native="GoStatus"></Button>
            <Button v-bind:content="`순위`" v-bind:text-btn="true" v-on:click.native="GoRank"></Button>
            <Button v-bind:content="`로그아웃`" v-bind:text-btn="true" v-on:click.native="LOGOUT"></Button>
        </v-toolbar>
    </v-card>
</template>

<script>
import Button from '@/components/form/Button';

export default {
    name: 'Header',
    computed: {
        isLogined() {
            return this.$store.getters.isLogined;
        }
    },
    methods: {
        GoHome() {
            if (this.$route.path !== '/') this.$router.push('/').catch(() => {
            });
        },
        GoProblem() {
            if (this.$route.path !== '/problem') this.$router.push('/problem').catch(() => {
            });
        },
        GoStatus() {
            if (this.$route.path !== '/status') this.$router.push('/status').catch(() => {
            });
        },
        GoRank() {
            if (this.$route.path !== '/rank') this.$router.push('/rank').catch(() => {
            });
        },
        LOGOUT() {
            this.$store.dispatch('LOGOUT').then(() => this.$router.push('/auth').catch(() => {}));
        },
    },
    components: {
        Button,
    }
}
</script>