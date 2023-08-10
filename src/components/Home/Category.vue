<template>
  <button type="button" class="btn text-white">{{ category.name }}</button>
</template>

<script>
export default {
  props: ["category"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
