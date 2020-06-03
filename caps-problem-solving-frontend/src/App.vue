<template>
  <v-app>
    <v-content>
      <Header v-if="this.$store.getters.isLogined"/>
      <AlertMessage/>
      <router-view/>
      <Footer v-if="this.$store.getters.isLogined"/>
    </v-content>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
  import Header from './components/Header.vue';
  import AlertMessage from './components/common/AlertMessage.vue';
  export default {
    name: 'App',
    data() {
      return {
        isLogined: this.$store.getters.isLogined,
      };
    },
    components: {
      Header,
      AlertMessage,
    }
  };
</script>