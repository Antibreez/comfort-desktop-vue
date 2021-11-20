<template>
  <div class="auth">
    <div class="auth__wrapper wrapper">
      <header class="auth__header">
        <img src="@/assets/images/logo-white.svg" alt="Daichi" />
      </header>
      <main class="auth__main">
        <div class="auth__formBlockOuter">
          <div class="auth__formBlockInner">
            <button
              v-if="stage === 'RegistrationForm' || stage === 'LoginForm'"
              class="auth__goBack"
              aria-label="Перейти назад"
              @click.prevent="goToStart"
            ></button>

            <form-loader v-if="isLoading" />

            <entrance-form v-if="stage === 'EntranceForm'" />
            <registration-form v-if="stage === 'RegistrationForm'" />
            <login-form v-if="stage === 'LoginForm'" />
            <phone-code-form v-if="stage === 'PhoneCodeForm'" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import FormLoader from '@/components/FormLoader'
import EntranceForm from '@/components/EntranceForm'
import RegistrationForm from '@/components/RegistrationForm'
import LoginForm from '@/components/LoginForm'
import PhoneCodeForm from '@/components/PhoneCodeForm'
import {mutationTypes} from '@/store/modules/auth'

export default {
  name: 'Auth',
  components: {
    EntranceForm,
    FormLoader,
    RegistrationForm,
    LoginForm,
    PhoneCodeForm,
  },
  computed: {
    ...mapState({
      stage: state => state.auth.stage,
      isLoading: state => state.auth.isLoading,
    }),
  },
  methods: {
    ...mapMutations({
      changeStage: mutationTypes.changeStage,
    }),
    goToStart() {
      this.changeStage('EntranceForm')
    },
  },
}
</script>
