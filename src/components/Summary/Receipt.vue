<template>
  <!-- for print -->
  <div id="invoice-POS">
    <center id="top">
      <img :src="shop_info.voucher_photo" width="100" alt="" />
      <p class="fw-bold mb-0">{{ shop_info.shop_name }}</p>
      <p class="itemtext mb-0">
        {{ shop_info.shop_address }}
      </p>
      <p class="mb-0 itemtext">{{ shop_info.shop_phone }}</p>
      <div class="info"></div>
      <!--End Info-->
    </center>
    <div id="top" class="d-flex justify-content-between align-items-center">
      <div>
        <p class="itemtext mb-0">
          Name : {{ $store.state.order.refund_paid?.name }}
        </p>
        <p class="itemtext mb-0">
          Phone: {{ $store.state.order.refund_paid?.phone }}
        </p>
      </div>
      <div>
        <p class="itemtext mb-0 text-end">
          {{ $store.state.order.orderNumber }}
        </p>
        <p class="itemtext mb-0 text-end">
          Date : {{ new Date().toLocaleDateString("de-DE") }}
        </p>
        <div class="info"></div>
        <!--End Info-->
      </div>
    </div>
    <!--End InvoiceTop-->
    <hr class="hrstyle" style="padding: 0; margin: 0" />
    <div id="bot">
      <div id="table">
        <table class="mx-0 px-0">
          <tr class="tabletitle" style="border-bottom: 1px dashed black">
            <td class="">
              <p class="itemtext">No</p>
            </td>
            <td class="item" style="width: 100px;">
              <p class="itemtext">Description</p>
            </td>
            <td class="Hours">
              <p class="itemtext">Qty</p>
            </td>
            <td class="Hours" align="right">
              <p class="itemtext">Price</p>
            </td>
            <td class="Rate" align="right">
              <p class="itemtext">Total</p>
            </td>
          </tr>
          <tr class="service" v-for="(orderProduct, ind) in orderedProducts" :key="ind">
            <td class="tableitem" style="padding-top: -10px;">
              <p class="itemtext">{{ ind + 1 }}</p>
            </td>
            <td class="tableitem" style="padding-top: -10px;">
              <p class="itemtext">
                {{ orderProduct.name }}
                {{ orderProduct.unit ? "- " + orderProduct.unit : "" }}
                {{ orderProduct.info ? ", " + orderProduct.info : "" }}
                {{ orderProduct.discount_percent == 0 ? "" : `( discount - ${orderProduct.discount_flat} )` }}
              </p>
              <p class="caption text-truncate">
                {{ orderProduct.remark ? `(${orderProduct.remark})` : "" }}
              </p>
            </td>
            <td class="tableitem" style="padding-top: -10px;" align="center">
              <p class="itemtext">{{ orderProduct.qty }}</p>
            </td>
            <td class="tableitem" style="padding-top: -10px;" align="right">
              <p class="itemtext">{{ removeDecimal(orderProduct.sale_price) }}</p>
            </td>
            <td class="tableitem" style="padding-top: -10px;" align="right">
              <p class="itemtext">{{ removeDecimal(orderProduct.total) }}</p>
            </td>
          </tr>
        </table>
        <hr class="hrstyle m-0 p-0" />
        <table>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Subtotal</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">{{ removeDecimal(subtotal) }}</p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Delivery Fees</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">
                {{ removeDecimal(delivery_fee) }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Tax {{ tax_discount.tax == "" ? '' : `(${tax_discount.tax}%)` }}</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">
                {{ tax_discount.tax == "" ? 0 : calculateTax(subtotal, tax_discount.tax) }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Discount</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">
                {{ removeDecimal(tax_discount.discount == "" ? "0" : tax_discount.discount) }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle" style="border-top: 1px dashed black;">
            <td class="Rate">
              <p class="itemtext mb-0" style="text-align: left;">Total</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">{{ removeDecimal(Number(total) + Number(delivery_fee)) }}</p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Paid</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">
                {{ $store.state.order.refund_paid.paid == "" ? 0 : $store.state.order.refund_paid.paid }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td class="Rate">
              <p class="itemtext mb-0">Change</p>
            </td>
            <td class="payment" align="right" colspan="4">
              <p class="itemtext mb-0" style="margin-right: -5px;">
                {{ $store.state.order.refund_paid.refund }}
              </p>
            </td>
          </tr>
        </table>
      </div>
      <!--End Table-->

      <div id="legalcopy" class="text-center">
        <p class="itemtext legal">
          <strong>Thanks for shopping with us!</strong>
        </p>
      </div>
    </div>
    <!--End InvoiceBot-->
  </div>
  <!--End Invoice-->
</template>

<script>
import removeDecimal from "@/composables/useRemoveDecimal";
import { computed } from "vue";
import { useStore } from "vuex";
import {
  calculateTax,
  calculateDiscount,
} from "@/composables/useCalculatePercent";
export default {
  props: ["total", "subtotal", "orderedProducts", "tax_discount", "delivery_fee"],
  setup(props) {
    const store = useStore();
    let shop_info = computed((_) => store.getters.getShopInfo);
    return {
      total: props.total,
      delivery_fee: props.delivery_fee,
      subtotal: props.subtotal,
      orderedProducts: props.orderedProducts,
      tax_discount: props.tax_discount,
      removeDecimal,
      shop_info,
      calculateTax,
    };
  },
};
</script>

<style lang="scss" scoped>
#invoice-POS {
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding: 2mm;
  margin: 0 auto;
  width: 60mm;
  height: auto;
  background: #fff;

  ::selection {
    background: #f31544;
    color: #fff;
  }

  ::moz-selection {
    background: #f31544;
    color: #fff;
  }

  h1 {
    font-size: 1.5em;
    font-weight: bolder;
    color: black;
    margin: 10px;
  }

  p {
    // font-size: 0.9em;
    font-weight: bolder;
    color: black;
    margin: 0;
    // margin: 5px;
  }

  h3 {
    font-size: 1.2em;
    font-weight: bolder;
    line-height: 2em;
    color: black;
    margin: 10px;
  }

  p {
    // font-size: 1em;
    color: black;
    line-height: 1.2em;
    font-weight: bolder;
    margin: 4px 0;
  }

  .p-font {
    font-size: 1em;
    color: black;
  }

  #top,
  #mid,
  #bot {
    /* Targets all id with 'col-' */
    // border-bottom: 1px solid #eee;
  }

  #top {
    min-height: 40px;
  }

  #mid {
    min-height: 80px;
  }

  #bot {
    min-height: 50px;
  }

  #top .logo {
    //float: left;
    height: 80px;
    width: 100px;
    background: url("/public/myanadiblack.png") no-repeat;
    background-size: 100px 80px;
  }

  .clientlogo {
    float: left;
    height: 80px;
    width: 80px;
    background: url("/public/myanadiblack.png") no-repeat;
    background-size: 80px 80px;
    border-radius: 50px;
  }

  .payment {
    padding-right: 5px;
  }

  .info {
    display: block;
    //float:left;
    margin-left: 0;
  }

  .title {
    float: right;
  }

  .title p {
    text-align: right;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  .tabletitle {
    padding: 0;
    margin: 0;
    font-size: 1em;
  }

  .service {
    // border-bottom: 1px solid #eee;
    padding: 10px;
  }

  .item {
    width: 16mm;
  }

  .itemtext {
    font-size: 0.65em;
  }

  #legalcopy {
    margin-top: 5mm;
  }

  .pdf-table {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hrstyle {
    border-top: 1px dashed black;
  }

  .caption {
    font-size: 0.5em;
  }
}
</style>
