<template>
    <v-card flat tile min-height="380" class="d-flex flex-column">
        <confirm ref="confirm"></confirm>
        <v-card-text
            v-if="!path"
            class="grow d-flex justify-center align-center grey--text"
        >Select a folder or a file
        </v-card-text>
        <v-card-text
            v-else-if="isFile"
            class="grow d-flex justify-center align-center"
        >
            <v-row v-if="pathFile" justify="center">
                <v-col class="grey lighten-3" cols="12">
                    <Button v-if="partialNum && partialNum > 0" v-bind:text-btn="true" v-bind:content="`... 이전 더 보기 (Not yet supported)`" v-bind:color="`primary`" v-on:click.native="ViewPrev"></Button>
                    <div class="text-left" style="min-height: 350px;" :inner-html.prop="pathFile | newline"></div>
                    <Button v-if="readMore" v-bind:text-btn="true" v-bind:content="`... 다음 더 보기 (Not yet supported)`" v-bind:color="`primary`" v-on:click.native="ViewNext"></Button>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else-if="dirs.length || files.length" class="grow">
            <v-list subheader v-if="dirs.length">
                <v-subheader>Folders</v-subheader>
                <v-list-item
                    v-for="item in dirs"
                    :key="item.basename"
                    @click="changePath(item.path)"
                    class="pl-0"
                >
                    <v-list-item-avatar class="ma-0">
                        <v-icon>mdi-folder-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="py-2">
                        <v-list-item-title v-text="item.basename"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click.stop="deleteItem(item)">
                            <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
                        </v-btn>
                        <v-btn icon v-if="false">
                            <v-icon color="grey lighten-1">mdi-information</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <v-divider v-if="dirs.length && files.length"></v-divider>
            <v-list subheader v-if="files.length">
                <v-subheader>Files</v-subheader>
                <v-list-item
                    v-for="item in files"
                    :key="item.basename"
                    @click="changePath(item.path)"
                    class="pl-0"
                >
                    <v-list-item-avatar class="ma-0">
                        <v-icon>{{ icons[item.extension.toLowerCase()] || icons['other'] }}</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content class="py-2">
                        <v-list-item-title v-text="item.basename"></v-list-item-title>
                        <v-list-item-subtitle>{{ formatBytes(item.size) }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-btn icon @click.stop="deleteItem(item)">
                            <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
                        </v-btn>
                        <v-btn icon v-if="false">
                            <v-icon color="grey lighten-1">mdi-information</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-text
            v-else-if="filter"
            class="grow d-flex justify-center align-center grey--text py-5"
        >No files or folders found
        </v-card-text>
        <v-card-text
            v-else
            class="grow d-flex justify-center align-center grey--text py-5"
        >The folder is empty
        </v-card-text>
        <v-divider v-if="path"></v-divider>
        <v-toolbar v-if="false && path && isFile" dense flat class="shrink">
            <v-btn icon>
                <v-icon>mdi-download</v-icon>
            </v-btn>
        </v-toolbar>
        <v-toolbar v-if="path && isDir" dense flat class="shrink">
            <v-text-field
                solo
                flat
                hide-details
                label="Filter"
                v-model="filter"
                prepend-inner-icon="mdi-filter-outline"
                class="ml-n3"
            ></v-text-field>
            <v-btn icon v-if="false">
                <v-icon>mdi-eye-settings-outline</v-icon>
            </v-btn>
            <v-btn icon @click="load">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </v-toolbar>
    </v-card>
</template>

<script>
import Utility from "@/helper/Utility";
import Confirm from "@/components/testcase/TConfirm.vue";
import Button from "@/components/form/Button";

export default {
    props: {
        icons: Object,
        storage: String,
        path: String,
        endpoints: Object,
        axios: Function,
        refreshPending: Boolean,
        defaultPath: String,
    },
    components: {
        Button,
        Confirm
    },
    data() {
        return {
            items: [],
            filter: "",
            pathFile: null,
            partialNum: 0,
            readMore: false,
        };
    },
    computed: {
        dirs() {
            return this.items.filter(
                item =>
                    item.type === "dir" && item.basename.includes(this.filter)
            );
        },
        files() {
            return this.items.filter(
                item =>
                    item.type === "file" && item.basename.includes(this.filter)
            );
        },
        isDir() {
            return this.path[this.path.length - 1] === "/";
        },
        isFile() {
            return !this.isDir;
        }
    },
    methods: {
        formatBytes(S, D = 2) {
            return Utility.formatBytes(S, D);
        },
        changePath(path) {
            this.$emit("path-changed", path);
        },
        async ViewPrev() {
            this.partialNum--;
            await this.load();
        },
        async ViewNext() {
            this.partialNum++;
            await this.load();
        },
        async load() {
            this.$emit("loading", true);
            if (this.isDir) {
                let url = this.endpoints.list.url
                    .replace(new RegExp('{problemNumber}', 'g'), this.defaultPath)
                    .replace(new RegExp("{storage}", "g"), this.storage)
                    .replace(new RegExp("{path}", "g"), this.path);
                let config = {
                    url,
                    method: this.endpoints.list.method || "get"
                };
                let response = await this.axios.request(config);
                this.items = response.data;
            } else {
                // TODO: load file
                this.pathFile = null;
                this.readMore = false;
                let url = this.endpoints.get.url
                    .replace(new RegExp('{problemNumber}', 'g'), this.defaultPath)
                    .replace(new RegExp("{storage}", "g"), this.storage)
                    .replace(new RegExp("{path}", "g"), this.path)
                    .replace(new RegExp('{part}', 'g'), this.partialNum);
                let config = {
                    url,
                    method: this.endpoints.get.method || "get"
                };
                let response = await this.axios.request(config);
                this.pathFile = response.data.content;
                this.readMore = response.data.canReadMore;
            }
            this.$emit("loading", false);
        },
        async deleteItem(item) {
            let confirmed = await this.$refs.confirm.open(
                "Delete",
                `Are you sure<br>you want to delete this ${
                    item.type === "dir" ? "folder" : "file"
                }?<br><em>${item.basename}</em>`
            );
            if (confirmed) {
                this.$emit("loading", true);
                let url = this.endpoints.delete.url
                    .replace(new RegExp("{problemNumber}", "g"), this.defaultPath)
                    .replace(new RegExp("{storage}", "g"), this.storage)
                    .replace(new RegExp("{path}", "g"), item.path);
                let config = {
                    url,
                    method: this.endpoints.delete.method || "post"
                };
                await this.axios.request(config);
                this.$emit("file-deleted");
                this.$emit("loading", false);
            }
        }
    },
    watch: {
        async path() {
            this.items = [];
            this.partialNum = 0;
            await this.load();
        },
        async refreshPending() {
            if (this.refreshPending) {
                await this.load();
                this.$emit("refreshed");
            }
        },
    },
    filters: {
        newline(text) {
            if (text === undefined || text === null) return text;
            return text.replace(/\n/g, '<br>');
        }
    },
};
</script>

<style lang="scss" scoped>
.v-card {
    height: 100%;
}
</style>