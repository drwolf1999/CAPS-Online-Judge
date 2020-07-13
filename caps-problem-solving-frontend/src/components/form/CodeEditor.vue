<template>
    <MonacoEditor
            class="text-left"
            height="500"
            theme="vs-dark"
            language="cpp"
            :options="options"
            @change="onCodeChange"
    ></MonacoEditor>
</template>

<script>
    import MonacoEditor from 'monaco-editor-vue';

    // use in component
    export default {
        components: {
            MonacoEditor,
        },
        data() {
            return {
                code: this.initialCode,
                options: {
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                },
            }
        },
        props: {
            initialCode: {
                type: String,
                default: '123123123',
            },
        },
        methods: {
            onCodeChange(value) {
                this.$emit('input', value);
            },
        },
    }
</script>