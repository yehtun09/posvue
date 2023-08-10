export default {
  state: {
    authenticated: false,
    authUser: "",
    token: "",
    customerApi: "",
  },
  getters: {
    getCustomerApi(state) {
      return {
        root: state.customerApi,
        loginApi: state.customerApi + "/api/login",
        categoryApi: state.customerApi + "/api/v1/product-categories",
        allProductApi: state.customerApi + "/api/v1/products",
        productsByCategory: state.customerApi + "/api/v1/product-categories", 
        orderCodeApi: state.customerApi + "/api/v1/order_code",
        orderApi: state.customerApi + "/api/v1/orders", //old
        storeOrderApi: state.customerApi + "/api/v1/order", //new
        todayOrderApi: state.customerApi + "/api/v1/today_order",
        todayTotalApi: state.customerApi + "/api/v1/today_total",
        adminOrderApi: state.customerApi + "/api/v1/orders",
        getCity : state.customerApi + "/api/v1/getCity",
        getTownship : state.customerApi + "/api/v1/getTownship",
        adminProductWarehouseApi:
          state.customerApi + "/api/v1/product-warehouses",
        adminExpenseApi: state.customerApi + "/api/v1/expenses",
        adminIncomeApi: state.customerApi + "/api/v1/incomes",
        shopInfoApi: state.customerApi + "/api/v1/shop-infos/1",
        orderPaymentApi: state.customerApi  + "/api/v1/orderpayment",
        printOrderApi : state.customerApi   + "/api/v1/orderPrint",
      };
    },
  },
  mutations: {
    SET_AUTH: (state, payload) => {
      state.token = payload.token;
      state.authUser = payload.user;
      state.authenticated = true;
    },
    LOG_OUT: (state) => {
      state.authenticated = false;
      state.token = "";
      localStorage.removeItem("auth");
    },
    SET_CUSTOMER_API: (state, payload) => (state.customerApi = payload),
  },
  actions: {
    setAuth: ({ commit }, payload) => commit("SET_AUTH", payload),
    logOut: ({ commit }) => commit("LOG_OUT"),
    setCustomerApi: ({ commit }, payload) =>
      commit("SET_CUSTOMER_API", payload),
  },
};
