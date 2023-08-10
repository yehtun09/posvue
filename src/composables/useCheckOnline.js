let useCheckOnline = () => {
    if (!window.navigator.onLine) {
        alert("turn internet");
        throw new Error("Something went badly wrong!");
    }
}
export { useCheckOnline };