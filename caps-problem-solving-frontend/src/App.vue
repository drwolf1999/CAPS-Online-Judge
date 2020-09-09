<template>
    <v-app>
        <v-content>
            <Header v-if="isLogined" :side-nav="sideNav" v-on:change-nav="changeNav"/>
            <SideNav v-if="isLogined && isAdmin" v-model="sideNav"></SideNav>
            <AlertMessage/>
            <router-view/>
            <!--            <Footer v-if="this.$store.getters.isLogined"/>-->
        </v-content>
    </v-app>
</template>

<style>
a { text-decoration:none }

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>

<script>
import Header from './components/Header.vue';
import AlertMessage from './components/common/AlertMessage.vue';
import katex from 'katex';
import 'katex/dist/katex';
import SideNav from "@/components/SideNav";

export default {
    name: 'App',
    mounted() {
        window.katex = katex;
    },
    data() {
        return {
            sideNav: null,
        };
    },
    computed: {
        isLogined() {
            return this.$store.getters.isLogined
        },
        isAdmin() {
            return this.$store.getters.getUserData.permission >= 1;
        },
    },
    methods: {
        changeNav(value) {
            this.sideNav = value;
        }
    },
    components: {
        SideNav,
        Header,
        AlertMessage,
    }
};
</script>