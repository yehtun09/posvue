<template>
  <div class="row g-1 justify-content-center align-items-center">
    <div class="col-3">
      <p class="my-1 text-truncate text-start">
        {{ order.name }}<span class="">{{ order.unit ? "(" + order.unit + ")" : "" }}</span>
      </p>
      <small class="small-xs">{{ order.qty }} x {{ removeDecimal(order.sale_price) }}</small>
    </div>
    <div class="col-6">
      <p class="text-center text-nowrap mb-0 button-round">
        <button type="button" @click="decreaseOrder(order.id)" class="me-1 btn rounded-pill btn-icon btn-label-danger me-1">
          <i class="bi bi-dash"></i>
        </button>
        <span v-if="!orderEdit" class="me-1 bg-label-primary p-1 px-2 rounded d-inline-block" style="width: 65px; cursor: pointer" @click="changeOrderCount">
          {{ order.qty }}</span>
        <input v-else v-click-away="unsetEditMode" autofocus @keypress.enter="unsetEditMode" type="number" class="form-control d-inline-block" style="width: 90px" placeholder="enter quantity" v-model="order.qty" />
        <button type="button" @click="increaseOrder(order.id)" class="me-1 btn rounded-pill btn-icon btn-label-success">
          <i class="bi bi-plus"></i>
        </button>
        <button type="button" @click="deleteSingleOrder(order.id)" class="btn rounded-pill btn-icon btn-label-danger">
          <i class="bi bi-trash"></i>
        </button>
        <button type="button" @click="showSetSalePriceModal" class="mx-1 btn rounded-pill btn-icon btn-label-info">
          <i class="bi bi-cash-coin"></i>
        </button>
      </p>
    </div>
    <div class="col-3">
      <p class="text-end text-nowrap my-1 dynamic-size">
        {{ removeDecimal(totalCost) }}
      </p>
    </div>
    <div class="col-12 d-flex">
      <input type="text" class="form-control form-control-sm w-25" placeholder="Enter Remark" :value="order.remark ? order.remark : ''" @input="enterRemark" />
      <div class="input-group input-group-sm w-25">
        <input min="0" placeholder="Discount" type="number" class="form-control form-control-sm ms-1 pe-0" v-model="discount_percent" @input="enterDisountPercent">
        <span class="input-group-text" id="basic-addon1">%</span>
      </div>
      <div class="input-group input-group-sm w-20">
        <input min="0" placeholder="Discount" type="number" class="form-control form-control-sm ms-1 pe-0" v-model="discount_flat" @input="enterDisountFlat">
      </div>
    </div>
  </div>
  <hr class="my-1" />
</template>

