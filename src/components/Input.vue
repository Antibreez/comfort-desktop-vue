<template>
  <div class="input" :class="{invalid: isInvalid}">
    <label :class="{isEmpty: isEmpty}">{{ label }}</label>
    <input
      :type="inputType ? inputType : 'text'"
      v-model="value"
      @focus="isEmpty = false"
      @blur="onBlur"
      @input="onInput"
    />
    <p class="input__message" v-if="hasErrorMessage && isInvalid">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'appInput',
  props: {
    label: {
      type: String,
    },
    inputType: {
      type: String,
    },
    onInput: {
      type: Function,
    },
    hasErrorMessage: {
      type: Boolean,
    },
  },
  data() {
    return {
      isEmpty: true,
      value: '',
    }
  },
  computed: {
    ...mapState({
      errorMessage: state => state.auth.errorMessage,
      isInvalid: state => !!state.auth.errorMessage,
    }),
  },
  methods: {
    onBlur() {
      if (this.value.trim() === '') {
        this.isEmpty = true
      }
    },
  },
}
</script>
