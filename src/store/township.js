export default {
    state :{
      city : [],
      township:[]
    },
    getters:{
      getCity(state){
        return state.city;
      },
      getTownship(state){
        return state.township;
      }
    },
    mutations:{
     SET_CITY :(state,payload) => {
        state.city = payload;
     },
     SET_TOWNSHIP : (state,payload) => {
       state.township = payload;
     }
    },
    actions:{
     setCity: ({ commit }, payload) => commit("SET_CITY", payload),
     setTownship: ({ commit }, payload) => commit("SET_TOWNSHIP", payload),
    }
}