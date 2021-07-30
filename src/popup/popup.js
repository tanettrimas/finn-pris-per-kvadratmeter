document.getElementById("saveAddress").addEventListener("click", () => {
  const addressElement = document.getElementById("address1");
  const saveMessageSpan = document.getElementById("saveMessage");
  const address = { value: addressElement.value };
  try {
    browser.storage.local.set({ address });
    browser.tabs.reload({ bypassCache: true });
  } catch (e) {
    saveMessageSpan.textContent = `Noe gikk galt ved lagring av adresse.. :/ Sjekk utviklerverktøy for mer info. ${e.message}`;
    console.error(e);
  }
});
