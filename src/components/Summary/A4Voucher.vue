<template>
  <!-- for print -->
  <div id="invoice-POS" style="height: 100%" class="w-100 p-5">
    <div
      id="top"
      class="d-flex align-items-center justify-content-between w-100"
    >
      <div style="width: 150px">
        <img :src="shop_info.voucher_photo" width="100" alt="Vouch photo" />
      </div>
      <div style="text-align: center; width: 350px">
        <p class="fw-bold mb-0">{{ shop_info.shop_name }}</p>
        <p class="itemtext mb-0">
          {{ shop_info.shop_address }}
        </p>
        <p class="mb-0 itemtext">{{ shop_info.shop_phone }}</p>
        <div class="info"></div>
      </div>
      <div class="" style="width: 150px"></div>
      <!--End Info-->
    </div>
    <!-- </div> -->
    <div id="top" class="d-flex justify-content-between align-items-center" style="width: 61%;margin-top: -30px;">
      <div style="">

        <p class="fw-bold itemtext mb-0">
          Name : {{ $store.state.order.refund_paid?.name }}
        </p>
        <p class="fw-bold mb-0">
          Phone: {{ $store.state.order.refund_paid?.phone }}
        </p>
      </div>
      <div>
        <p class="fw-bold itemtext mb-0 text-end">
          {{ $store.state.order.orderNumber }}{{ $store.state.order.payment_type ? "-Credit" : "-Cash" }}
        </p>
        <p class="itemtext mb-0 text-end">
          Date : {{ new Date().toLocaleDateString("de-DE") }}
        </p>
        <div class="info"></div>
        <!--End Info-->
      </div>
    </div>
    <!--End InvoiceTop-->
    <hr class="hrstyle" style="margin: 0" />
    <div id="bot">
      <div id="table">
        <table style="width: 100%">
          <tr class="tabletitle" style="border-bottom: 1px dashed black">
            <td class="item">
              <p class="itemtext">No</p>
            </td>
            <td class="item">
              <p class="itemtext">Description</p>
            </td>
            <td class="Hours" align="right">
              <p class="itemtext">Qty</p>
            </td>
            <td class="Hours" align="right">
              <p class="itemtext">Price</p>
            </td>
            <td class="Rate" align="right">
              <p class="itemtext">Line Total</p>
            </td>
          </tr>
          <tr
            class="service"
            v-for="(orderProduct, ind) in orderedProducts"
            :key="ind"
          >
            <td class="tableitem" valign="top">
              <p class="">{{ ind + 1 }}</p>
            </td>
            <td class="tableitem" style="width: 320px !important">
              <p class="">
                {{ orderProduct.name }}
                {{ orderProduct.unit ? "- " + orderProduct.unit : "" }}
                {{ orderProduct.info ? ", " + orderProduct.info : "" }}
              </p>
              <p class="caption text-truncate">
                {{ orderProduct.remark ? `(${orderProduct.remark})` : "" }}
              </p>
            </td>
            <td class="tableitem" align="center">
              <p class="">{{ orderProduct.qty }}</p>
            </td>
            <td class="tableitem" align="right">
              <p class="">{{ removeDecimal(orderProduct.sale_price) }}</p>
            </td>
            <td class="tableitem" align="right">
              <p class="itemtext">
                {{ removeDecimal(orderProduct.total) }}
                </p>
            </td>
          </tr>
        </table>
        <hr class="hrstyle" style="margin: 0" />
        <table>
          <tr class="tabletitle">
            <td style="width: 500px !important"></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Subtotal</p>
            </td>
            <td class="payment" align="right">
              <p class="mb-0 itemtext">{{ removeDecimal(subtotal) }}</p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Delivery Fee</p>
            </td>
            <td class="payment" align="right">
              <p class="mb-0 itemtext">
                {{ delivery_fee }}
                <!-- {{
                  removeDecimal(
                    $store.state.order.refund_paid.delivery_fee == ""
                      ? 0
                      : $store.state.order.refund_paid.delivery_fee
                  )
                }} -->
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Tax</p>
            </td> 
            <td class="payment" align="right">
              <p class="mb-0 itemtext">
                {{
                  tax_discount.tax == ""
                    ? 0
                    : calculateTax(subtotal, tax_discount.tax)
                }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Discount</p>
            </td>
            <td class="payment" align="right">
              <p class="mb-0 itemtext">
                {{
                  removeDecimal(
                    tax_discount.discount == "" ? "0" : tax_discount.discount
                  )
                }}
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate" style="border-top: 1px dotted black">
              <p class="mb-0">Total</p>
            </td>
            <td
              class="payment"
              align="right"
              style="border-top: 1px dotted black"
            >
              <p class="mb-0 itemtext">
                {{ total }}
                <!-- {{
                  removeDecimal(
                    Number(total) +
                      Number(
                        $store.state.order.refund_paid.delivery_fee == ""
                          ? 0
                          : $store.state.order.refund_paid.delivery_fee
                      )
                  )
                }} -->
              </p>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Paid</p>
            </td>
            <td class="payment" align="right">
              <p class="mb-0 itemtext">
                {{
                  removeDecimal(
                    $store.state.order.refund_paid.paid == ""
                      ? 0
                      : $store.state.order.refund_paid.paid
                  )
                }}
              </p>
            </td>
          </tr>

          <tr class="tabletitle">
            <td></td>
            <td></td>
            <td class="Rate">
              <p class="mb-0">Change</p>
            </td>
            <td class="payment" align="right">
              <p class="mb-0 itemtext">
                {{ removeDecimal($store.state.order.refund_paid.refund) }}
              </p>
            </td>
          </tr>
        </table>
      </div>
      <!--End Table-->
    </div>
    <!--End InvoiceBot-->
  </div>
</template>

<script>
import removeDecimal from "@/composables/useRemoveDecimal";
import {
  calculateTax,
  calculateDiscount,
} from "@/composables/useCalculatePercent";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  props: [
    "total",
    "subtotal",
    "orderedProducts",
    "tax_discount",
    "delivery_fee",
  ],
  setup(props) {
    const store = useStore();
    let shop_info = computed((_) => store.getters.getShopInfo);
    let dashToBr = (string) => {
      return string ? string.replaceAll("-", "<br>") : "";
    };
    let publicPath = process.env.BASE_URL;
    let voucher_style = computed(
      (_) => `background:url(${publicPath}voucher.png)`
    );
    return {
      total: props.total,
      delivery_fee: props.delivery_fee,
      subtotal: props.subtotal,
      orderedProducts: props.orderedProducts,
      tax_discount: props.tax_discount,
      removeDecimal,
      shop_info,
      publicPath,
      voucher_style,
      calculateTax,
      calculateDiscount,
      dashToBr,
    };
  },
};
</script>

