let calculateDiscount = (price, percent) => {
  let value = price * (percent / 100);
  return parseFloat(value).toLocaleString("en-US");
};
let calculateTax = (price, percent) => {
  let value = price * (percent / 100);
  return parseFloat(value).toLocaleString("en-US");
};
export { calculateDiscount, calculateTax };
