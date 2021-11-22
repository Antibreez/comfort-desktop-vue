<template>
  <div class="formBlock">
    <form>
      <h2 class="formBlock__title">
        На ваш Email отправлено письмо с инструкциями
      </h2>
      <p class="formBlock__desc">
        Следуйте инструкциям из письма, чтобы восстановить пароль, затем
        авторизуйтесь снова
      </p>
      <div>
        <app-button text="Вернуться к авторизации" @click.prevent="onClick" />
      </div>
    </form>
  </div>
</template>

<script>
import appButton from '@/components/Button'
import {mapMutations} from 'vuex'
import {mutationTypes} from '@/store/modules/auth'

export default {
  name: 'PasswordResetForm',
  components: {
    appButton,
  },
  methods: {
    ...mapMutations({
      changeStage: mutationTypes.changeStage,
    }),
    onClick() {
      this.changeStage('EntranceForm')
    },
  },
}
</script>
