const removeDomFocus = () => {
    // Get the element with focus
    const currentElement = document.activeElement;

    // Remove focus from the current element
    console.log(currentElement);
    currentElement.blur();
};
export default removeDomFocus;