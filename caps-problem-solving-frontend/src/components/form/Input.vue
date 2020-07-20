<template>
    <v-text-field :label="Label" v-model="InputData" v-on:input="onInput()"></v-text-field>
</template>

<script>
    export default {
        name: 'Input',
        data() {
            return {
                InputData: this.model,
                Label: this.label === undefined ? '' : this.label,
                Readonly: !(this.readonly === undefined || this.readonly === false),
            };
        },
        props: {
            label: String,
            model: String,
            readonly: {type: Boolean, default: false},
        },
        methods: {
            onInput() {
                this.$emit('input', this.InputData);
            }
        },
    };
</script>