<template>
  <button class="button" @click.prevent="onClick">{{ text }}</button>
</template>

<script>
export default {
  name: 'appButton',
  props: {
    onClick: {
      type: Function,
    },
    text: {
      type: String,
      required: true,
    },
  },
}
</script>
