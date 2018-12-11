<template lang="pug">
    div#app
        router-view
</template>

<style lang="stylus">
    /* stylus */
</style>


<script>
    export default {
        name: 'help-teacher',
        provide(){
            return {
                reload: this.reload
            }
        },
        data(){
            return {
                isRouterAlive: true
            }
        },
        methods:{
            reload(){
                this.isRouterAlive = false;
                this.$nextTick(function(){
                    this.isRouterAlive = true
                })
            }
        }
    }
</script>