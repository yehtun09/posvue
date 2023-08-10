<template>
  <div class="container-fluid p-0 vh-100 overflow-hidden">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="d-flex justify-content-center align-items-center mb-5">
              <img src="../../assets/logo.png" class="w-25" alt="" />
              <span class="app-brand-text demo h3 mb-0 fw-bold ms-3"
                >HMM POS</span
              >
            </div>
            <!-- /Logo -->
            <h5 class="mb-3 text-black-50">Welcome to HMM POS !</h5>

            <form
              id="formAuthentication"
              class="mb-3 fv-plugins-bootstrap5 fv-plugins-framework"
              @submit.prevent="login"
            >
              <div class="mb-3 fv-plugins-icon-container">
                <label for="email" class="form-label">Email</label>
                <input
                  v-model="formData.email"
                  type="text"
                  class="form-control"
                  id="email"
                  name="email-username"
                  placeholder="Enter your email or username"
                  autofocus=""
                />
                <div
                  class="fv-plugins-message-container invalid-feedback"
                ></div>
              </div>
              <div class="mb-3 form-password-toggle fv-plugins-icon-container">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                </div>
                <div class="input-group input-group-merge has-validation">
                  <input
                    v-model="formData.password"
                    :type="isShowPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control"
                    name="password"
                    placeholder="············"
                    aria-describedby="password"
                  />
                  <span
                    class="input-group-text cursor-pointer"
                    v-if="isShowPassword"
                    ><i
                      class="bx bx-hide"
                      @click="isShowPassword = !isShowPassword"
                    ></i
                  ></span>
                  <span class="input-group-text cursor-pointer" v-else
                    ><i
                      class="bx bx-show"
                      @click="isShowPassword = !isShowPassword"
                    ></i
                  ></span>
                </div>
                <div
                  class="fv-plugins-message-container invalid-feedback"
                ></div>
              </div>
              <div class="text-danger text-small mb-3" v-if="errors">
                {{ errors }}
              </div>
              <div class="mb-3">
                <button
                  class="btn btn-label-success btn-sm mb-3"
                  type="button"
                  @click="editApi"
                >
                  Edit API <i class="bi bi-pen"></i>
                  <span
                    v-if="isLoading"
                    class="spinner-grow ms-3 spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  class="btn btn-primary w-100"
                  type="submit"
                  :disabled="isLoading"
                >
                  Sign in
                  <span
                    v-if="isLoading"
                    class="spinner-grow ms-3 spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button> 
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useCheckOnline } from "@/composables/useCheckOnline";

export default {
  setup() {
    let router = useRouter();
    let store = useStore();

    let isShowPassword = ref(false);

    let loginApi = store.getters.getCustomerApi.loginApi;
    // console.log(loginApi);

    let formData = ref({
      email: "",
      password: "",
    });

    let errors = ref("");

    let isLoading = ref(false);

    let editApi = () => {
      localStorage.getItem("api") &&
        localStorage.setItem("old-api", localStorage.getItem("api"));
      localStorage.removeItem("api");
      router.push({ name: "customerApi" });
    };

    let login = async () => {
      // useCheckOnline();
      isLoading.value = true;
      try {
        let response = await axios.post(loginApi, formData.value);
        if (response.status == 200) {
          let payload = {
            token: response.data.access_token,
            user: response.data.user,
          };
          //use local storage
          localStorage.setItem("auth", JSON.stringify(payload));
          store.dispatch("setAuth", payload);
          router.push({ name: "home" });
        }
      } catch (e) {
        errors.value = "Error";
        isLoading.value = false;
        // console.log(e);
      }
    };
    return { formData, errors, login, isLoading, editApi, isShowPassword };
  },
};
</script>

<style scoped></style>
