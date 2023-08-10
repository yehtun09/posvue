<template>
  <div class="row print-hide">
    <div class="col-12">
      <nav id="Nav" class="navbar navbar-expand-lg navbar-light bg-light vh-8">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="javascript:void(0)">{{
            shop_name
          }}</a>
          <div
            class="navbar-nav align-items-center"
            v-if="$route.name == 'home'"
          >
            <div class="nav-item navbar-search-wrapper mb-0">
              <a
                class="nav-item nav-link search-toggler px-0"
                href="javascript:void(0);"
              >
                <div class="input-group border rounded shadow">
                  <input
                    v-model="keyword"
                    type="text"
                    class="form-control"
                    placeholder="Search Product"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    @keyup.enter="searching"
                  />
                  <button
                    type="button"
                    class="btn rounded-pill btn-icon btn-label-primary"
                  >
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </a>
            </div>
               <div
                    class="mx-3"
                  >
                    <!-- Button trigger modal -->
                  <button type="submit" class="btn btn-primary"  data-bs-target="#exampleModal" data-bs-toggle="modal">
                      Order Option
                  </button>
                  <!-- Modal -->
                    <form action="" @submit.prevent="sendOrder">
                      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Order  </h5>
                            <button type="button" class="btn" data-bs-dismiss="modal"><span aria-hidden="false">&times;</span></button>
                          </div>
                          <div class="modal-body">
                            <div class="form-group">
                              <label for="recipient-name" class="col-form-label">Order:</label>
                              <input  required
                              type="number" class="form-control paid" id="recipient-name"  
                              placeholder="Enter Order Number" 
                              v-model="payload.id"
                              >
                              <small class="text-danger small">{{ errorMessage }}</small>
                            </div>
                          </div>
                          <div class="modal-footer d-flex justify-content-between">
                            <button type="submit" class="btn btn-secondary" data-dismiss="modal">Paid</button>
                            <div class="form-group mb-4 mx-4">
                                <p class="small mb-2 fw-bold text-start"></p>
                                <label class="switch switch-sm w-50 m-0 d-block text-start text-nowrap">
                                  <span class="switch-label fw-bold">A5</span>
                                  <input type="checkbox" class="switch-input" v-model="isReceipt" />
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
                            <button type="button" class="btn btn-primary" @click="printOrder">Print</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </form>
              </div>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li class="nav-item navbar-dropdown dropdown-user dropdown">
                <a
                  class="nav-link dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div class="avatar avatar-online">
                    <img v-if="shop_img"
                      :src="shop_img"
                      alt=""
                      class="rounded-circle"
                    />
                    <img v-else
                      src="/logo.png"
                      alt=""
                      class="rounded-circle"
                    />
                  </div>
                </a>
              </li>
              <li class="nav-item ms-1">
                <button
                  type="button"
                  class="btn btn-label-danger"
                  @click="handleLogout"
                >
                  Logout<i class="bi bi-box-arrow-right ms-3"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <Receipt class="pdf-table pdf-receipt-table d-none" :delivery_fee="dataInfos[0]?.delivery_status" :total="dataInfos[0]?.subtotal" :tax_discount="{tax:dataInfos[0]?.tax,discount:dataInfos[0]?.discount}" :orderedProducts="dataInfos[0]?.products" :subtotal="dataInfos[0]?.subtotal"/>
  <A4Voucher v-if="showA4" class="pdf-table pdf-a5-table d-none" :delivery_fee="dataInfos[0]?.delivery_status" :total="dataInfos[0]?.subtotal" :tax_discount="{tax:dataInfos[0]?.tax,discount:dataInfos[0]?.discount}" :orderedProducts="dataInfos[0]?.products" :subtotal="dataInfos[0]?.subtotal"/>
</template>

