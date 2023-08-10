<template>
  <div :class="[
    'card shadow rounded product-card aspect-1-1 rounded-3 product-photo overflow-hidden rounded-5 position-relative',
    {
      pressEffect: isPressing,
    },
  ]" @click="addToOrder" :id="product.barcode">
    <div class="card-body d-flex justify-content-center align-items-center position-relative p-0">
      <!-- product.photo -->
      <img :src="product.photo" class="aspect-1-1" alt="" @error="defaultImage" />
      <div class="product-text m-1 rounded-3">
        <p class="fw-bold text-white text-center pd-small mb-0 pt-1">
          {{ product.name }}
        </p>
        <div class="text-center">
          <small v-if="product.unit" class="badge bg-label-primary ms-1 p-1 pd-small" style="font-size: 10px">
            {{ product.unit }}</small>
          <small v-if="product.unit" class="badge bg-label-primary ms-1 p-1 pd-small" style="font-size: 10px">
            {{ product.info }}</small>
        </div>

        <h5 class="text-white text-center my-1 pd-price-small" :style="product.unit ? 'font-size:14px' : ''">
          {{ removeDecimal(product.sale_price) }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import removeDecimal from "../../composables/useRemoveDecimal";
import { outofstockalert } from "@/composables/useAlert";
import { onMounted } from "vue";
// import { pusher } from "@/pusher";
// import Pusher from "pusher-js";
export default {
  props: ["product"],
  setup(props) {
    let store = useStore();
    // default image
    let defaultImage = (e) => {
      e.target.src = require("../../assets/imgnotfound.png");
    };
    let isPressing = ref(false);
    let currentHoldPro = computed(() =>
      store.state.order.holdOrders.find((hold) =>
        hold.order_products.find((hl) => hl.id == props.product.id)
      )
    );
    let isIncludeProduct = computed(() =>
      store.state.order.holdOrders.filter(
        (hod) => hod?.order_products.includes(props.product.id) > 0
      )
    );
    let countOrd = computed(() =>
      store.state.order.orders.find((od) => od.id == props.product.id)
    );
    let holdOrders = computed(() =>
      store.state.order.holdOrders.filter((hold) =>
        hold.order_products.find((hl) => hl.id == props.product.id)
      )
    );
    let addToOrder = () => {
      isPressing.value = true;
      setTimeout((_) => (isPressing.value = false), 500);
      let product = {
        id: props.product.id,
        name: props.product.name,
        left_qty: props.product.left,

        unit: props.product.unit,
        info: props.product.info,
        qty: 1,
        count: 0,
        price: props.product.sale_price,
        purchase_total: props.product.purchase_price,
        purchase_price: props.product.purchase_price,
        wholesale_price: props.product.wholesale_price,
        sale_price: props.product.sale_price,
        total: props.product.sale_price * 1,
        discount_percent: 0,
        discount_flat: 0,
      };
      if (store.state.order.holdOrders.length > 0 && isIncludeProduct.value) {
        if (currentHoldPro.value) {
          var realProduct = currentHoldPro.value.order_products.filter(
            (opd) => opd.id == props.product.id
          );
          let realProductQty = 0;
          let eachHoldItemQtyCounts = holdOrders.value.map((hov) => {
            return hov.order_products.find((hop) => hop.id == props.product.id)
              .qty;
          });
          for (let i = 0; i < eachHoldItemQtyCounts.length; i++) {
            realProductQty += eachHoldItemQtyCounts[i];
          }
          let left_qty = realProduct[0].left_qty - realProductQty;
          let currentProduct = store.state.order.orders.find(
            (ord) => ord.id == props.product.id
          )?.qty;
          let left_count = realProduct[0].qty - currentProduct;
          if (currentProduct + 1 > left_qty) {
            outofstockalert();
            return;
          }
        }
      }
      if (
        store.state.order.orders.length > 0 &&
        store.state.order.orders.includes(props.product.id)
      ) {
        var currentOrderPro = store.state.order.orders.find(
          (prod) => prod.id == props.product.id
        );
        if (currentOrderPro.qty + 1 > props.product.left) {
          outofstockalert();
          return;
        }
      }
      let countOrder = countOrd.value
        ? countOrd.value?.qty
        : props.product.count;
      let cot = computed(() => countOrder);
      if (cot.value + 1 > props.product.left) {
        outofstockalert();
        return;
      }

      let existedOrder = store.state.order.orders.find(
        (order) => order.id == props.product.id
      );

      existedOrder
        ? store.dispatch("incOrder", product.id)
        : store.dispatch("addOrder", product);
    };
    onMounted(() => {
      // let app_key = "188dd8eaf377e22b0c89";
      // let cluster = "us2";
      // var pusher = new Pusher(app_key, {
      //   cluster: cluster,
      // });
      // let user_code = store.state.auth.authUser.user_code;
      // let channel = pusher.subscribe(user_code);
      // channel.bind("orders", (data) => {
      //   if (data.id == props.product.id) {
      //     addToOrder();
      //   }
      // });
    });
    return { addToOrder, isPressing, removeDecimal, defaultImage };
  },
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 1024px) {
  .pd-small {
    font-size: 10pt !important;
  }

  .pd-price-small {
    font-size: 10pt !important;
  }
}
</style>
