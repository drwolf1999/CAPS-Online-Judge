<template>
    <v-btn :text="TextBtn" :color="color" :block="block" :to="to">{{ content }}
    <v-icon v-if="icon">{{ icon }}</v-icon>
    </v-btn>
</template>

<script>
    export default {
        name: 'Button',
        data() {
            return {
                TextBtn: this.textBtn === undefined ? false : this.textBtn,
                color: this.Color === undefined ? 'normal' : this.Color,
            };
        },
        props: {
            content: {type: String, default: 'Button',},
            objContent: {type: Object, default: null,},
            Color: {type: String, default: 'normal',},
            textBtn: {type: Boolean, default: false,},
            block: {type: Boolean, default: false,},
            icon: {type: String, default: '',},
            to: {type: [String, Object], default: null,},
        },
        methods: {}
    };
</script>