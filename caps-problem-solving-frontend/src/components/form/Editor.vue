<template>
    <div>
        <v-subheader>{{ Label }}</v-subheader>
        <quill v-model="Content" :config="config" v-on:input="onInput()"></quill>
    </div>
</template>
<script>
    import "katex/dist/katex.js";
    import 'katex/dist/katex.min.css';

    export default {
        name: 'Editor',
        data() {
            return {
                Content: this.content === undefined || this.content === null || this.content === '' ? {opt: {}} : this.content,
                Label: this.label,
                config: {
                    modules: {
                        formula: true,
                        toolbar: [
                            ["bold", "italic", "underline", "strike"],
                            [{list: "ordered"}, {list: "bullet"}],
                            [{color: []}, {background: []}],
                            [{align: []}],
                            ["image"],
                            ["formula"]
                        ]
                    },
                },
            }
        },
        props: {
            content: {type: [Object, String], default: null,},
            label: {type: String, default: 'label',},
        },
        methods: {
            onInput() {
                this.$emit('input', this.Content);
            }
        },
    }
</script>