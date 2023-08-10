<template>
  <router-view />
</template>
<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import router from "./router";
// import Pusher from "pusher-js";
import axios from "axios";
import removeDomFocus from '@/composables/useRemoveDomFocus';

export default {
  setup() {
    let store = useStore();
    const authdata = localStorage.getItem("auth");
    if (authdata) {
      // console.log("working");
      store.dispatch("setAuth", JSON.parse(authdata));
    }

    onMounted(async (_) => {
      if (localStorage.getItem("api")) {
        store.dispatch("setCustomerApi", localStorage.getItem("api"));
      }


      // from scanner machine
      var barcode = "";
      var interval;
      document.addEventListener("keydown", function (evt) {
        if (interval) clearInterval(interval);
        if (evt.code == "Enter") {
          document.getElementById("clear_order").blur();
          if (barcode) handleBarcode(barcode);
          barcode = "";
          return;
        }
        if (evt.key.length == 1) {
          // console.log("shift lr p");
          barcode += evt.key;
        }
        interval = setInterval(() => (barcode = ""), 20);
      });
      function handleBarcode(scanned_barcode) {
        const barcodeItem = document.getElementById(`${scanned_barcode}`);
        if(barcodeItem) {
          console.log(scanned_barcode);
          barcodeItem.click();
        }
      }
    });
  },
  components: {},
};
</script>
<style lang="scss"></style>
