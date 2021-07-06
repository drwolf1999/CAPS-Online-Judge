<template>
    <v-container>
        <v-navigation-drawer v-model="sideNav" absolute temporary>
            <v-list dense>
                <v-subheader class="red--text accent-4">DANGEROUS ZONE</v-subheader>
                <v-list-item
                    v-for="item in menus"
                    :key="item.title"
                    link
                    @click="GoLink(item.name)"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-container>
</template>

<script>

export default {
    name: 'SideNav',
    data() {
        return {
            sideNav: this.value,
            menus: [
                {title: '재채점', name: 'Rejudge'},
                {title: '업적', name: 'Badge'},
            ],
        };
    },
    props: {
        value: {
            type: Boolean,
            default: null,
        },
    },
    watch: {
        value() {
            this.sideNav = this.value;
        },
        sideNav() {
            this.$emit('input', this.sideNav);
        },
    },
    methods: {
        GoLink(urlName) {
            this.$router.push({name: urlName}).catch(() => {
            });
        },
    },
};
</script>