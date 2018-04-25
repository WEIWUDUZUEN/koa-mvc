<template>
    <div>
        index.html
    </div>
</template>
<script>
export default {
    components: {
    },
    data () {
        return {}
    },
    computed: {
    },
    async mounted() {
        console.log('_____axios-get', await this.$axios.get('/api/home/category'))
        console.log('_____axios-post', await this.$axios.post('/api/home/category'))
    },
    methods: {
    }
}
</script>
<style>

</style>