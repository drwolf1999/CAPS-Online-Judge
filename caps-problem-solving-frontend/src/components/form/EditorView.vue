<template>
    <quill v-model="Content" :config="config"></quill>
</template>
<script>
    import "katex/dist/katex.js";
    import 'katex/dist/katex.min.css';
    import 'quill/dist/quill.bubble.css';

    export default {
        name: 'EditorView',
        data() {
            return {
                Content: this.content === null || this.content === undefined ? {opt: {}} : this.content,
                Label: this.label,
                config: {
                    readOnly: true,
                    theme: 'bubble',
                },
            }
        },
        props: {
            content: {type: Object, default: null,},
            label: {type: String, default: '',},
        },
    }
</script>