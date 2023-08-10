<template>
  <div>
    <div class="form-group mb-4">
      <p class="small mb-2 fw-bold text-start">Payable</p>
      <input type="number" class="form-control text-end" placeholder="0" v-model="payInfos.pay" @keypress.enter="$emit('pressEnterFromPay')" />
    </div>
    <!-- check list  -->
    <div class="form-group mb-4">
      <p class="small mb-2 fw-bold text-start">Refund</p>
      <input disabled type="text" class="form-control text-end" placeholder="Refund amount" v-model="payInfos.refund" />
    </div>
    <div class="d-flex justify-content-between pa-2 flex-wrap">
      
      <!-- end delivery  -->
      <div class="form-group mb-4">
        <p class="small mb-2 fw-bold text-start">Payment Type</p>
        <label class="switch switch-sm w-50 m-0 d-block text-start text-nowrap">
          <span class="switch-label fw-bold">Cash</span>
          <input type="checkbox" class="switch-input" v-model="payInfos.cashOrCredit" />
          <span class="switch-toggle-slider">
            <span class="switch-on">
              <i class="bx bx-check"></i>
            </span>
            <span class="switch-off">
              <i class="bx bx-x"></i>
            </span>
          </span>
          <span class="switch-label fw-bold">Credit</span>
        </label>
      </div>
      <div class="form-group mb-4">
        <p class="small mb-2 fw-bold text-start">Voucher Type</p>
        <label class="switch switch-sm w-50 m-0 d-block text-start text-nowrap">
          <span class="switch-label fw-bold">A5</span>
          <input type="checkbox" class="switch-input" v-model="payInfos.receiptOrA4" />
          <span class="switch-toggle-slider">
            <span class="switch-on">
              <i class="bx bx-check"></i>
            </span>
            <span class="switch-off">
              <i class="bx bx-x"></i>
            </span>
          </span>
          <span class="switch-label fw-bold">Slip</span>
        </label>
      </div>
    </div>

    <div class="container p-0 m-0">
      <div class="mb-3 row ml-0">
        <div class="col-6">
          <input type="text" :class="[
            'form-control form-control-sm rounded',
            { 'is-invalid': infoError },
          ]" v-model="payInfos.name" placeholder="Customer Name" />
          <!-- <small class="text-danger text-start" v-if="infoError">Please Enter Name</small> -->
        </div>
        <div class="col-6">
          <input type="text" :class="[
            'form-control form-control-sm rounded',
            { 'is-invalid': infoError },
          ]" v-model="payInfos.phone" placeholder="Phone Number" />
          <!-- <small class="text-danger text-start" v-if="infoError">Please Enter Phone Number</small> -->
        </div>
      </div>

      <div class="mb-3 col-row m-0">
        <input type="text" :class="[
          'form-control form-control-sm rounded',
          { 'is-invalid': infoError },
        ]" v-model="payInfos.address" placeholder="Address" />
      </div>
      
      
      <p class="text-danger text-start small mb-3" v-if="infoError">Please Fill Required Informations</p>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { onMounted, toRaw, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  props: ["infoError"],
  setup(props, { emit }) {
    let store = useStore();
    let total = computed(() => store.state.order.total);
    let isReceipt = computed(() => store.getters.getIsReceipt);
    let delivery_fee = ref("");
    let cityid = ref(0);
    let cities = computed(() => store.state.township.city);
    let townships = computed(() => store.state.township.township);
    let township = ref();
    // isDelivery is default not deliverying

    let payInfos = ref({
      pay: "",
      name: "",
      phone: "",
      delivery_fee: "",
      address: "",
      township_id: 0,
      isDelivery: false,
      cashOrCredit: false,
      receiptOrA4: isReceipt.value,
      // refund: computed(
      //   (_) => payInfos.value.pay - total.value - delivery_fee.value
      // ),
      refund: computed(
        (_) => payInfos.value.pay - total.value
      ),
    });

    watch(
      payInfos,
      (newPI) => {
        delivery_fee.value = payInfos.value.delivery_fee;
        store.dispatch("setRefundPaid", {
          refund: payInfos.value.refund,
          paid: payInfos.value.pay,
          name: payInfos.value.name,
          township_id: payInfos.value.township_id,
          phone: payInfos.value.phone,
          address: payInfos.value.address,
          delivery_fee: payInfos.value.delivery_fee == "" ? 0 : payInfos.value.delivery_fee,
          delivery_status: payInfos.value.isDelivery,
        });
        store.dispatch("setIsReceipt", payInfos.value.receiptOrA4);
        emit("changePay", payInfos.value);
      },
      { deep: true, immediate: true }
    );

    watch(cityid, (newValue, oldValue) => {
      console.log(newValue);
      let items = townships.value.filter((item) => item.parent_id == newValue);
      township.value = items;
    });

    onMounted(() => {
      payInfos.value.receiptOrA4 = isReceipt.value;
    });
    return {
      total,
      payInfos,
      isReceipt,
      cities,
      delivery_fee,
      townships,
      cityid,
      township,
    };
  },
};
</script>

<style lang="scss" scoped></style>