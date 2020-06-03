<template>
    <v-card color="grey lighten-4" flat>
        <v-toolbar color="primary" dark>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title @click="goHome">CAPS OJ</v-toolbar-title>
            <v-spacer></v-spacer>
            <Button v-bind:content="`문제`" v-bind:textBtn="true" v-on:click.native="goProblem"></Button>
        </v-toolbar>
    </v-card>
</template>

<script>
    import Button from '@/components/form/Button';

    export default {
        name: 'Header',
        methods: {
            goHome() {
                this.$router.push('/');
            },
            goProblem() {
                this.$router.push('/problem');
            }
        },
        components: {
            Button,
        }
    }
</script>