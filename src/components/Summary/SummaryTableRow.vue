<template>
  <div class="row">
    <div class="col-6 pe-0">
      <p class="mb-0 text-truncate pd-small">
        {{ orderProduct.name
        }}<span class="">{{
          orderProduct.unit ? "(" + orderProduct.unit +'-'+ orderProduct.info + ")" : ""
        }}</span>
      </p>
      <p class="mb-0 text-truncate pd-small">
        {{ orderProduct.remark ? `(${orderProduct.remark})` : "" }}
      </p>
   
        
      <!-- </p> -->
    </div>
    <div class="col-1 px-0">
      <p class="mb-0 text-end pd-small">
        {{ orderProduct.qty }}
      </p>
    </div>
    <!-- fixed orderProduct sale price means current custome selling price -->
    <div class="col-2">
      <p class="mb-0 text-end pd-small">
        {{ removeDecimal(orderProduct.sale_price) }}
      </p>
    </div>
    <div class="col-3">
      <p class="mb-0 text-end pd-small">
        {{ removeDecimal(orderProduct.total) }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import removeDecimal from "@/composables/useRemoveDecimal";
export default {
  props: ["orderProduct"],
  setup(props) {
    let productName = computed(
      (_) => props.orderProduct.name.slice(0, 30) + " ..."
    );
    // let dashToBr = (string)=>{
    //   return string? string.replaceAll('-','<br>'):'';
    // }
    return { productName, removeDecimal };
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
} </style>
