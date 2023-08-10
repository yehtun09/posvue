<template>
  <div class="card text-center vh-90">
    <div class="card-header border-bottom p-2">
      <div class="row g-1">
        <div class="col-4">
          <button type="button" class="btn btn-label-primary w-100 p-2" role="tab" data-bs-toggle="tab" data-bs-target="#card-pay" aria-controls="card-pay" aria-selected="true">
            Cash
            <!-- <span class="badge badge-center rounded-pill bg-label-primary ms-3"><i class="bi bi-credit-card"></i></span> -->
          </button>
        </div>
        <div class="col-4">
          <button type="button" class="btn btn-label-success w-100 p-2" role="tab" data-bs-toggle="tab" data-bs-target="#card-pay" aria-controls="card-pay" aria-selected="true">
            Bank
            <!-- <span class="badge badge-center rounded-pill bg-label-primary ms-3"><i class="bi bi-credit-card"></i></span> -->
          </button>
        </div>  
        <div class="col-4">
          <button type="button" class="btn btn-label-danger w-100 p-2" role="tab" data-bs-toggle="tab" data-bs-target="#card-pay" aria-controls="card-pay" aria-selected="true">
            Pay
            <!-- <span class="badge badge-center rounded-pill bg-label-primary ms-3"><i class="bi bi-credit-card"></i></span> -->
          </button>
        </div>
      </div>
    </div>
    <div class="tab-content p-2">
      <div class="tab-pane fade active show" id="card-pay" role="tabpanel">
        <!-- </div> -->
        <CardPay @changePay="changePay" @pressEnterFromPay="paid" :infoError="infoError" />
      </div>
      <div class="tab-pane fade" id="bank-pay" role="tabpanel"></div>
    </div>
    <div class="card-body p-2" style="position: absolute; bottom: 0; right: 0; left: 0">
      <div class="row g-1">
        <div class="col-4">
          <button type="button" :disabled="paying || orderCount < 1" class="w-100 fw-bold aspect-1-1 btn btn-label-success" @click="paid">
            Paid
            <span v-if="paying" class="spinner-border spinner-border-sm ms-3" role="status" aria-hidden="true"></span>
          </button>
        </div>
        <div class="col-4">
          <button @click="hold" :disabled="orderCount < 1" type="button" class="w-100 fw-bold aspect-1-1 btn btn-label-primary text-nowrap">
            Hold
          </button>
        </div>
        <div class="col-4">
          <router-link :to="{ name: 'home' }" class="w-100 fw-bold aspect-1-1 btn btn-label-danger d-flex align-items-center justify-content-center">
            Back
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { confirm } from "@/composables/useConfirm";
import { alert } from "@/composables/useAlert";
import { computed } from "@vue/reactivity";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import removeDecimal from "@/composables/useRemoveDecimal";
import CardPay from "../Summary/CardPay.vue";

