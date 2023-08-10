<template>
    <AdminLayout>
        <div class="card">
            <h5 class="card-header">Product Warehouse</h5>
            <div v-if="isLoading" class="w-100 vh-60 d-flex justify-content-center align-items-center">
                <Loader />
            </div>
            <div v-else class="text-nowrap p-1 table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Product</p>
                                    <div class="ms-2 opacity-0">
                                        <div class="">
                                            <i @click="changeSorting('product.name','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='product.name' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('product.name','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='product.name' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0">Warehouse</p>
                                    <div class="ms-2 opacity-0">
                                        <div class="">
                                            <i @click="changeSorting('order_code','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='order_code' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('order_code','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='order_code' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Qty</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('qty','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='qty' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('qty','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='qty' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Status</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('status','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='status' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('status','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='status' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Date</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('created_at','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='created_at' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('created_at','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='created_at' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>


                    <tbody class="table-border-bottom-0">
                        <tr v-for="data in datas" :key="data.id">
                            <td class="px-1 text-nowrap">
                                <span>{{ data.product.name }}</span>
                            </td>
                            <td class="px-1 text-nowrap">
                                <span>{{ data.warehouse.warehouse_name }}</span>
                            </td>
                            <td class="px-1 text-nowrap">
                                <p class=""> {{ data.qty }}</p>
                            </td>
                            <td class="px-1 text-nowrap">
                                <button class="btn btn-primary btn-sm" v-if="data.status == 0">
                                    Enable
                                </button>
                                <button class="btn btn-label-danger btn-sm" v-else>
                                    Disable
                                </button>
                            </td>
                            <td class="px-1 text-nowrap">
                                {{ data.created_at }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="dataTables_paginate paging_simple_numbers d-flex justify-content-end m-3" id="DataTables_Table_1_paginate">
                    <ul class="pagination">
                        <li v-for="link in links" :class="['paginate_button page-item me-2 rounded',{active:link.active,disabled:!link.url}]">
                            <a href="#" @click="fetchDatas(link.url, sortable_type, sortable_method, token)" aria-controls="DataTables_Table_1" data-dt-idx="1" tabindex="0" v-html="link.label" class="page-link">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { computed } from '@vue/reactivity';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Loader from '@/components/Misc/Loader.vue';
import { getDatas } from "@/composables/useFetch";

export default {
    setup() {
        let store = useStore();
        let sortable_type = ref("id");
        let sortable_method = ref("desc");
        let url = computed(_ => store.getters.getCustomerApi.adminProductWarehouseApi + "?page=1");
        let token = store.state.auth.token;
        let { isLoading, datas, links, fetchDatas } = getDatas();

        onMounted(async _ => await fetchDatas(url.value, sortable_type.value, sortable_method.value, token));

        let changeSorting = async (st, sm) => {
            sortable_type.value = st;
            sortable_method.value = sm;
            await fetchDatas(url.value, sortable_type.value, sortable_method.value, token);

        }

        return { datas, links, isLoading, fetchDatas, sortable_type, sortable_method, token, changeSorting };
    },
    components: { AdminLayout, Loader }
}
</script>

<style lang="scss" scoped>

</style>