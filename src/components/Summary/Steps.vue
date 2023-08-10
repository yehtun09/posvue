<template>
  <div class="card vh-90">
    <div class="card-header p-1 w-100">
      <button type="button" class="btn btn-label-primary w-100">
        Hold Orders
        <span class="badge bg-white text-primary ms-3 fw-bold">{{
          holdOrders.length
        }}</span>
      </button>
    </div>
    <div class="vh-40 overflow-y-scroll">
      <div class="p-2" v-for="(order, ind) in holdOrders" :key="order">
        <div class="d-flex justify-content-around align-items-center">
          <p class="mb-0">{{ holdOrders.length - ind }}</p>
          <button class="btn btn-sm btn-label-primary">
            {{ order.total }} MMK
          </button>
          <p class="mb-0">{{ order.date }}</p>
          <!-- <span class="badge bg-label-danger">HOLD</span> -->
          <button
            type="button"
            @click="handleDelete(ind)"
            class="btn rounded-pill btn-icon btn-label-danger"
          >
            <i class="bi bi-trash"></i>
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="
              $emit('holdOrderId', {
                ind,
                noOrder: false,
              })
            "
          >
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
        <hr class="m-0 mt-2" />
      </div>
    </div>
    <div>
      <div class="mt-5">
        <p class="h3 text-center text-black-50">Total Sales</p>
        <h3 class="fw-bold text-center text-black-50">
          {{ today_order.length }} Times
        </h3>
      </div>

      <div class="mt-5">
        <p class="h3 text-center text-black-50">Total</p>
        <h3 class="fw-bold text-center text-black-50">{{ today_total }} MMK</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { confirm } from "@/composables/useConfirm";
export default {
  setup() {
    let store = useStore();
    let today_order = ref("");
    let today_total = ref("...");
    let holdOrders = computed((_) => store.state.order.holdOrders);
    let token = useStore().state.auth.token;
    //delete hold each Order Item
    function handleDelete(id) {
      confirm(
        "Are you sure to delete order ?",
        "You won't be able to revert this!",
        () => {
          store.dispatch("removeHoldOrdersByInd", id);
        }
      );
    }
    onMounted(async () => {
      let today_orders_response = await axios.get(
        store.getters.getCustomerApi.todayOrderApi,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let today_total_response = await axios.get(
        store.getters.getCustomerApi.todayTotalApi,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      today_order.value = today_orders_response.data.data;
      today_total.value = today_total_response.data.data;
      // console.log(today_total.value);
    });
    return { today_order, today_total, holdOrders, handleDelete };
  },
};
</script>

<style lang="scss" scoped></style>
