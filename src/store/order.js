export default {
  state: {
    orders: [],
    tmpOrders: [],
    orderNumber: "",
    startPrint: false,
    warehouse_id: "",
    tax_discount: {
      discount_percent: 0,
      tax: 0,
      discount: 0,
    },
    total: 0,
    subtotal: 0,
    purchasetotal: 0,
    keyword: "",
    salePriceModalId: "",
    holdOrders: [],
    refund_paid: {
      refund: "",
      paid: "",
    },
    showSalePriceModal: true,
    shop_info: {},
    isReceipt: false,
    isSearch: false,
    curretnCategoryId: "",
  },
  getters: {
    getStartPrint(state) {
      return state.startPrint;
    },
    // search
    getKeyword(state) {
      return state.keyword;
    },
    getShopInfo(state) {
      return state.shop_info;
    },
    getIsReceipt(state) {
      return state.isReceipt;
    },
    getProducts(state) {
      return state.tmpOrders;
    },
    getCurrentCategoryId(state) {
      return state.curretnCategoryId;
    },
  },
  mutations: {
    SET_PAID_REFUND: (state, payload) => (state.paid_refund = payload),
    SET_START_PRINT: (state, payload) => (state.startPrint = payload),
    SET_ORDER_NUMBER: (state, payload) => (state.orderNumber = payload),
    ADD_TMP_ORDER: (state, payload) => (state.tmpOrders = payload),
    ADD_ORDER: (state, payload) => {
      state.orders.unshift(payload);
      console.log(payload);
      let currentProduct = state.tmpOrders.find(
        (product) => product.id == payload.id
      );
      currentProduct.count += 1;
    },
    // ADD_ORDER: (state, payload) => console.log("order", payload),
    SET_ORDER: (state, payload) => {
      state.orders = payload;
      console.log(payload);
    },
    INC_ORDER: (state, payloadId) => {
      let order = state.orders.find((order) => order.id == payloadId);
      let currentProduct = state.tmpOrders.find(
        (product) => product.id == payloadId
      );
      currentProduct.count += 1;
      order.qty += 1;
      order.purchase_total = order.purchase_price * order.qty;
      // let total = (order.sale_price * order.qty) - order.discount_flat;
      // order.total = 100;
      // state.orders.find((order) => order.id == payloadId).total = 100;
    },
    DEC_ORDER: (state, payloadId) => {
      let order = state.orders.find((order) => order.id == payloadId);
      let tempOrder = state.tmpOrders.find((order) => order.id == payloadId);
      if (order.qty == 1) {
        tempOrder.count -= 1;
        state.orders = state.orders.filter((order) => order.id !== payloadId);
      } else {
        tempOrder.count -= 1;
        order.qty -= 1;
      }
      order.purchase_total = order.purchase_price * order.qty;
      // order.total = (order.sale_price * order.qty) - order.discount_flat;
    },
    SET_SINGLE_ORDER_QTY: (state, payload) => {
      let selectedOrder = state.orders.find((order) => order.id == payload.id);
      selectedOrder.qty = payload.qty;
      selectedOrder.purchase_total = selectedOrder.qty * selectedOrder.purchase_price;
      selectedOrder.total = (selectedOrder.qty * selectedOrder.sale_price) - selectedOrder.discount_flat;
    },
    DELETE_SINGLE_ORDER: (state, payloadId) => {
      let tempOrder = (state.tmpOrders.find(
        (order) => order.id == payloadId
      ).count = 0);
      state.orders = state.orders.filter((order) => order.id !== payloadId);
    },
    CLEAR_ORDER: (state) => {
      state.orders = [];
      state.total = 0;
      state.subtotal = 0;
      state.tax_discount.tax = " ";
      state.tax_discount.discount = " ";
    },
    // search
    SET_KEYWORD: (state, payload) => (state.keyword = payload),
    SET_TAX_DISCOUNT: (state, payload) => {
      state.tax_discount.tax = payload.tax;
      state.tax_discount.discount_percent = payload.discount_percent;
      state.tax_discount.discount = payload.discount;
    },

    SET_TOTAL: (state, payload) => (state.total = payload),
    SET_SALE_PRICE_MODAL_ID: (state, payload) =>
      (state.salePriceModalId = payload),
    SET_SALT_PRICE_MODAL_STATUS: (state, payload) =>
      (state.showSalePriceModal = payload),
    SET_SALE_PRICE: (state, payload) => {
      let order = state.orders.find((ord) => ord.id == state.salePriceModalId);
      order.sale_price = payload;
      order.total = (order.sale_price * order.qty) - order.discount_flat;
    },
    SET_SALE_PRICE_BY_SINGLE_ORDER: (state, payload) => {
      let order = state.orders.find((ord) => ord.id == payload.id);
      order.sale_price = payload.sale_price;
      order.total = (order.sale_price * order.qty) - order.discount_flat;
    },
    // SET_PURCHASE_TOTAL: (state, payload) => console.log(payload),
    SET_SUBTOTAL: (state, payload) => (state.subtotal = payload),
    SET_PURCHASE_TOTAL: (state, payload) => (state.purchasetotal = payload),
    SET_HOLD_ORDERS: (state, payload) => state.holdOrders.unshift(payload),
    REMOVE_HOLD_ORDERS_BYIND: (state, payload) =>
    (state.holdOrders = state.holdOrders.filter(
      (ele, ind) => ind !== payload
    )),
    ENTER_REMARK: (state, { input, id }) => {
      state.orders.find((order) => order.id == id).remark = input;
    },
    /***
     *
     * set Delivery feature in delivery module
     */
    SET_REFUND_PAID: (state, payload) => {
      state.refund_paid.refund = payload.refund;
      state.refund_paid.paid = payload.paid;
      state.refund_paid.name = payload.name;
      state.refund_paid.phone = payload.phone;
      state.refund_paid.address = payload.address;
      state.refund_paid.delivery_fee = payload.delivery_fee;
      state.refund_paid.delivery_status = payload.delivery_status;
      state.refund_paid.township_id = payload.township_id;
    },
    SET_SHOP_NAME: (state, payload) => {
      // console.log(payload);
      state.shop_info = payload;
    },
    SET_IS_RECEIPT: (state, payload) => {
      state.isReceipt = payload;
    },
    SET_CURRENT_CATEGORY_ID: (state, payload) => {
      state.curretnCategoryId = payload;
    },
    SET_PRODUCT_SEARCH: (state) => {
      state.isSearch = !state.isSearch;
    },
    SET_SINGLE_ORDER_DISCOUNT: (state, payload) => {
      const order = state.orders.find(order => order.id == payload.id);
      order.discount_percent = payload.discount_percent;
      order.discount_flat = payload.discount_flat;
      console.log(payload.discount_flat);
      order.total = (order.sale_price * order.qty) - order.discount_flat;
    }
  },
  actions: {
    setPaidRefund: ({ commit }, payload) => commit("SET_PAID_REFUND", payload),
    setStartPrint: ({ commit }, payload) => commit("SET_START_PRINT", payload),
    setShopName: ({ commit }, payload) => commit("SET_SHOP_NAME", payload),
    addTmpOrder: ({ commit }, payload) => commit("ADD_TMP_ORDER", payload),
    setOrderNumber: ({ commit }, payload) =>
      commit("SET_ORDER_NUMBER", payload),
    addOrder: ({ commit }, payload) => commit("ADD_ORDER", payload),
    setOrder: ({ commit }, payload) => commit("SET_ORDER", payload),
    incOrder: ({ commit }, payloadId) => commit("INC_ORDER", payloadId),
    decOrder: ({ commit }, payloadId) => commit("DEC_ORDER", payloadId),
    setSingleOrderQty: ({ commit }, payload) =>
      commit("SET_SINGLE_ORDER_QTY", payload),
    clearOrder: ({ commit }) => commit("CLEAR_ORDER"),
    deleteSingleOrder: ({ commit }, payloadId) =>
      commit("DELETE_SINGLE_ORDER", payloadId),
    // search
    setKeyword: ({ commit }, payload) => commit("SET_KEYWORD", payload),

    setTax_Discount: ({ commit }, payload) =>
      commit("SET_TAX_DISCOUNT", payload),
    setSalePriceModalId: ({ commit }, payload) =>
      commit("SET_SALE_PRICE_MODAL_ID", payload),
    setSalePriceModalStatus: ({ commit }, payload) =>
      commit("SET_SALT_PRICE_MODAL_STATUS", payload),
    setSalePrice: ({ commit }, payload) => commit("SET_SALE_PRICE", payload),
    setTotal: ({ commit }, payload) => commit("SET_TOTAL", payload),
    setPurchaseTotal: ({ commit }, payload) =>
      commit("SET_PURCHASE_TOTAL", payload),
    setSubTotal: ({ commit }, payload) => commit("SET_SUBTOTAL", payload),
    setHoldOrders: ({ commit }, payload) => commit("SET_HOLD_ORDERS", payload),
    removeHoldOrdersByInd: ({ commit }, payload) =>
      commit("REMOVE_HOLD_ORDERS_BYIND", payload),
    enterRemark: ({ commit }, payload) => commit("ENTER_REMARK", payload),
    setRefundPaid: ({ commit }, payload) => commit("SET_REFUND_PAID", payload),
    setIsReceipt: ({ commit }, payload) => commit("SET_IS_RECEIPT", payload),
    setCurrentCategoryId: ({ commit }, payload) =>
      commit("SET_CURRENT_CATEGORY_ID", payload),
    searchProduct: ({ commit }) => commit("SET_PRODUCT_SEARCH"),
    setSingleOrderDiscount: ({ commit }, payload) => commit("SET_SINGLE_ORDER_DISCOUNT", payload),
    setSalePriceBySingleOrder: ({ commit }, payload) => commit("SET_SALE_PRICE_BY_SINGLE_ORDER", payload),
  },
};