<style lang="scss" scoped>
#invoice-POS {
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding: 2mm;
  margin: 0 auto;
  width: 100%;
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
    // font-size: 1.5em;
    font-weight: bolder;
    color: black;
    margin: 10px;
  }

  p {
    // font-size: 0.9em;
    // font-weight: bolder;
    color: black;
    margin: 5px;
  }

  h3 {
    // font-size: 1.2em;
    font-weight: bolder;
    line-height: 2em;
    color: black;
    margin: 10px;
  }

  p {
    // font-size: 1em;
    color: black;
    line-height: 1.2em;
    // font-weight: bolder;
    margin: 5px 0;
    padding: 0;
  }

  .p-font {
    // font-size: 1em;
    color: black;
  }

  #top,
  #mid,
  #bot {
    /* Targets all id with 'col-' */
    // border-bottom: 1px solid #eee;
  }

  #top {
    min-height: 100px;
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
    // background: url("/public/voucher.png") no-repeat;
    background-repeat: no-repeat;
    background-size: 100px 80px;
  }

  .clientlogo {
    float: left;
    height: 80px;
    width: 80px;
    // background: url("/public/voucher.png") no-repeat;
    background-repeat: no-repeat;
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
    // font-size: 1em;
  }

  .service {
    // border-bottom: 1px solid #eee;
    padding: 10px;
  }

  .item {
    width: 24mm;
  }

  .itemtext {
    // font-size: 0.7em;
    font-weight: bold;
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
    // font-size: 0.5em;
  }
}
</style>
