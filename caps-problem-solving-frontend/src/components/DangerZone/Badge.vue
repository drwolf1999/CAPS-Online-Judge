<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>새로운 업적 추가</v-card-title>
                <v-card-text>
                    <Input v-bind:model="badgeName" v-bind:label="`업적 이름`" v-on:input="OnChangeBadgeName"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:text-btn="true" v-bind:color="`red`" v-bind:content="`추가`" v-on:click.native="AddToUser"></Button>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="11">
            <v-card>
                <v-card-title>유저에게 업적 추가</v-card-title>
                <v-card-text>
                    <v-autocomplete :items="Badge" v-model="selectedBadge" item-value="number" item-text="name"></v-autocomplete>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:text-btn="true" v-bind:color="`red`" v-bind:content="`추가`" v-on:click.native="Create"></Button>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

import Input from "@/components/form/Input";
import Button from "@/components/form/Button";
import BadgeService from '@/service/badge';

export default {
    name: 'Badge',
    components: {Button, Input},
    data() {
        return {
            selectedBadge: 1,
            selectedUser: 'drwolf1999',
            badgeName: '',
        };
    },
    mounted() {
        this.$store.dispatch('fetchBadge');
    },
    computed: {
        Badge() {
            return this.$store.getters.getBadge;
        },
    },
    methods: {
        OnChangeBadgeName(value) {
            this.badgeName = value;
        },
        Create() {
            BadgeService.Create({
                name: this.badgeName,
            })
                .then(response => {
                    this.$notify({
                        title: 'success',
                        type: 'success'
                    });
                })
                .catch(() => {
                });
        },
        AddToUser() {
            BadgeService.Add({
                username: this.selectedUser,
                badgeNumber: this.selectedBadge,
            })
                .then(response => {
                    this.$notify({
                        title: 'success',
                        type: 'success'
                    });
                })
                .catch(() => {
                });
        },
    },
};
</script>
