<template>
  <div class="banner">
    Телефон для теста: +7 777 777 77 77<br />
    Код проверки: 123456
  </div>
</template>

<script>
export default {
  name: 'PhoneTestingBanner',
}
</script>

<style lang="scss" scoped>
.banner {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  padding: 15px;
  background-color: rgba(255, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;

  &.closed {
    width: 0;
    padding: 15px 0;
  }
}
</style>
