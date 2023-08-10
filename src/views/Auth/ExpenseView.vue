<template>
    <AdminLayout>
        <div class="card">
            <h5 class="card-header">Expenses</h5>
            <div v-if="isLoading" class="w-100 vh-60 d-flex justify-content-center align-items-center">
                <Loader />
            </div>
            <div v-else class="text-nowrap p-1 table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Expense Category</p>
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
                                    <p class="mb-0">Entry Date</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('entry_date','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='entry_date' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('entry_date','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='entry_date' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center  me-3 pe-5 float-end">
                                    <p class="mb-0"> Amount</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('amount','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='amount' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('amount','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='amount' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th class="px-1 text-nowrap sorting position-relative">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0"> Description</p>
                                    <div class="ms-2">
                                        <div class="">
                                            <i @click="changeSorting('description','asc')" :class="['bx bx-chevron-up h5 mb-0 opacity-low',{'opacity-high':sortable_type=='description' && sortable_method== 'asc'}]"></i>
                                        </div>
                                        <div class="margin-top-custom">
                                            <i @click="changeSorting('description','desc')" :class="['bx bx-chevron-down h5 mb-0 opacity-low',{'opacity-high':sortable_type=='description' && sortable_method== 'desc'}]"></i>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>


                    <tbody class="table-border-bottom-0">
                        <tr v-for="data in datas" :key="data.id">
                            <td class="px-1 text-nowrap">
                                <span>{{ data.expense_category.name }}</span>
                            </td>
                            <td class="px-1 text-nowrap">
                                <span>{{ data.entry_date }}</span>
                            </td>
                            <td class="px-1 text-nowrap">
                                <p class="me-5 pe-5 float-end"> {{ data.amount }}</p>
                            </td>
                            <td class="px-1 text-nowrap">
                                {{ data.description }}
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
        let url = computed(_ => store.getters.getCustomerApi.adminExpenseApi + "?page=1");
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