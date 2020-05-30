export default function setPricesInDOM(pricePerSquareMetre, housingCard) {
  const priceKvmContentDiv = document.createElement('div')
  const priceKvmTextDiv = document.createElement('div')
  const priceKvmPriceDiv = document.createElement('div')
  priceKvmContentDiv.classList.add('ads__unit__content__keys', 'priceSqm')
  priceKvmPriceDiv.textContent = pricePerSquareMetre
  priceKvmTextDiv.textContent = "Pris per kvadratmeter"
  priceKvmContentDiv.append(priceKvmTextDiv, priceKvmPriceDiv)
  housingCard.appendChild(priceKvmContentDiv)
}