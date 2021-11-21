<template>
  <router-view />
</template>

<style lang="scss">
@import '@/styles/style';
</style>

<script>
import {mapActions, mapState} from 'vuex'
import {actionTypes} from '@/store/modules/auth'
import codeCounter from '@/helpers/codeCounter'

export default {
  computed: {
    ...mapState({
      condeTimer: state => state.auth.codeTimer,
    }),
  },
  methods: {
    ...mapActions({
      codeTimerInit: actionTypes.codeTimerInit,
    }),
  },
  beforeMount() {
    if (codeCounter.get()) {
      this.codeTimerInit()
    }
  },
}
</script>
