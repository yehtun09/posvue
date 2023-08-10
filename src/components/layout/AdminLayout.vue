<template>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
                <div class="app-brand demo">
                    <router-link :to="{name:'home'}" class="app-brand-link">
                        <span class="app-brand-text demo menu-text fw-bold ms-2">HMM POS</span>
                    </router-link>

                    <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
                        <i class="bx menu-toggle-icon d-none d-xl-block fs-4 align-middle"></i>
                        <i class="bx bx-x d-block d-xl-none bx-sm align-middle"></i>
                    </a>
                </div>

                <div class="menu-divider mt-0"></div>

                <div class="menu-inner-shadow"></div>

                <ul class="menu-inner py-1">
                    <!-- Dashboards -->
                    <li :class="['menu-item',{active:$route.name=='product-warehouse'}]">
                        <router-link :to="{name:'product-warehouse'}" class="menu-link">
                            <i class="menu-icon tf-icons bx bx-home-smile"></i>
                            <div data-i18n="eCommerce">Product Warehouse</div>
                        </router-link>
                    </li>
                    <li :class="['menu-item',{active:$route.name=='admin-order'}]">
                        <router-link :to="{name:'admin-order'}" class="menu-link">
                            <i class="menu-icon tf-icons bx bx-money-withdraw"></i>
                            <div data-i18n="eCommerce">Orders</div>
                        </router-link>
                    </li>

                    <!-- Layouts -->
                    <li class="menu-item">
                        <a href="javascript:void(0);" class="menu-link menu-toggle">
                            <i class="menu-icon tf-icons bx bx-sitemap"></i>
                            <div data-i18n="Layouts text-nowrap">
                                <p class="mb-0 text-nowrap">Expense</p>
                            </div>
                        </a>

                        <ul class="menu-sub">
                            <li class="menu-item">
                                <router-link :to="{name:'admin-expense'}" class="menu-link">
                                    <div data-i18n="Collapsed menu">Expenses</div>
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <router-link :to="{name:'admin-income'}" class="menu-link">
                                    <div data-i18n="Content navbar">Income</div>
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <a href="layouts-content-navbar-with-sidebar.html" class="menu-link">
                                    <div data-i18n="Content nav + Sidebar">Content nav + Sidebar</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>

            <div class="layout-page" style="padding-top: 0 !important;">
                <div class="content-wrapper">
                    <div class="container-xxl flex-grow-1 container-p-y">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
    setup() {
        onMounted(_ => {
            let menu_items = document.querySelectorAll(".menu-item");
            menu_items.forEach(menu_item => {
                menu_item.addEventListener("click", e => {
                    menu_item.classList.toggle("open");
                })
            })
        })

        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>