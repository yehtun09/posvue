<template>
  <div data-bs-toggle="modal" :data-bs-target="`#bc${props.products[0].barcode}`" class="card shadow rounded product-card aspect-1-1 rounded-3 product-photo overflow-hidden rounded-5 position-relative FC226814">
    <div class="card-body d-flex justify-content-center align-items-center position-relative p-0">
      <img :src="img_url" class="aspect-1-1" alt="" />
      <div class="product-text m-1 rounded-3">
        <p class="fw-bold text-white text-center mb-0 p-1">
          {{ props.title }}
        </p>
        <!-- <h5 class="text-white text-center mb-1">3,000</h5> -->
      </div>
    </div>
  </div>
  <div class="modal fade mt-5" :id="'bc' + props.products[0].barcode" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-3 col-md-4" v-for="(products, index) in parentProducts.filter((prod) =>
              prod.name.toLowerCase().includes(keyword.toLowerCase())
            )" :key="index">
              <Product :product="products" class="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import Product from "./Product.vue";
let store = useStore();
const props = defineProps(["products", "title"]);
let keyword = store.state.order.keyword;
let parentProducts = computed(() => {
  return props.products.filter((pro) => pro.left != 0);
});
// let img_url = computed(() => {
//   return props.products[0]?.parent ? props.products[0].parent.photo.url : "";
// });
let img_url = "/img/imgnotfound.png";
// console.log(props.products, props.title);
</script>

<style lang="scss" scoped>
.modal-lg {
  max-width: 44rem !important;
}

@media only screen and (max-width: 1200px) {
  .modal-lg {
    max-width: 30rem !important;
  }
}
</style>
