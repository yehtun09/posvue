<template>
  <div class="row g-3" v-auto-animate>
    <template class="" v-for="(products, key) in allProducts" :key="key">
      <div
        v-if="key == ''"
        v-for="product in filterSearch(products)"
        :key="product.id"
        :class="['col-lg-3 col-md-4', checkCategory(product.category_id)]"
      >
        <Product :product="product" />
      </div>

      <div
        v-if="
          key !== '' && products.filter((prod) => prod.left != 0).length > 0
        "
        :class="['col-lg-3 col-md-4', checkCategory(products[0].category_id)]"
      >
        <ParentProduct :products="products" :title="key" />
      </div>

      <!-- <div v-else class="col-lg-3 col-md-4"> -->
      <!-- <p>{{ key }}</p> -->
      <!-- <ParentProduct :products="products" :title="key" />
      </div> -->
    </template>

    <div v-if="allProducts.length < 1">
      <div class="alert alert-primary" role="alert">No Product found</div>
    </div>
  </div>
</template>

<script>
import Product from "./Product";
import { computed } from "@vue/reactivity";
import { watch } from "vue";
import { useStore } from "vuex";
import ParentProduct from "./ParentProduct.vue";
export default {
  components: { Product, ParentProduct },
  props: ["products"],
  setup(props) {
    let store = useStore();
    let currentCategoryId = computed(() => store.getters.getCurrentCategoryId);
    let allProducts = props.products;
    let keyword = computed(() => store.state.order.keyword);
    // let allProducts = props.products;
    // watch(currentCategoryId, (value) => {
    //   if (value == "") {
    //     allProducts = props.products.filter((pro) => pro.left_qty != 0);
    //   }
    // });
    // console.log(props.products);
    let filterSearch = (products) => {
      return products.filter((pro) => pro != null && pro?.left != 0);
    };
    let checkCategory = (p_id) => {
      if (p_id != currentCategoryId.value && currentCategoryId.value != "") {
        return "d-none";
      } else if (currentCategoryId.value == "") {
        return "";
      } else {
        return false;
      }
    };
    return {
      allProducts,
      currentCategoryId,
      checkCategory,
      filterSearch,
      keyword,
    };
  },
};
</script>

<style lang="scss" scoped></style>
