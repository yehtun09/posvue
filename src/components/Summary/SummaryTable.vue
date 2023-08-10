<template>
  <div class="card position-relative vh-90">
    <SummaryTableHeader class="print-hide" id="print-hide" />
    <div class="table text-nowrap">
      <p class="d-none">
      <div id="element-to-show" data-html2canvas-ignore="true"><button @click="generate">HMM POS</button></div>
      </p>
      <div class="cutom-tablebody">
        <div class="row g-1">
          <div class="col-6">
            <p class="mb-0 fw-bold">Name</p>
          </div>
          <div class="col-1 px-0 text-end">
            <p class="mb-0 fw-bold">Qty</p>
          </div>
          <div class="col-2 text-end px-1">
            <p class="mb-0 fw-bold text-end">Price</p>
          </div>
          <div class="col-3 text-end">
            <p class="mb-0 fw-bold">Total</p>
          </div>
        </div>
        <SummaryTableRow v-for="(orderProduct, ind) in orderedProducts" :orderProduct="orderProduct" :key="ind" />
      </div>
    </div>

    <div class="" style="position: absolute;left: 0;right:0;bottom: 0;">
      <table class="table">
        <tr>
          <td colspan="3" class="text-start">
            <p class="mb-0 fw-bold">Subtotal</p>
          </td>
          <td colspan="1" class="text-end">
            <p class="mb-0 fw-bold">{{ removeDecimal(subtotal) }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-start">
            <p class="mb-0 fw-bold">Tax ({{ tax_discount.tax == "" ? '' : tax_discount.tax }}%)</p>
          </td>
          <td colspan="1" class="text-end">
            <p class="mb-0 fw-bold">{{ tax_discount.tax == "" ? 0 : (removeDecimal(subtotal * tax_discount.tax / 100)) }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-start">
            <p class="mb-0 fw-bold">Discount (MMK)</p>
          </td>
          <td colspan="1" class="text-end">
            <p class="mb-0 fw-bold">{{ removeDecimal(tax_discount.discount == "" ? "0" : tax_discount.discount) }}</p>
          </td>
        </tr>
        <!-- delivery fees  -->
        <tr>
          <!-- <td colspan="3" class="text-start">
            <p class="mb-0 fw-bold">Delivery Fees</p>
          </td> -->
            <!-- <td colspan="1" class="text-end">
              <p class="mb-0 fw-bold">{{ delivery_fee }}</p>
            </td> -->
        </tr>
        <tr>
          <td colspan="3" class="text-start">
            <p class="mb-0 fw-bold">Total</p>
          </td>
          <td colspan="1" class="text-end">
            <!-- <h5 class="mb-0 fw-bold">{{ removeDecimal(total + delivery_fee) }}</h5> -->
            <h5 class="mb-0 fw-bold">{{ removeDecimal(total) }}</h5>
          </td>
        </tr>
      </table>
    </div>
    <!-- <Receipt class="pdf-table pdf-receipt-table d-none" v-if="isReceipt" :delivery_fee="delivery_fee" :total="total" :tax_discount="tax_discount" :orderedProducts="orderedProducts" :subtotal="subtotal" />
    <A4Voucher class="pdf-table pdf-a5-table d-none" v-else :total="total" :delivery_fee="delivery_fee" :tax_discount="tax_discount" :orderedProducts="orderedProducts" :subtotal="subtotal" /> -->
    <Receipt class="pdf-table pdf-receipt-table d-none" :delivery_fee="delivery_fee" :total="total" :tax_discount="tax_discount" :orderedProducts="orderedProducts" :subtotal="subtotal" />
    <A4Voucher class="pdf-table pdf-a5-table d-none" :total="total" :delivery_fee="delivery_fee" :tax_discount="tax_discount" :orderedProducts="orderedProducts" :subtotal="subtotal" />
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import { onMounted, onUpdated, ref, watch, watchEffect } from "vue";
import SummaryTableRow from "./SummaryTableRow";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import SummaryTableHeader from "./SummaryTableHeader.vue";
import removeDecimal from '@/composables/useRemoveDecimal';
import Receipt from './Receipt.vue';
import A4Voucher from './A4Voucher.vue';

export default {
  components: { SummaryTableRow, SummaryTableHeader, Receipt, A4Voucher },
  props: ["holdOrderId", "noOrder"],
  setup(props) {
    let store = useStore();
    let orderedProducts = computed(() => store.state.order.orders);
    let subtotal = computed(() => store.state.order.subtotal);
    let tax_discount = computed(() => store.state.order.tax_discount);
    //subtotal with tax
    let tax = computed(() => subtotal.value + (subtotal.value * tax_discount.value.tax / 100))
    //total
    let total = computed(() => tax.value - tax_discount.value.discount)
    console.log({ total });
    let orderNumber = computed(() => store.state.order.orderNumber);
    let isReceipt = computed(() => store.state.order.isReceipt);
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    let today = ref(mm + '-' + dd + '-' + yyyy);
    let time = ref(date.getHours() + ":" + date.getMinutes() + ":" + String(date.getSeconds()).padStart(2, '0'));

    // delivery fees for delivery module 

    let delivery_fee = computed(() => store.state.order.refund_paid.delivery_fee);
    let address = computed(() => store.state.order.address);
    let township_id = computed(() => store.state.township_id);
    let generate = async () => {
      let element;
      if (isReceipt.value) {
        element = document.querySelector('.pdf-receipt-table');
      } else {
        element = document.querySelector('.pdf-a5-table');
      }

      let clone = element.cloneNode(true);
      $(clone).removeClass('d-none');
      $(clone).css("display", "block");
      let opt = null;
      if (isReceipt.value) {
        opt = {
          margin: 1,
          filename: orderNumber.value + " " + today.value,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 3, innerWidth: 500 },
          jsPDF: {
            unit: "mm",
            orientation: "portrait",
            format: [70, 219]
          },
        };
        html2pdf().set(opt).from(clone).toPdf().get('pdf').then((pdfObj) => {
          pdfObj.autoPrint();
          window.open(pdfObj.output('bloburl'), '_blank');
        }).save();
      } else {
        opt = {
          margin: 0,
          filename: orderNumber.value + " " + today.value,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, innerWidth: 1000 },
          jsPDF: {
            unit: "mm",
            orientation: "portrait",
            format: [217, 297]
          },
        };
        html2pdf().set(opt).from(clone).toPdf().get('pdf').then((pdfObj) => {
          pdfObj.setFontSize(12);
          pdfObj.setTextColor(150);
          pdfObj.text(pdfObj.internal.pageSize.getWidth() - 135,
            pdfObj.internal.pageSize.getHeight() - 10, 'Thanks for shopping with us!');
          pdfObj.autoPrint();
          window.open(pdfObj.output('bloburl'), '_blank');
        }).save();
      }




      clone.remove();
    };

    //show order from holdings
    if (props.holdOrderId !== "") {
      // console.log(props.noOrder,"No Order Is okay")
      let data = store.state.order.holdOrders[props.holdOrderId];
      store.dispatch("removeHoldOrdersByInd", props.holdOrderId);
      //hold order item
      let payload = {
        order_code: store.state.order.orderNumber,
        order_products: store.state.order.orders,
        sub_total: store.state.order.subtotal,
        tax_percent: store.state.order.tax_discount.tax,
        discount: store.state.order.tax_discount.discount,
        total: store.state.order.total,
      };
      if (!props.noOrder) {
        store.dispatch("setHoldOrders", payload);
      }
      store.dispatch("clearOrder");
      store.dispatch("setOrder", data.order_products);
      store.dispatch("setSubTotal", data.sub_total);
      store.dispatch("setTax_Discount", {
        tax: data.tax_percent,
        discount: data.discount,
        discount_percent: "",
      });
      store.dispatch("setTotal", data.total);
    }

    let startPrint = computed(() => store.state.order.startPrint);
    watchEffect(() => {
      const data = store.getters.getStartPrint;
      if (data) {
        generate();
        store.dispatch("setStartPrint", false);
      }
    })
    return { orderedProducts, subtotal, total, delivery_fee, generate, today, time, orderNumber, tax, tax_discount, removeDecimal, isReceipt };
  },
};
</script>

<style lang="scss" scoped></style>