<script>
import { confirm } from "@/composables/useConfirm";
import order from "@/store/order";
import { computed } from "@vue/reactivity";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import removeDomFocus from "@/composables/useRemoveDomFocus";
import removeDecimal from "@/composables/useRemoveDecimal";
import { outofstockalert } from "@/composables/useAlert";
export default {
  props: ["order"],
  setup(props) {
    let store = useStore();
    let orderEdit = ref(false);
    let holdCount = ref(0);
    let discount_percent = ref(props.order.discount_percent == 0 ? "" : props.order.discount_percent);
    let discount_flat = ref(props.order.discount_flat == 0 ? "" : props.order.discount_flat);
    let deleteSingleOrder = (payloadId) =>
      confirm("Sure to delete?", "", () =>
        store.dispatch("deleteSingleOrder", payloadId)
      );
    let count = computed(() => {
      return store.state.order.tmpOrders.find((ord) => ord.id == props.order.id)
        .count;
    });
    let showSetSalePriceModal = (_) => {
      store.dispatch("setSalePriceModalStatus", true);
      let ele = document.getElementById("backDropModal");

      let a = new bootstrap.Modal(ele);
      a.show();
      store.dispatch("setSalePriceModalId", props.order.id);
    };
    let currentHoldPro = computed(() => {
      return store.state.order.holdOrders.find((hold) =>
        hold.order_products.find((hl) => hl.id == props.order.id)
      );
    });
    let holdOrders = computed(() =>
      store.state.order.holdOrders.filter((hold) =>
        hold.order_products.find((hl) => hl.id == props.order.id)
      )
    );
    let increaseOrder = (payloadId) => {
      if (count.value + 1 > props.order.left_qty) {
        outofstockalert();
        return;
      }
      if (props.order.qty + 1 > props.order.left_qty) {
        outofstockalert();
        return;
      }
      if (currentHoldPro.value) {
        var realProduct = currentHoldPro.value.order_products.filter(
          (opd) => opd.id == props.order.id
        );
        let realProductQty = 0;
        let eachHoldItemQtyCounts = holdOrders.value.map((hov) => {
          return hov.order_products.find((hop) => hop.id == props.order.id).qty;
        });
        for (let i = 0; i < eachHoldItemQtyCounts.length; i++) {
          realProductQty += eachHoldItemQtyCounts[i];
        }
        let left_qty = realProduct[0].left_qty - realProductQty;
        if (props.order.qty + 1 > left_qty) {
          outofstockalert();
          return;
        }
      }
      store.dispatch("incOrder", payloadId);
      removeDomFocus();
    };
    let decreaseOrder = (payloadId) => {
      store.dispatch("decOrder", payloadId);
      removeDomFocus();
    };
    let totalCost = computed(() => {
      const cost = (props.order.qty * props.order.sale_price) - props.order.discount_flat;
      // const totalCost = discount_percent.value == 0 ? cost : (cost - (cost * (props.order.discount_percent / 100)));
      return cost;
    });

    let changeOrderCount = (_) => (orderEdit.value = true);

    let unsetEditMode = (_) => {
      orderEdit.value = false;
      if (currentHoldPro.value) {
        var realProduct = currentHoldPro.value.order_products.filter(
          (opd) => opd.id == props.order.id
        );
        let realProductQty = 0;
        let eachHoldItemQtyCounts = holdOrders.value.map((hov) => {
          return hov.order_products.find((hop) => hop.id == props.order.id).qty;
        });
        for (let i = 0; i < eachHoldItemQtyCounts.length; i++) {
          realProductQty += eachHoldItemQtyCounts[i];
        }
        let left_qty = realProduct[0].left_qty - realProductQty;
        props.order.qty > left_qty && (props.order.qty = left_qty);
      }
      props.order.qty > props.order.left_qty &&
        (props.order.qty = props.order.left_qty);

      props.order.qty < 1 &&
        store.dispatch("deleteSingleOrder", props.order.id);
    };

    let enterRemark = (e) => {
      store.dispatch("enterRemark", {
        input: e.target.value,
        id: props.order.id,
      });
    };

    let enterDisountPercent = () => {
      const cost = props.order.qty * props.order.sale_price;
      const calculated_discount_flat = cost * (discount_percent.value / 100);
      discount_flat.value = calculated_discount_flat;
      console.log(discount_flat);
      store.dispatch("setSingleOrderDiscount", { id: props.order.id, discount_percent: discount_percent.value, discount_flat: calculated_discount_flat })
      // store.dispatch("setSalePriceBySingleOrder", { id: props.order.id, sale_price: (props.order.sale_price - calculated_discount_flat) });
    }

    let enterDisountFlat = () => {
      const cost = props.order.qty * props.order.sale_price;
      const calculated_discount_percent = (discount_flat.value / cost) * 100;
      let reg = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
      discount_percent.value = calculated_discount_percent.toString().match(reg)[0];
      store.dispatch("setSingleOrderDiscount", { id: props.order.id, discount_percent: calculated_discount_percent, discount_flat: discount_flat.value })
    }

    watch(totalCost, (_) => {
      store.dispatch("setSingleOrderQty", {
        id: props.order.id,
        qty: props.order.qty,
      });
    });

    return {
      increaseOrder,
      decreaseOrder,
      deleteSingleOrder,
      changeOrderCount,
      orderEdit,
      totalCost,
      discount_percent,
      discount_flat,
      unsetEditMode,
      removeDecimal,
      enterRemark,
      showSetSalePriceModal,
      enterDisountPercent,
      enterDisountFlat
    };
  },
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 1200px) {
  .button-round {
    scale: 0.8;
  }

  .dynamic-size {
    font-size: 0.8rem;
  }
}
</style>
