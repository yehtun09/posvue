<template>
  <div class="container-fluid p-0 overflow-hidden">
    <Navbar />
  </div>
  <div class="container-fluid px-2 overflow-hidden">
    <div class="row animate__animated animate__fadeIn ms-1 pb-1" style="padding-top: 1vh">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../Misc/Navbar.vue";
</script>
<style lang="scss" scoped></style>
