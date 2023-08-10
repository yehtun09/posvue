import Swal from "sweetalert2"
let confirm = (title, text, callback,secondcallback) => {
    Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5a8dee",
        cancelButtonColor: "#ff5b5c",
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
        else
        {
           secondcallback()
        }
    })
}

export { confirm };