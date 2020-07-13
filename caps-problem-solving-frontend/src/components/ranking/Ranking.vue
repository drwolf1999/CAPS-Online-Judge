<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>
                    랭킹
                    <v-spacer></v-spacer>
                    <Input v-bind:data="Query" v-on:input="onChangeQuery"/>
                </v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-center">등수</th>
                            <th class="text-center">아이디</th>
                            <th class="text-center">제출 수</th>
                            <th class="text-center">맞은 문제 수</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr v-if="fetchingRanking">
                            <td colspan="4">
                                <v-progress-linear indeterminate></v-progress-linear>
                            </td>
                        </tr>
                        <tr v-else v-for="(user, index) in Users" v-bind:key="user.number">
                            <td>{{ index + 1 }}</td>
                            <td><a href="javascript:void(0)" @click="UserClick(user.number)">{{ user.name }}</a></td>
                            <td>{{ user.answers }}</td>
                            <td>{{ user.submits }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Ranking',
        data: () => {
            //
        },
        methods: {
            //
        }
    }
</script>