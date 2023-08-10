<template>
    <!--  data-bs-backdrop="static" -->
    <div class="modal fade" data-bs-keyboard="false" id="backDropModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <form class="modal-content" style="margin-bottom: 20vh;" @submit.prevent="editSalePrice">
                <div class="modal-header">
                    <h5 class="modal-title" id="backDropModalTitle">Change Sale Price</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-check form-check">
                        <input class="form-check-input" checked :disabled="isCustom" type="radio" name="salePrice" id="inlineRadio2" :value="price" v-model="set_price">
                        <label class="form-check-label" for="inlineRadio2">
                            Sale Price <p class="fw-bold d-inline-block">{{ removeDecimal(price) }}</p>
                        </label>
                    </div>
                    <div class="form-check form-check">
                        <input class="form-check-input" :disabled="isCustom" type="radio" name="salePrice" id="inlineRadio" :value="wholesale_price" v-model="set_price">
                        <label class="form-check-label" for="inlineRadio">
                            Wholesale Price <p class="fw-bold d-inline-block">{{ removeDecimal(wholesale_price) }}</p>
                        </label>
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="isCustom">
                        <label class="form-check-label" for="flexSwitchCheckDefault">Custom Price</label>
                    </div>
                    <input v-if="isCustom" @keypress.enter="updateSalePrice" class="form-control form-control-sm" v-model="custom_price" name="salePrice" id="inlineRadio">
                </div>
                <div class="modal-footer">
                    <!-- <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
                        Close
                    </button> -->
                    <button :disabled="set_price == undefined || set_price == false" type="button" class="btn btn-primary" id="closeModal" data-bs-dismiss="modal" @click="updateSalePrice">Save</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watchEffect, watch } from 'vue';
import { useStore } from 'vuex';
import removeDecimal from "@/composables/useRemoveDecimal";

let store = useStore();
let price = ref("");

let sale_price = ref("");
let wholesale_price = ref("");
let custom_price = ref("");

let isCustom = ref(false);
let set_price = ref(price.value);

let editSalePrice = _ => {
    set_price.value = custom_price.value;
    // let modal = new bootstrap.Modal(document.getElementById("backDropModal")).dispose();
    document.querySelector(".btn-close").click();
    store.dispatch("setSalePrice", custom_price.value);
    reset();
}
let reset = () => {
    set_price.value = false;
}
let updateSalePrice = _ => {

    store.dispatch("setSalePrice", set_price.value);
    reset();
    // set_price.value = false;
    // isCustom.value = false;
}

watch(isCustom, _ => isCustom.value ? set_price.value = "" : "");

watch(custom_price, _ => set_price.value = custom_price.value);

watchEffect(_ => {
    let id = store.state.order.salePriceModalId;
    let selectedOrder = store.state.order.orders.find(order => order.id == id);
    if (selectedOrder) {
        price.value = selectedOrder.price;
        wholesale_price.value = selectedOrder.wholesale_price;
        custom_price.value = selectedOrder.custom_price;
    }
})

</script>

<style scoped></style>