<template>
  <div class="print-hide p-3 pb-0">
    <div class="d-flex align-items-center">
      <div class="">
        <img :src="shop_info.shop_photo" alt="" width="80" />
      </div>
      <div class="ms-3">
        <h5 class="fw-bold mb-1">{{ shop_info.shop_name }}</h5>
        <p class="mb-1">{{ shop_info.shop_phone }}</p>
        <address>{{ shop_info.shop_address }}</address>
      </div>
    </div>
    <p class="fw-bold text-end">{{ orderCode }}</p>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  setup() {
    let store = useStore();
    let orderCode = computed(() => store.state.order.orderNumber);
    let shop_info = computed((_) => store.getters.getShopInfo);
    // console.log(shop_info.value);
    return { orderCode, shop_info };
  },
};
</script>

<style lang="scss" scoped></style>