<script> 
// import { confirm } from "@/composables/useConfirm";
import { onMounted,ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { requestPasscode } from "@/composables/useRequestPasscode";
import axios from 'axios';
import html2pdf from "html2pdf.js";
import Receipt from '../Summary/Receipt.vue';
import A4Voucher from '../Summary/A4Voucher.vue';
import { emailAddress, phone } from '@/frestui/assets/vendor/libs/formvalidation/dist/js/locales/ar_MA';
import township from '@/store/township';
// import { alert } from "@/composables/useAlert";

 export default {
  components: {  Receipt, A4Voucher },
  setup() {
    let store = useStore();
    let router = useRouter();
    let keyword = ref(store.state.order.keyword);
    let errorMessage = ref("");
    const showA4 = ref(false);
    let authUser = store.state.auth.authUser;
    let isReceipt = ref(false);
    const shop_name = computed(() => store.state.order.shop_info.shop_name);
    const shop_img = computed(() => store.state.order.shop_info.shop_photo);

    const payload = ref({
        id : "",
      });
    let dataInfos = ref({
      receiptOrA4 : "receipt"
    });
    const sendOrder = async ()=>{
      let token = store.state.auth.token;
      let data = await axios.get(store.getters.getCustomerApi.orderPaymentApi+"/"+payload.value.id,{
        headers: { Authorization: `Bearer ${token}`},
      });
      if(!data.data.status){
        errorMessage.value = data.data.message;
      }else{
        alert("Update is sccessful");
      }
    }

    let printOrder = async ()=>{
      let token = store.state.auth.token;
        try {
          let response = await axios.get(store.getters.getCustomerApi.printOrderApi + "/" + payload.value.id, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.data.status) {
            errorMessage.value = response.data.message;
          } else 
            {
          let testdata = response.data.data;
          console.log(testdata);
          testdata.receiptOrA4 = isReceipt.value;
          dataInfos.value = testdata;
          showA4.value = true;
          store.dispatch("setIsReceipt", dataInfos.value.receiptOrA4);
          console.log(dataInfos);
    
          let products = store.state.order.orders.map((order) => {
            return {
              id: dataInfos[0].id,
              price: dataInfos[0].purchase_price,
              sale_price: dataInfos[0].sale_price,
              qty: dataInfos[0].qty,
              purchase_price: dataInfos[0].purchase_price,
              discount_percent: dataInfos[0].discount,
              discount_flat: dataInfos[0].tax_flat,
            };
          });

      // return;

          store.dispatch("setOrderNumber",testdata[0].order_code);
          store.dispatch("setRefundPaid",
          [refund=testdata[0].refund,
           paid  = testdata[0].paid,
           name  = testdata[0].name,
           phone = testdata[0].phone,
           address  =  testdata[0].address,
           delivery_fee = testdata[0].delivery_fees,
           delivery_status  = testdata[0].delivery_status,
           township_id  = testdata[0].township_id,
        ]
          )
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
          }
        } catch (error) {
          console.error(error);
        }
    };

    let handleLogout = () =>
      confirm("Sure to logout?", "", () => {
        store.dispatch("logOut");
        store.dispatch("clearOrder");
        router.push({ name: "login" });
      });
    let passcodeRequest = async () => {
      let { passcode } = await requestPasscode();
      passcode.value == 111
        ? router.push({ name: "product-warehouse" })
        : alert("error", "Wrong Passcode", "");
    };
    let searching = () => {
      store.dispatch("q");
    };
    watch(keyword, (_) => store.dispatch("setKeyword", keyword.value));
    onMounted(() => {
      dataInfos.value.receiptOrA4 = isReceipt.value;
    });
    return {
      handleLogout,
      authUser,
      keyword,
      passcodeRequest,
      shop_name,
      shop_img,
      payload,
      sendOrder,
      searching,
      errorMessage,
      printOrder,
      isReceipt,
      showA4,
      dataInfos,
      // products,
    };
  },
};
</script>
<style>
.mx-4 {
    margin-right: -12.5rem !important;
    margin-left: 1.5rem !important;
}
</style>
