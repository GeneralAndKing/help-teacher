<template lang="pug">
  #gak-main
    #gak-main-head
      i.el-icon-arrow-left#gak-main-head-back(@click="$router.go(-1)")
      i.el-icon-more#gak-main-head-nav(@click="$emit('changeSide')")
      span#gak-main-head-title 实时监控
    #gak-main-monitor
      countdown(:time='1200000', :transform='transform', ref="countdown" )
        template(slot-scope='props') {{ props.minutes }}, {{ props.seconds }}.
      el-button(type="success" @click="$refs.countdown.abort()") aaaaaa
      el-button(type="success" @click="$refs.countdown.start()") bbbbbb


</template>

<script>

  export default {
    data() {
      return {
        clock: false
      }
    },
    methods:{
      transform(props) {
        Object.entries(props).forEach(([key, value]) => {
          // Adds leading zero
          const digits = value < 10 ? `0${value}` : value;

          // uses singular form when the value is less than 2
          const word = value < 2 ? key.replace(/s$/, '') : key;

          props[key] = `${digits} ${word}`;
        });

        return props;
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../styles/monitor/index.styl"
</style>