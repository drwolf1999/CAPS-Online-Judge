<template>
    <div :class="Class + ' username'">{{ username }}</div>
</template>

<script>
import StandingService from "@/service/standing";

export default {
    props: {
        username: String,
        rank: Number,
    },
    mounted() {
        this.FetchRank();
        this.SetClass();
    },
    data() {
        return {
            fetchingRank: false,
            Rank: null,
            Class: '',
        };
    },
    computed: {
    },
    methods: {
        async FetchRank() {
            this.fetchingRank = true;
            if (this.rank !== undefined && this.rank !== null) {
                this.fetchingRank = false;
                this.Rank = this.rank;
                this.SetClass();
                return;
            }
            const response = await StandingService.GetUser(this.username);
            this.Rank = response.data.Standing.rank;
            this.fetchingRank = false;
            this.SetClass();
        },
        SetClass() {
            this.Class = '';
            switch (this.Rank) {
                case 0:
                    this.Class = 'rainbow';
                    break;
                case 1:
                    this.Class = 'black-red';
                    break;
                case 2:
                    this.Class = 'gold';
                    break;
                case 3:
                    this.Class = 'silver';
                    break;
                case 4:
                    this.Class = 'bronze';
                    break;
            }
        }
    },
    watch: {
        username() {
            this.FetchRank();
        },
        rank() {
            this.FetchRank();
        },
    }
};
</script>

<style>
.username {
    font-weight: bold;
    display: inline-block;
}

.rainbow {
    background-image: linear-gradient(to right, red, orange, #FFA000, green, blue, navy, purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.black-red {
    display: inline-block;
    color: red;
}

.black-red::first-letter {
    color: black;
}

.gold {
    background: -webkit-linear-gradient(#FFEA00, #FFD600, #FF9100);
    /*background: linear-gradient(-72deg, #ffde45, #ffffff 16%, #ffde45 21%, #ffffff 24%, #452100 27%, #ffde45 36%, #ffffff 45%, #ffffff 60%, #ffde45 72%, #ffffff 80%, #ffde45 84%, #452100);*/
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.silver {
    background: -webkit-linear-gradient(#eee, #333);
    /*background: linear-gradient(-72deg, #dedede, #ffffff 16%, #dedede 21%, #ffffff 24%, #454545 27%, #dedede 36%, #ffffff 45%, #ffffff 60%, #dedede 72%, #ffffff 80%, #dedede 84%, #a1a1a1);*/
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.bronze {
    background: -webkit-linear-gradient(#B08D57, #9C7A3C, #895E1A, #804A00);
    /*background: linear-gradient(-72deg, #ca7345, #ffdeca 16%, #ca7345 21%, #ffdeca 24%, #a14521 27%, #ca7345 36%, #ffdeca 45%, #ffdeca 60%, #ca7345 72%, #ffdeca 80%, #ca7345 84%, #732100);*/
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
