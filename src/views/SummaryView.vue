<template>
  <Layout>
    <div class="col-3 print-hide">
      <Steps @holdOrderId="hoId"></Steps>
    </div>
    <div class="col-5 print-w-100">
      <SummaryTable :noOrder="noOrder" :holdOrderId="holdOrderId" :key="randomKey"></SummaryTable>
    </div>
    <div class="col-4 print-hide">
      <SummaryPay></SummaryPay>
    </div>
  </Layout>
</template>

<script>
import SummaryPay from "../components/Summary/SummaryPay";
import SummaryTable from "../components/Summary/SummaryTable";
import Steps from "../components/Summary/Steps.vue";
import Layout from "../components/layout/Layout";
import { ref, computed, onMounted } from "vue";
import { confirm } from "../composables/useConfirm.js"
import { useStore } from "vuex";
import axios from "axios";
export default {
  components: {
    SummaryPay,
    SummaryTable,
    Steps,
    Layout,
  },
  setup() {
    let holdOrderId = ref("");
    let randomKey = ref("");
    let orderItem = ref("")
    let noOrder = ref(false);
    let store = useStore();
    let hoId = (item) => {
      // console.log(id,"WEjdfsal;ksfd KLKJSJKL")
      let orderItem = computed(() => store.state.order.orders);
      // console.log(orderItem.value,"Order Item");
      if (orderItem.value.length) {
        confirm("Do you want to hold the current Order ?", "", () => {
          holdOrderId.value = item.ind;
          randomKey.value = Math.random();
        }, () => {
          noOrder.value = true;
          holdOrderId.value = item.ind;
          randomKey.value = Math.random();
        }
        )

      }
      //If no order list in table
      else {
        noOrder.value = true;
        holdOrderId.value = item.ind;
        randomKey.value = Math.random();
      }


    };
    let token = useStore().state.auth.token;
    onMounted(async () => {
      //get township
      let resposeCity = await axios.get(store.getters.getCustomerApi.getCity, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let resposeTownship = await axios.get(
        store.getters.getCustomerApi.getTownship,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      store.dispatch("setCity", resposeCity.data.data);
      store.dispatch("setTownship", resposeTownship.data.data);
    })
    return { noOrder, hoId, holdOrderId, randomKey, orderItem };
  },
};
</script>

<style lang="scss" scoped></style>
