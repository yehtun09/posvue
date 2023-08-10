<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center wave-bg flex-column"
    :style="backgroundImg"
  >
    <h3 class="mb-5 text-start fw-bold w-50 text-white">
      Enter Your API <i class="bi bi-gear fw-bold ms-1"></i>
    </h3>
    <div class="card w-50">
      <!-- <div class="card-header pb-0">
                <p class="h5">Enter API <i class="bi bi-gear fw-bold ms-1"></i></p>
            </div> -->
      <hr class="my-0" />
      <div class="card-body pb-0">
        <label for="" class="form-label">API</label>
        <input
          type="text"
          class="form-control"
          name=""
          v-model="api"
          autofocus
          id=""
          @keypress.enter="enterApi"
        />
      </div>
      <div class="card-footer my-0 mx-auto w-50">
        <button
          class="btn btn-label-primary w-100 text-center"
          @click="enterApi"
        >
          Enter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    let api = ref(localStorage.getItem("old-api") ?? " ");
    let router = useRouter();
    let store = useStore();
    let backgroundImg = computed(() => {
      return { backgroundImage: `url(${require("../../static/wave.svg")})` };
    });
    let enterApi = () => {
      localStorage.setItem("api", api.value.replace(/\s+/g, ""));
      store.dispatch("setCustomerApi", api.value.replace(/\s+/g, ""));
      router.push({ name: "login" });
    };
    return { api, enterApi, backgroundImg };
  },
};
</script>

<style scoped>
.wave-bg {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: right top;
  background-size: cover;
}
</style>