export default {
  components: { CardPay },
  setup(props, { emit }) {
    let store = useStore();
    let router = useRouter();
    let pay = ref(0);
    let refund = ref("");
    let name = ref("");
    let phone = ref("");
    /*****
     * * Delivery Module
     * **/
    let address = ref("");
    let delivery_fee = ref(0);
    let township_id = ref("");
    let isDelivery = ref("");
    let paying = ref(false);
    let startPdf = ref(false);
    let cashOrCredit = ref(false);
    let infoError = ref(false);
    let token = useStore().state.auth.token;

    let orderCode = computed(() => store.state.order.orderNumber);
    let tax = computed(() => store.state.order.tax_discount.tax);
    // let tax_flat = computed(() => store.state.order.tax_discount.tax);
    let discount = computed(
      () => store.state.order.tax_discount.discount_percent
    );
    let discount_price = computed(
      () => store.state.order.tax_discount.discount
    );
    let total = computed(() => store.state.order.total);
    let sub_total = computed(() => store.state.order.subtotal);
    let purchasetotal = computed(() => store.state.order.purchasetotal);
    let orderCount = computed((_) => store.state.order.orders.length);
    let changePay = (payload) => {
      (pay.value = payload.pay),
        (isDelivery.value = payload.isDelivery),
        (address.value = payload.address),
        (delivery_fee.value = payload.delivery_fee),
        (township_id.value = payload.township_id),
        (refund.value = payload.refund),
        (name.value = payload.name),
        (phone.value = payload.phone),
        (cashOrCredit.value = payload.cashOrCredit);
    };
    console.log(sub_total.value);
    let cancelAction = (_) =>
      confirm("Sure to cancel?", "", () => {
        store.dispatch("clearOrder");
        router.push({ name: "home" });
      });

    let paid = () => {
      // store.dispatch("set", true);
      // return;
      let products = store.state.order.orders.map((order) => {
        return {
          id: order.id,
          price: order.price,
          sale_price: order.sale_price,
          qty: order.qty,
          purchase_price: order.purchase_price,
          discount_percent: order.discount_percent,
          discount_flat: order.discount_flat,
        };
      });

      // data to order api for backend
      let payload = {
        order_code: orderCode.value,
        tax: tax.value == "" ? 0 : tax.value,
        tax_flat: tax.value == "" ? 0 : sub_total.value * (tax.value / 100),
        discount: discount_price.value == "" ? 0 : discount_price.value,
        payment_type: cashOrCredit.value ? 1 : 0,
        paid: pay.value,
        refund: refund.value,
        total: total.value,
        subtotal: sub_total.value,
        name: name.value,
        phone: phone.value,
        address: address.value,
        delivery_status: isDelivery.value,
        township_id: township_id.value,
        delivery_fees: delivery_fee.value,
        purchasetotal: purchasetotal.value,
        products,
      };

      console.log(payload);
      // return;

      confirm("Sure to checkout?", "", () => {
        // paying.value = true;
        // console.log(confirm);
        if (cashOrCredit.value) {
          if (payload.name == "" || payload.phone == "" || payload.address == "") {
            infoError.value = true;
            return;
          }
          else {
            infoError.value = false;
          }
        }
        if (isDelivery.value) {
          if (payload.township_id == "" || payload.phone == "" || payload.address == "") {
            infoError.value = true;
            return;
          }
          else {
            infoError.value = false;
          }
        }
        // console.log(payload, "Payload data");
        axios
          .post(store.getters.getCustomerApi.orderApi, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            paying.value = false;
            // console.log("hold order item");
            store.dispatch("clearOrder");
            store.dispatch("setStartPrint", true);
            router.push({ name: "home" });
          });
      });
    };

    let hold = async () => {
      let response = await axios.get(
        store.getters.getCustomerApi.orderCodeApi,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let payload = {
        order_code: response.data[0],
        order_products: store.state.order.orders,
        sub_total: store.state.order.subtotal,
        tax_percent: store.state.order.tax_discount.tax,
        discount: store.state.order.tax_discount.discount,
        total: store.state.order.total,
        purchasetotal: store.state.order.purchasetotal,
      };
      let holdOrders = computed(() => store.state.order.holdOrders);
      if (holdOrders.value.length >= 5) {
        alert("warning", "Oops", "You have reached 5 hold orders");
        return;
      }
      store.dispatch("setHoldOrders", payload);
      store.dispatch("clearOrder");
      router.push({ name: "home" });
    };

    onMounted(async () => {
      let response = await axios.get(
        store.getters.getCustomerApi.orderCodeApi,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      store.dispatch("setOrderNumber", response.data[0]);
    });
    return {
      orderCode,
      changePay,
      total,
      township_id,
      paid,
      sub_total,
      paying,
      startPdf,
      pay,
      cancelAction,
      infoError,
      orderCount,
      hold,
    };
  },
};
</script>

<style lang="scss" scoped></style>
