let removeDecimal = (price) => {
  // let value = parseFloat(price).toFixed(2).replace(/\.00$/, "");
  let value = parseFloat(price).toLocaleString("en-US");
  return value;
};
export default removeDecimal;
