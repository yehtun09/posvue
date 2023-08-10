import { ref } from "vue";
import axios from "axios";



let getDatas = () => {
    let isLoading = ref(false);
    let datas = ref([]);
    let links = ref("");

    let fetchDatas = async (url, sortable_type = "created_at", sortable_method = "desc", token) => {
        isLoading.value = true;
        let response = await axios.get(url + `&sortable_type=${sortable_type}&sortable_method=${sortable_method}`, { headers: { Authorization: `Bearer ${token}` } });
        datas.value = response.data.data;
        links.value = response.data.meta.links;
        console.log(response.data.data);
        isLoading.value = false;
    }

    return { isLoading, datas, links, fetchDatas };
}

export { getDatas };