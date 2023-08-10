import Swal from "sweetalert2"
import { ref } from "vue";
let passcode = ref("");
let requestPasscode = async () => {
    let res = await Swal.fire({
        title: 'Enter Your Passcode',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Enter',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
    });
    passcode.value = res.value;
    return { passcode }
}

export { requestPasscode };