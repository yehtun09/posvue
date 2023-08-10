<template>
  <Layout>
    <div class="col-2 custom-scroll bg-custom rounded">
      <CategoryList @categoryChange="changeCategory" />
    </div>
    <div class="col-5 pb-3 custom-scroll">
      <span class="badge rounded-pill bg-label-primary mb-3" v-if="searchKeyword">
        Search result for : {{ searchKeyword }}
      </span>
      <ProductList :products="products" v-if="!isCategoryLoading" />
      <div v-else class="w-100 vh-60 d-flex justify-content-center align-items-center">
        <Loader />
      </div>
    </div>
    <div class="col-5 ps-0 position-relative custom-scroll">
      <Orders />
    </div>
    <SalePriceModal :key="Math.random()" />
  </Layout>
</template>

<script>
import Orders from "../components/Home/Orders";
import Loader from "../components/Misc/Loader.vue";
import CategoryList from "../components/Home/CategoryList";
import ProductList from "../components/Home/ProductList.vue";
import Layout from "@/components/layout/Layout.vue";
import axios from "axios";

import { onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import _ from "lodash";
import { useWebNotification } from "@vueuse/core";
// import Pusher from "pusher-js";
import SalePriceModal from "@/components/Home/SalePriceModal.vue";
export default {
  components: {
    Orders,
    Loader,
    CategoryList,
    Layout,
    ProductList,
    SalePriceModal,
  },
  setup() {
    let token = useStore().state.auth.token;
    let store = useStore();
    let isSearch = computed(() => store.state.order.isSearch);
    let products = ref([]);
    let currentCategory = ref("all");
    let isCategoryLoading = ref(false);
    let searchKeyword = ref("");
    let productsAll = computed(() => store.getters.getProducts);
    const keyword = computed(() => store.getters.getKeyword);
    let changeCategory = (payload) => (currentCategory.value = payload);
    let fetchShop = async () => {
      let token = store.state.auth.token;
      let response = await axios.get(store.getters.getCustomerApi.shopInfoApi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let payload = {
        shop_name: response.data.name,
        shop_phone: response.data.phone,
        shop_address: response.data.address,
        voucher_photo:
          response.data.voucher_photo == "no"
            ? false
            : response.data.voucher_photo,
        shop_photo:
          response.data.shop_photo == "no" ? false : response.data.shop_photo,
      };
      let condition = response.data.voucher_type ? true : false;
      document.title = response.data.name ?? "Hmm Pos";
      store.dispatch("setIsReceipt", condition);
      store.dispatch("setShopName", payload);
    };
    let fetchProducts = async (id) => {
      // if (id == "all") {
      isCategoryLoading.value = true;
      let response = await axios.get(
        `${store.getters.getCustomerApi.allProductApi}?search_name=${keyword.value}&category_id=${currentCategory.value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let datas = response.data.data;
      products.value = datas;
      let mani = [];
      for (const key in datas) {
        datas[key].forEach((d) => (mani = [...mani, d]));
      }

      store.dispatch("addTmpOrder", mani);
      isCategoryLoading.value = false;
      if (id == "all") {
        store.dispatch("setCurrentCategoryId", "");
      } else {
        store.dispatch("setCurrentCategoryId", id);
      }
      // } else {
      //   isCategoryLoading.value = true;
      //   isCategoryLoading.value = false;
      // }
    };
    watch(isSearch, () => fetchProducts(currentCategory.value));
    watch(currentCategory, () => fetchProducts(currentCategory.value));

    // search
    watchEffect((_) => {
      const keyword = store.getters.getKeyword;
      if (keyword == "") {
        fetchProducts(currentCategory.value);
        searchKeyword.value = "";
      }
    });
    onMounted(async () => {
      fetchProducts(currentCategory.value);
      fetchShop();
    });
    return {
      changeCategory,
      products,
      isCategoryLoading,
      searchKeyword,
    };
  },
};
</script>

<style lang="scss" scoped></style>
