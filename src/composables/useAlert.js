import Swal from "sweetalert2";

let alert = (
  icon = "error",
  title = "Oops!",
  text = "Please enter pay amount"
) =>
  Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: false,
    timer: 1500,
  });
let outofstockalert = (
  icon = "warning",
  title = "Oops!",
  text = "Out Of Stock"
) =>
  Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: false,
    timer: 1500,
  });
export { alert, outofstockalert };
