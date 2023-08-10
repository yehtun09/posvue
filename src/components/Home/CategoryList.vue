<template>
  <div
    v-if="!isLoading"
    class="d-flex justify-content-start align-items-center mb-3"
  >
    <div class="menu-vertical w-100">
      <ul class="py-4 text-white ps-0">
        <li
          :class="[
            'menu-item w-100 rounded',
            { cuactive: currentCategory == 'all' },
          ]"
        >
          <a @click="changeCurrentCategory('all')" class="menu-link">
            <div>All Category</div>
          </a>
        </li>

        <li
          @click="category.isNew = false"
          :class="[
            'menu-item w-100 rounded',
            { cuactive: currentCategory == category.id },
          ]"
          v-for="category in categories"
          :key="category.id"
        >
          <a @click="changeCurrentCategory(category.id)" class="menu-link">
            <div>{{ category.name }}</div>
            <span
              class="badge badge-center rounded-pill bg-label-primary ms-1"
              v-if="category.isNew"
              ><i class="bi bi-bell-fill"></i
            ></span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div v-else>
    <Loader></Loader>
  </div>
</template>

<script>
import Loader from "../Misc/Loader.vue";
import Category from "../Home/Category.vue";
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useWebNotification } from "@vueuse/core";

export default {
  components: {
    Loader,
    Category,
  },
  setup(props, { emit }) {
    let store = useStore();
    let token = store.state.auth.token;
    let categories = ref("");
    let isLoading = ref(true);
    let currentCategory = ref("all");

    let changeCurrentCategory = (id) => (currentCategory.value = id);

    onMounted(async () => {
      let response = await axios.get(store.getters.getCustomerApi.categoryApi, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = response.data.data;
      let manipulated = data.map((category) => {
        return {
          id: category.id,
          name: category.name,
          isNew: false,
        };
      });
      categories.value = manipulated;
      isLoading.value = false;

      // realtime
      // window.Echo.channel("category").listen("CategoryStored", (payload) => {
      //   console.log(payload);
      //   let manipulated = {
      //     id: payload.category.id,
      //     name: payload.category.name,
      //     isNew: true,
      //   };
      //   categories.value.push(manipulated);
      //   let { isSupported, show, notification } = useWebNotification({
      //     title: "New Category is arrived",
      //     // body: payload.category.name + " is added",
      //     icon: window.location.origin + "/android-chrome-192x192.png",
      //   });
      //   isSupported.value && show();
      // });
    });

    watch(currentCategory, () => emit("categoryChange", currentCategory.value));

    return { categories, currentCategory, isLoading, changeCurrentCategory };
  },
};
</script>

<style lang="scss" scoped></style>
