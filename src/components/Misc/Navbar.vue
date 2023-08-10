<template>
  <div class="row print-hide">
    <div class="col-12">
      <nav id="Nav" class="navbar navbar-expand-lg navbar-light bg-light vh-8">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="javascript:void(0)">{{
            shop_name
          }}</a>
          <div
            class="navbar-nav align-items-center"
            v-if="$route.name == 'home'"
          >
            <div class="nav-item navbar-search-wrapper mb-0">
              <a
                class="nav-item nav-link search-toggler px-0"
                href="javascript:void(0);"
              >
                <div class="input-group border rounded shadow">
                  <input
                    v-model="keyword"
                    type="text"
                    class="form-control"
                    placeholder="Search Product"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    @keyup.enter="searching"
                  />
                  <button
                    type="button"
                    class="btn rounded-pill btn-icon btn-label-primary"
                  >
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </a>
            </div>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <!-- <li class="nav-item navbar-dropdown dropdown-user dropdown me-3 hover">
                <i class="bi bi-gear h5" @click="passcodeRequest"></i>

              </li> -->
              <li class="nav-item navbar-dropdown dropdown-user dropdown">
                <a
                  class="nav-link dropdown-toggle hide-arrow"
                  href="javascript:void(0);"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div class="avatar avatar-online">
                    <img v-if="shop_img"
                      :src="shop_img"
                      alt=""
                      class="rounded-circle"
                    />
                    <img v-else
                      src="/logo.png"
                      alt=""
                      class="rounded-circle"
                    />
                  </div>
                </a>
              </li>
              <li class="nav-item ms-1">
                <button
                  type="button"
                  class="btn btn-label-danger"
                  @click="handleLogout"
                >
                  Logout<i class="bi bi-box-arrow-right ms-3"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { confirm } from "@/composables/useConfirm";
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { requestPasscode } from "@/composables/useRequestPasscode";
import { alert } from "@/composables/useAlert";

export default {
  setup() {
    let store = useStore();
    let router = useRouter();
    let keyword = ref(store.state.order.keyword);
    let authUser = store.state.auth.authUser;
    const shop_name = computed(() => store.state.order.shop_info.shop_name);
    const shop_img = computed(() => store.state.order.shop_info.shop_photo);
    let handleLogout = () =>
      confirm("Sure to logout?", "", () => {
        store.dispatch("logOut");
        store.dispatch("clearOrder");
        router.push({ name: "login" });
      });
    let passcodeRequest = async () => {
      let { passcode } = await requestPasscode();
      passcode.value == 111
        ? router.push({ name: "product-warehouse" })
        : alert("error", "Wrong Passcode", "");
    };
    let searching = () => {
      store.dispatch("searchProduct");
    };
    watch(keyword, (_) => store.dispatch("setKeyword", keyword.value));
    return {
      handleLogout,
      authUser,
      keyword,
      passcodeRequest,
      shop_name,
      shop_img,
      searching,
    };
  },
};
</script>
