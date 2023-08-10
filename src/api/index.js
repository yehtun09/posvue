import { computed, ref, watch } from 'vue';
import auth from '../store/auth';
// let customerApi = localStorage.getItem("api");
let customerApi = computed(_ => auth.getters.getCustomerApi);
let apiList = ref("");
watch(customerApi, () => {
    apiList.value = {
        root: customerApi.value,
        loginApi: customerApi.value + "/api/login",
        categoryApi: customerApi.value + "/api/v1/product-categories",
        allProductApi: customerApi.value + "/api/v1/products",
        productsByCategory: customerApi.value + "/api/v1/product-categories",
        orderCodeApi: customerApi.value + "/api/v1/order_code",
        orderApi: customerApi.value + "/api/v1/orders", //old
        storeOrderApi: customerApi.value + "/api/v1/order", //new
        todayOrderApi: customerApi.value + "/api/v1/today_order",
        todayTotalApi: customerApi.value + "/api/v1/today_total"
    };
    console.log(apiList.value);
})
let api = apiList.value;
export { api };