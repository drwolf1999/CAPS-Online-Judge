<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>
                    랭킹
                    <v-spacer></v-spacer>
                    <Input v-bind:data="Query" v-on:input="onChangeQuery"/>
                </v-card-title>
                <v-data-table :loading="fetchingRanking">
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-center">등수</th>
                            <th class="text-center">아이디</th>
                            <th class="text-center" v-for="(problem, index) in Problems" v-bind:key="problem.number">
                                <a style="text-decoration:none;" href="javascript:void(0);" @click="goProblem(problem)">{{ index }}</a>
                            </th>
                            <th class="text-center">페널티</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(user, index) in Users" v-bind:key="user.number">
                            <td>{{ index + 1 }}</td>
                            <td>{{ user.name }}</td>
                            <td v-for="problem in GetAcceptProblem(user.problem)" v-bind:key="problem"></td>
                        </tr>
                        </tbody>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'Ranking',
        data: () => {
            return {
                Problems: [1, 2, 3, 4, 5, 6, 7],
                fetchingRanking: false,
            };
        },
        methods: {
            //
        }
    }
</script>