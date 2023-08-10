<template>
  <div class="card card-action vh-58">
    <div class="card-header w-100 py-1 fw-bold">
      <div class="row w-100 align-items-center">
        <div class="p-2 col-7">
          <button
            type="button"
            class="btn btn-primary w-100 d-flex justify-content-between"
          >
            <p class="fw-bold d-inline-block mb-0 me-1 text-white">Order Qty</p>
            <span class="text-white fw-bold">{{ orderCount }}</span>
          </button>
        </div>
        <div class="p-1 col-5">
          <button
            id="clear_order"
            type="button"
            :class="[
              'btn btn-label-danger w-100 text-nowrap',
              { disabled: orderCount < 1 },
            ]"
            @click="clearOrder"
          >
            <p class="fw-bold d-inline">Clear Order</p>
          </button>
        </div>
      </div>
    </div>
    <div
      class="collapse show p-3 py-1 customScrollBar"
      style="overflow-x: hidden"
    >
      <NoOrder v-if="orders.length < 1" />
      <div class="row" v-else>
        <div class="col-3">
          <p class="mb-0 fw-bold text-start">Name</p>
        </div>
        <div class="col-6">
          <p class="mb-0 fw-bold text-center">Qty</p>
        </div>
        <div class="col-3">
          <p class="mb-0 fw-bold text-end">Line Total</p>
        </div>
      </div>
      <div v-auto-animate>
        <Order v-for="(order, ind) in orders" :key="order.id" :order="order" />
      </div>
    </div>
  </div>

  <div class="card shadow rounded mt-3 pay-card">
    <div class="card-body py-2">
      <div class="d-flex justify-content-between align-items-center">
        <p class="fw-bold mb-1">Sub Total</p>
        <p class="fw-bold mb-1">{{ removeDecimal(subtotal) }}</p>
      </div>
      <div class="row mb-2 align-items-center justify-content-between">
        <div class="col-5 d-flex align-items-center">
          <div class="d-flex align-items-center">
            <span id="basic-addon1">Tax</span>
            <input
              min="0"
              placeholder="0"
              class="form-control form-control-sm p-1 fw-bold mb-0 pe-1 h5 text-end mx-2 w-25"
              type="number"
              v-model="tax_percent"
              :disabled="orders.length < 1"
            />
            <span id="basic-addon1">%</span>
          </div>
          <!-- <input
            min="0"
            placeholder="0"
            class="form-control text-end fw-bold w-25"
            style="height: 30px !important"
            type="number"
            v-model="tax_percent"
            :disabled="orders.length < 1"
          />
          <label for="tax" class="fw-bold" style="margin-left: 5px">
            Tax (%)
          </label> -->
        </div>
        <div class="col-5 d-flex justify-content-end">
          <p class="fw-bold mb-1">
            {{ tax_price ? removeDecimal(tax_price) : "0" }}
          </p>
        </div>
      </div>
      <div class="row mb-3 align-items-center justify-content-between">
        <div class="col-6">
          <label for="tax" class="fw-bold"> Discount (Ks) </label>
        </div>
        <div class="col-3" style="margin-right: -40px">
          <div class="input-group input-group-sm">
            <input
              @keyup="changeDiscount"
              @keypress="changeDiscountPrice"
              min="0"
              placeholder="0"
              type="number"
              class="form-control p-1 fw-bold mb-0 pe-1 h5 text-end"
              v-model="discount_percent"
              :disabled="orders.length < 1"
            />
            <span class="input-group-text" id="basic-addon1">%</span>
          </div>
        </div>
        <div class="col-3">
          <input
            min="0"
            @keyup="changeDiscountPercent"
            placeholder="0"
            class="form-control p-1 fw-bold mb-0 pe-1 h5 text-end"
            type="number"
            v-model="discount"
            :disabled="orders.length < 1"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-2">Total</h5>
        <h5 class="fw-bold mb-2">{{ removeDecimal(total) }}</h5>
      </div>

      <button @click="saleNow" class="btn btn-primary w-100 glow">
        Sale Now
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Order from "./Order";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import { confirm } from "@/composables/useConfirm";
import NoOrder from "../Home/NoOrder.vue";
import { useRouter } from "vue-router";
import MaxlengthCheck from "@/composables/useMaxLengthCheck";
import removeDecimal from "@/composables/useRemoveDecimal";
export default {
  components: { Order, NoOrder },
  setup() {
    let store = useStore();
    let router = useRouter();
    let tax_percent = ref("");
    let discount_percent = ref("");
    let discount = ref("");
    let tax_price = ref("");

    let orders = computed(() => store.state.order.orders);
    let subtotal = computed(() =>
      store.state.order.orders.reduce((pv, cv) => pv + cv.total, 0)
    );
    let purchaseTotal = computed(() =>
      store.state.order.orders.reduce(
        (pv, cv) => Number(pv) + Number(cv.purchase_total),
        0
      )
    );
    //total
    let total = computed(() => {
      let total = subtotal.value + (subtotal.value * tax_percent.value) / 100;
      return total - discount.value;
    });

    //maxlength percentage limit
    watch(tax_percent, (newDP) => {
      tax_percent.value = MaxlengthCheck(newDP);
      tax_price.value = subtotal.value * (tax_percent.value / 100);
    });
    watch(subtotal, (newPrice) => {
      tax_price.value = newPrice * (tax_percent.value / 100);
      if (subtotal.value == 0) {
        discount.value = "";
        discount_percent.value = "";
        total.value = 0;
      }
    });

    let changeDiscount = () => {
      return (discount.value = subtotal.value * (discount_percent.value / 100));
    };
    // fix decimal 2
    // watch(discount, (newData) => {
    //   discount.value = removeDecimal(newData);
    // });

    let changeDiscountPercent = () =>
      (discount_percent.value = (
        (discount.value * 100) /
        subtotal.value
      ).toFixed(3));

    let orderCount = computed(() =>
      store.state.order.orders.reduce((pv, cv) => pv + cv.qty, 0)
    );

    let clearOrder = () =>
      confirm(
        "Sure to remove all orders?",
        "You won't be able to revert this!",
        () => {
          tax_percent.value = "";
          store.dispatch("clearOrder");
        }
      );

    let saleNow = () => {
      // useRouter.push({ name: 'summary' });
      let payload = {
        tax: tax_percent.value == "" ? 0 : tax_percent.value,
        discount_percent:
          discount_percent.value == "" ? 0 : discount_percent.value,
        discount: discount.value == "" ? 0 : discount.value,
      };
      store.dispatch("setTax_Discount", payload);
      router.push({ name: "summary" });
    };

    watch([subtotal, total, purchaseTotal], () => {
      store.dispatch("setSubTotal", subtotal.value);
      store.dispatch("setTotal", total.value);
      store.dispatch("setPurchaseTotal", purchaseTotal.value);
    });

    let changeDiscountPrice = () => {
      discount.value = subtotal.value * (discount_percent.value / 100);
    };
    return {
      orders,
      total,
      subtotal,
      orderCount,
      clearOrder,
      tax_percent,
      discount_percent,
      discount,
      saleNow,
      changeDiscount,
      changeDiscountPercent,
      tax_price,
      removeDecimal,
      changeDiscountPrice,
    };
  },
};
</script>

<style lang="scss" scoped></style>
