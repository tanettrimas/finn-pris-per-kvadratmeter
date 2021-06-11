
console.log("hello");

document.getElementById('saveAddress').addEventListener('click', () => {
    let value = document.getElementById('address1').value;
    const address = { value }
    browser.storage.local.set({address});
});